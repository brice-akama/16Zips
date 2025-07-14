// app/api/contact/route.ts (or wherever your API route is)

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
  const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
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

    // Sanitize inputs
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

    // Save message to MongoDB
    const client = await clientPromise;
    const db = client.db("school-project");
    const collection = db.collection("contact_messages");

    await collection.insertOne({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      submittedAt: new Date(),
    });

    // Nodemailer transport using Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",  // Zoho SMTP server
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER!, // Your Zoho email (e.g. info@16zip.com)
        pass: process.env.EMAIL_PASS!, // Your Zoho email password or app password
      },
    });

    // Verify SMTP connection before sending email (for debugging)
    await transporter.verify();

    await transporter.sendMail({
      from: `"16Zip Website" <${process.env.EMAIL_USER}>`, // Must match authenticated user
      to: process.env.EMAIL_USER, // Send to your inbox to receive messages
      replyTo: sanitizedEmail, // Reply goes to visitor
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
