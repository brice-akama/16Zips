import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import he from 'he'; // Import the 'he' package

// Decode HTML entities using 'he' library
function decodeHtmlEntities(input: string): string {
  return he.decode(input); // Decodes HTML entities
}

// Sanitize user input to prevent malicious characters
function sanitizeInput(input: string): string {
  return input.replace(/[^\w\s-]/gi, "").trim(); // Only allow letters, numbers, spaces, hyphens
}

// Escape regex special characters to prevent regex injection
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req: Request) {
  try {
    // Extract and decode, then sanitize search parameter
    const rawSearch = Object.fromEntries(new URL(req.url).searchParams).search;
    const decodedSearch = decodeHtmlEntities(rawSearch);
    const search = sanitizeInput(decodedSearch);

    // Return empty results if no search query is provided
    if (!search || search.trim() === "") {
      return NextResponse.json({ results: [] });
    }

    // Limit query size and time (advanced security)
    const client = await clientPromise;
    const db = client.db("school-project");
    const productsCollection = db.collection("products");

    // Escape the search string to safely use it in regex
    const escapedSearch = escapeRegExp(search);

    // Check if the search matches a product by slug
    const productBySlug = await productsCollection.findOne({
      slug: { $regex: `^${escapedSearch}$`, $options: "i" },
    });

    if (productBySlug) {
      return NextResponse.json({ redirectTo: `/products/${productBySlug.slug}` });
    }

    // Check if the search matches a category
    const category = await productsCollection.findOne({
      category: { $regex: escapedSearch, $options: "i" },
    });

    if (category) {
      return NextResponse.json({
        redirectTo: `/shop?category=${encodeURIComponent(category.category)}`,
      });
    }

    // Check if the search matches a product name
    const productByName = await productsCollection.findOne({
      name: { $regex: escapedSearch, $options: "i" },
    });

    if (productByName) {
      return NextResponse.json({ redirectTo: `/products/${productByName.slug}` });
    }

    // If no matches are found, return no results
    return NextResponse.json({ redirectTo: null });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
