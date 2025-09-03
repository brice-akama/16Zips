import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import he from "he";

// Decode HTML entities
function decodeHtmlEntities(input: string): string {
  return he.decode(input);
}

// Sanitize user input (allow letters, numbers, spaces, hyphens, and accented chars)
function sanitizeInput(input: string): string {
  return input.replace(/[^\p{L}\p{N}\s-]/gu, "").trim();
}

// Escape regex special characters
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rawSearch = url.searchParams.get("search") || "";

    const decodedSearch = decodeHtmlEntities(rawSearch);
    const sanitizedSearch = sanitizeInput(decodedSearch);

    if (!sanitizedSearch) {
      return NextResponse.json({ products: [], blogs: [] });
    }

    const client = await clientPromise;
    const db = client.db("school-project"); // Your DB name

    const productsCollection = db.collection("products");
    const blogsCollection = db.collection("news"); // Add blogs collection

    const escapedSearch = escapeRegExp(sanitizedSearch);

    // Search products
    const products = await productsCollection
      .find({
        $or: [
          { name: { $regex: escapedSearch, $options: "i" } },
          { slug: { $regex: escapedSearch, $options: "i" } },
          { category: { $regex: escapedSearch, $options: "i" } },
        ],
      })
      .toArray();

    // Search blogs
    const blogs = await blogsCollection
      .find({
        $or: [
          { title: { $regex: escapedSearch, $options: "i" } },
          { slug: { $regex: escapedSearch, $options: "i" } },
        ],
      })
      .toArray();

    return NextResponse.json({ products, blogs });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
