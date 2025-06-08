import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie"; // Ensure this import is correct

const SECRET_KEY = process.env.JWT_SECRET_KEY!;

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = cookie.parse(cookieHeader || ''); // Parsing the cookies from the header
  const token = cookies.auth_token; // Getting the auth_token from the parsed cookies

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ message: "Token is valid", user: decoded });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

