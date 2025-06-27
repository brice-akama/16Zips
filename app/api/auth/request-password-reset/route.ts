import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";
import clientPromise from "../../../lib/mongodb";

const SECRET_KEY = process.env.JWT_SECRET_KEY!;
const ADMIN_EMAIL_USER = process.env.ADMIN_EMAIL_USER!;
const ADMIN_EMAIL_PASS = process.env.ADMIN_EMAIL_PASS!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const cleanEmail = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} });

    const client = await clientPromise;
    const db = client.db("school-project");
    const admin = await db.collection("admins").findOne({ email: cleanEmail });

    if (!admin) {
      return NextResponse.json({ error: "Email not recognized" }, { status: 401 });
    }

    // Create JWT token
    const resetToken = jwt.sign({ email: cleanEmail }, SECRET_KEY, { expiresIn: "15m" });
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    const transporter = nodemailer.createTransport({
      host: "mail.16zip.com",
      port: 465,
      secure: true,
      auth: {
        user: ADMIN_EMAIL_USER,
        pass: ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"16Zip Admin" <${ADMIN_EMAIL_USER}>`,
      to: cleanEmail,
      subject: "Your 16Zip Password Reset Link",
      html: `
        <p>Hello Admin,</p>
        <p>You requested a password reset. Click the link below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ message: "Password reset email sent" });

  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
