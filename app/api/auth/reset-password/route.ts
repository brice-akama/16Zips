import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import bcrypt from "bcryptjs";
import clientPromise from "../../../lib/mongodb";

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const cleanPassword = sanitizeHtml(password, { allowedTags: [], allowedAttributes: {} });

    // Decode the token
    let decoded: any;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const email = decoded.email;
    const client = await clientPromise;
    const db = client.db("school-project");
    const adminCollection = db.collection("admins");

    const admin = await adminCollection.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Email not recognized" }, { status: 401 });
    }

    const hashed = await bcrypt.hash(cleanPassword, 10);

    await adminCollection.updateOne(
      { email },
      { $set: { passwordHash: hashed, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
