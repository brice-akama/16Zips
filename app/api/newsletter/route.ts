import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

// Temporary in-memory rate limiting store (use Redis in production)
const ipRequests: Record<string, { attempts: number; lastRequestTime: number }> = {};

// Simple sanitization function to strip dangerous characters
function sanitizeInput(input: string): string {
  return input.replace(/[<>\/\\$'"`{};]/g, "").trim();
}

// Regex for basic but stronger email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 10 * 60 * 1000;

  const now = Date.now();
  const entry = ipRequests[ip];

  if (!entry) {
    ipRequests[ip] = { attempts: 1, lastRequestTime: now };
    return true;
  }

  if (now - entry.lastRequestTime < WINDOW_MS) {
    if (entry.attempts >= MAX_ATTEMPTS) return false;
    ipRequests[ip].attempts += 1;
  } else {
    ipRequests[ip] = { attempts: 1, lastRequestTime: now };
  }

  return true;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      (req as any).socket?.remoteAddress ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();

    // Prevent prototype pollution
    if (typeof body !== "object" || Array.isArray(body) || body === null) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const rawEmail = body.email;
if (!rawEmail) {
  return NextResponse.json({ error: "Email is required" }, { status: 400 });
}

    const sanitizedEmail = sanitizeInput(rawEmail);

    // Validate email format

if (!isValidEmail(sanitizedEmail)) {
  return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
}



    const client = await clientPromise;
    const db = client.db("school-project");
    const collection = db.collection("newsletters");

    // Prevent NoSQL injection by only querying on sanitized field
    const existing = await collection.findOne({ email: sanitizedEmail });

    if (existing) {
      return NextResponse.json(
        { message: "This email is already subscribed" },
        { status: 409 }
      );
    }

    await collection.insertOne({
      email: sanitizedEmail,
      subscribedAt: new Date(),
    });

    return new NextResponse(
      JSON.stringify({ message: "Successfully subscribed to the newsletter" }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Content-Security-Policy": "default-src 'none';",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const collection = db.collection("newsletters");

    const newsletters = await collection.find({}).toArray();

    // Convert _id to id and stringify ObjectId
    const formattedNewsletters = newsletters.map((item) => ({
      ...item,
      id: item._id.toString(),  // React Admin expects `id`
      _id: undefined,           // Optional: remove _id for clarity
    }));

    return NextResponse.json(formattedNewsletters, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletters" },
      { status: 500 }
    );
  }
}

