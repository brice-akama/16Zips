import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import clientPromise from '../../lib/mongodb';
import { ObjectId } from "mongodb";
import sanitizeHtml from "sanitize-html";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

function sanitizeInput(input: any) {
  return typeof input === "string"
    ? sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
      })
    : input;
}

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("school-project");

    const url = new URL(req.url);
    const fetchAll = url.searchParams.get("all") === "true";
    const slug = url.searchParams.get("slug");

    if (slug) {
      const cleanSlug = sanitizeInput(slug);
      const category = await db.collection("categories").findOne({ slug: cleanSlug });

      if (!category) {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
      }

      const formatted = {
        ...category,
        id: category._id.toString(),
        _id: undefined,
      };

      return NextResponse.json({ data: formatted }, { status: 200 });
    }

    if (fetchAll) {
      const categories = await db.collection("categories").find().toArray();

      const formatted = categories.map(cat => ({
        ...cat,
        id: cat._id.toString(),
        _id: undefined,
      }));

      return NextResponse.json({
        data: formatted,
        total: formatted.length,
      }, { status: 200 });
    }

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      db.collection("categories").find().skip(skip).limit(limit).toArray(),
      db.collection("categories").countDocuments(),
    ]);

    const formatted = categories.map(cat => ({
      ...cat,
      id: cat._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json({
      data: formatted,
      total,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const formData = await req.formData();

    const category: any = {
      name: sanitizeInput(formData.get("name")),
      slug: sanitizeInput(formData.get("slug")),
      description: sanitizeInput(formData.get("description")),
      metaTitle: sanitizeInput(formData.get("metaTitle")),
      metaDescription: sanitizeInput(formData.get("metaDescription")),
    };

    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        bufferToStream(buffer).pipe(uploadStream);
      });

      category.imageUrl = (uploadResult as any).secure_url;
      category.imagePublicId = (uploadResult as any).public_id;
    }

    const result = await db.collection("categories").insertOne(category);

    return NextResponse.json({ message: "Category created", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid or missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("school-project");

    const formData = await req.formData();

    const updatedCategory: any = {
      name: sanitizeInput(formData.get("name")),
      slug: sanitizeInput(formData.get("slug")),
      description: sanitizeInput(formData.get("description")),
      metaTitle: sanitizeInput(formData.get("metaTitle")),
      metaDescription: sanitizeInput(formData.get("metaDescription")),
    };

    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        bufferToStream(buffer).pipe(uploadStream);
      });

      updatedCategory.imageUrl = (uploadResult as any).secure_url;
    }

    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedCategory }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "No category found to update" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ message: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid or missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("school-project");

    const category = await db.collection("categories").findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    await db.collection("categories").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Category and image deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
  }
}
