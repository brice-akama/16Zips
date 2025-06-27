import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import sanitizeHtml from "sanitize-html";
import nodemailer from "nodemailer";

// Type for request body
type ContactFormInput = {
  name: string;
  email: string;
  message: string;
};

// In-memory rate limiting
let ipRequests: Record<string, { attempts: number; lastRequestTime: number }> = {};

// Suspicious keyword detection
function containsMaliciousContent(input: string): boolean {
  const patterns = ["<script", "onerror", "onload", "javascript:", "alert(", "%3Cscript"];
  return patterns.some((pattern) => input.toLowerCase().includes(pattern));
}

// Decode and sanitize
function sanitizeInput(input: string): string {
  try {
    const decoded = decodeURIComponent(input);
    const sanitized = sanitizeHtml(decoded, {
      allowedTags: [],
      allowedAttributes: {},
    });
    return sanitized.trim();
  } catch {
    return "";
  }
}

// Rate limiter
function checkRateLimit(ip: string): boolean {
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 10 * 60 * 1000;
  const currentTime = Date.now();
  const requestInfo = ipRequests[ip];

  if (!requestInfo) {
    ipRequests[ip] = { attempts: 1, lastRequestTime: currentTime };
    return true;
  }

  const { attempts, lastRequestTime } = requestInfo;

  if (currentTime - lastRequestTime < WINDOW_MS) {
    if (attempts >= MAX_ATTEMPTS) return false;
    ipRequests[ip].attempts += 1;
    return true;
  } else {
    ipRequests[ip] = { attempts: 1, lastRequestTime: currentTime };
    return true;
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body: ContactFormInput = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Sanitize
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    if (
      sanitizedName.length > 100 ||
      sanitizedEmail.length > 100 ||
      sanitizedMessage.length > 1000
    ) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    if (
      containsMaliciousContent(name) ||
      containsMaliciousContent(email) ||
      containsMaliciousContent(message)
    ) {
      console.warn(`🚨 Suspicious input detected from IP ${ip}`);
      return NextResponse.json({ error: "Suspicious input detected." }, { status: 400 });
    }

    // Save to DB
    const client = await clientPromise;
    const db = client.db("school-project");
    const collection = db.collection("contact_messages");

    await collection.insertOne({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      submittedAt: new Date(),
    });

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      host: "mail.16zip.com", // check your hosting email settings
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await transporter.sendMail({
  from: `"16Zip Website" <support@16zip.com>`, // authenticated sender
  to: "support@16zip.com", // your inbox receives the message
  replyTo: sanitizedEmail, // replies go to the customer
  subject: "New Contact Message from Website",
  html: `
    <h3>New Message from 16Zip Website</h3>
    <p><strong>Name:</strong> ${sanitizedName}</p>
    <p><strong>Email:</strong> ${sanitizedEmail}</p>
    <p><strong>Message:</strong></p>
    <p>${sanitizedMessage}</p>
  `,
});


    return NextResponse.json({ message: "Your message has been sent successfully." }, { status: 201 });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 });
  }
}
