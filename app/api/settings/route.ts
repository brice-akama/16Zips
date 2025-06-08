import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

// Handle GET request to fetch current settings
export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const collection = db.collection("settings");

    const settings = await collection.find().toArray();

    // Convert `_id` to `id` for React-Admin
    const formattedSettings = settings.map((item) => ({
      ...item,
      id: item._id.toString(), // React-Admin requires `id`
    }));

    // Return the response in the expected format
    return NextResponse.json(
      {
        data: formattedSettings,  // The data array
        total: formattedSettings.length  // The total count of items
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching settings", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}



// Handle POST request to create new settings
export async function POST(req: Request) {
  try {
    console.log("POST request received");

    const body = await req.json();
    console.log("Received settings:", body);

    if (!body.siteTitle || !body.logoUrl) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("school-project");
    const collection = db.collection("settings");

    const result = await collection.insertOne(body);
    console.log("Settings inserted:", result);

    return new Response(JSON.stringify({ _id: result.insertedId, ...body }), { status: 201 });
  } catch (error) {
    console.error("Error creating settings:", error);
    return new Response(JSON.stringify({ message: "Error creating settings", error: (error as Error).message }), { status: 500 });
  }
}

// Handle PUT request to update existing settings


export async function PUT(req: NextRequest) {
  try {
    console.log("PUT request received");

    // Parse JSON request body
    const updatedSettings = await req.json();
    console.log("Received updated settings:", updatedSettings);

    // Get 'id' from query parameters (React-Admin sends 'id', not '_id')
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing 'id' in query parameters" }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid 'id' format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("school-project");
    const collection = db.collection("settings");

    // Remove `_id` from the update object to prevent immutable field error
    delete updatedSettings._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Convert React-Admin `id` to MongoDB `_id`
      { $set: updatedSettings }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Settings not found" }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No changes made" }, { status: 200 });
    }

    return NextResponse.json({ message: "Settings updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { message: "Error updating settings", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}