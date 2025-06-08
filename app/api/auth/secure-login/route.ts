import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from '../../../lib/mongodb';
import { z } from "zod";
import cookie from "cookie";
import sanitizeHtml from "sanitize-html";

// MongoDB setup
const client = await clientPromise;
const db = client.db("school-project");
const attemptsCollection = db.collection("loginAttempts");

// Environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const SECRET_KEY = process.env.JWT_SECRET_KEY!;
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 60 * 1000; // 1 hour

// Zod schema validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Sanitize inputs (especially email)
    const cleanEmail = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} });

    // Validate sanitized input
    loginSchema.parse({ email: cleanEmail, password });

    await client.connect();

    const userAttempts = await attemptsCollection.findOne({ email: cleanEmail });

    if (userAttempts) {
      const now = Date.now();
      const lastAttempt = new Date(userAttempts.lastAttempt).getTime();

      if (userAttempts.attempts >= MAX_ATTEMPTS && now - lastAttempt < BLOCK_TIME) {
        return NextResponse.json(
          { error: "Too many attempts. Please try again later." },
          { status: 429 }
        );
      }

      if (now - lastAttempt > BLOCK_TIME) {
        await attemptsCollection.updateOne({ email: cleanEmail }, { $set: { attempts: 0 } });
      }
    }

    if (cleanEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      await logFailedAttempt(cleanEmail);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign({ email: cleanEmail }, SECRET_KEY, { expiresIn: "1h" });

    // Reset login attempts on success
    await attemptsCollection.updateOne(
      { email: cleanEmail },
      { $set: { attempts: 0, lastAttempt: new Date() } },
      { upsert: true }
    );

    // Secure cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 60 * 60,
      path: "/",
    };

    const cookieHeader = cookie.serialize("auth_token", token, cookieOptions);
    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", cookieHeader);

    // Optional: Set extra security headers (Content-Security-Policy)
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'none'; object-src 'none';"
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid input or internal error" },
      { status: 400 }
    );
  }
}

// Logs failed attempts to MongoDB
async function logFailedAttempt(email: string) {
  const now = new Date();
  const existing = await attemptsCollection.findOne({ email });

  if (existing) {
    await attemptsCollection.updateOne(
      { email },
      {
        $set: { lastAttempt: now },
        $inc: { attempts: 1 },
      }
    );
  } else {
    await attemptsCollection.insertOne({
      email,
      attempts: 1,
      lastAttempt: now,
    });
  }
}
