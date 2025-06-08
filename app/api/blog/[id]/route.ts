import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import slugify from 'slugify';
import { ObjectId } from 'mongodb';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

// Helper function to convert ReadableStream to Buffer
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

// Helper function to upload to Cloudinary
async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  console.log(`🖼️ Uploading to Cloudinary - Folder: ${folder}`);
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("❌ Error uploading image to Cloudinary:", error);
          reject(error);
        } else if (result) {
          console.log("✅ Image uploaded successfully:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

// Helper function for translation
async function translateText(text: string, source: string, target: string) {
  console.log(`🌍 Translating text from ${source} to ${target}:`, text);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, target }),
  });

  const data = await response.json();
  console.log("✅ Translation result:", data);
  return data.translatedText || text;
}

// Updated response format to include the `id` inside a `data` object
export async function POST(req: Request) {
  try {
    console.log("📝 POST request received: Creating new blog post");
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const imageFile = formData.get('image') as File | null;
    const languages = ['en', 'fr', 'es', 'it'];

    console.log("📝 Title, Content, Author, Category:", title, content, author, category);

    const slug = slugify(title, { lower: true });
    console.log("🔑 Slug generated:", slug);

    let imageUrl = '';
    if (imageFile) {
      const imageBuffer = await streamToBuffer(imageFile.stream());
      imageUrl = await uploadToCloudinary(imageBuffer, 'news');
    }

    // Handle translations
    const translations: { [key: string]: { title: string; content: string } } = {};
    for (let lang of languages) {
      translations[lang] = {
        title: await translateText(title, 'en', lang),
        content: await translateText(content, 'en', lang),
      };
    }

    console.log("🌍 Translations:", translations);

    const client = await clientPromise;
    const db = client.db("school-project");
    const result = await db.collection('news').insertOne({
      title,
      slug,
      content,
      author,
      category,
      imageUrl,
      translations,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Blog post inserted with ID:", result.insertedId);

    return NextResponse.json({
      data: {
        id: result.insertedId.toString(), // Return id in the format that React-Admin expects
        title,
        slug,
        content,
        author,
        category,
        imageUrl,
        translations,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("❌ Error in POST request:", error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// Fetch all blog posts or just the latest 3
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Get parameters
  const id: string | null = searchParams.get("id");
  const slug: string | null = searchParams.get("slug");
  const lang: string = searchParams.get("lang") || "en";
  const limit: string | null = searchParams.get("limit");
  const category: string | null = searchParams.get("category");

  console.log("ID received:", id);

  const client = await clientPromise;
  const db = client.db("school-project");

  try {
    if (id) {
      console.log(`🔎 Fetching blog post with ID: ${id}`);

      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
      }

      const post = await db.collection("news").findOne({ _id: new ObjectId(id) });

      if (!post) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }

      const translatedPost = {
        ...post,
        id: post._id.toString(), // ✅ Convert _id to id
        title: post.translations?.[lang]?.title || post.title,
        content: post.translations?.[lang]?.content || post.content,
      };

      console.log("✅ Found post:", translatedPost);
      return NextResponse.json({ data: translatedPost }); // ✅ Ensures { data: { id: ..., ... } }
    }

    if (slug) {
      console.log(`🔎 Fetching blog post with slug: ${slug}`);
      const post = await db.collection("news").findOne({ slug });

      if (!post) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }

      const translatedPost = {
        ...post,
        id: post._id.toString(), // ✅ Convert _id to id
        title: post.translations?.[lang]?.title || post.title,
        content: post.translations?.[lang]?.content || post.content,
      };

      console.log("✅ Found post:", translatedPost);
      return NextResponse.json({ data: translatedPost }); // ✅ Ensures { data: { id: ..., ... } }
    }

    // Fetch all posts
    const query: Record<string, string> = {};
    if (category) {
      query.category = category;
    }

    const posts = await db
      .collection("news")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? Number(limit) : 0)
      .toArray();

    const translatedPosts = posts.map((post) => ({
      ...post,
      id: post._id.toString(), // ✅ Convert _id to id
      title: post.translations?.[lang]?.title || post.title,
      content: post.translations?.[lang]?.content || post.content,
    }));

    return NextResponse.json({
      data: translatedPosts,
      total: translatedPosts.length,
    });
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    console.log("🗑️ DELETE request received");

    // Extract the ID from the request URL path
    const urlParts = req.url.split("/");
    const id = urlParts[urlParts.length - 1]; // Last segment is the ID

    if (!id || !ObjectId.isValid(id)) {
      console.error("❌ Invalid or missing ID");
      return NextResponse.json({ error: "Invalid or missing blog ID" }, { status: 400 });
    }

    console.log(`🆔 Deleting blog post with ID: ${id}`);
    const client = await clientPromise;
    const db = client.db("school-project");

    const post = await db.collection("news").findOne({ _id: new ObjectId(id) });

    if (!post) {
      console.error("🚫 Blog post not found");
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (post.imageUrl) {
      const publicId = post.imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        console.log(`🖼️ Deleting image from Cloudinary: ${publicId}`);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete the blog post from the database
    const result = await db.collection("news").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      console.error("🚫 Failed to delete blog post");
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    console.log("✅ Blog post deleted successfully");
    return NextResponse.json({ message: "Blog post deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting blog post:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    // Extract 'id' from the URL
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    console.log("🆔 ID from URL:", id);

    // Parse form data
    const formData = await req.formData();
    const formId = formData.get("id") as string; // Get 'id' from form data

    console.log("📝 Form ID from FormData:", formId);

    // If 'id' from URL is missing or invalid, use the one from FormData
    if (!id || !ObjectId.isValid(id)) {
      id = formId;
      console.log("🔄 ID from FormData used:", id);
    }

    console.log("🆔 Final ID used (URL or FormData):", id);

    if (!id || !ObjectId.isValid(id)) {
      console.log("❌ Invalid ID received:", id);
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    // MongoDB connection and client initialization
    const client = await clientPromise;
    const db = client.db("school-project");

    console.log("✅ Database connected");

    // Fetch the existing blog post
    const blog = await db.collection("news").findOne({ _id: new ObjectId(id) });

    if (!blog) {
      console.log("❌ Blog post not found for ID:", id);
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    console.log("📚 Blog found:", blog);

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File | null;
    const slug = slugify(title, { lower: true });

    console.log("📩 Form Data:", { title, content, author, category });

    let imageUrl = blog.imageUrl; // Default to existing image

    // Update text fields
    const updateResult = await db.collection("news").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          slug,
          content,
          author,
          category,
          updatedAt: new Date(),
        },
      }
    );

    console.log("✅ Blog text updated:", updateResult);

    // Handle image upload if a new file is provided
    if (imageFile) {
      console.log("📤 Uploading new image...");

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blog_images", resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.error("❌ Image upload error:", error);
              reject(error);
            } else {
              console.log("✅ Cloudinary upload result:", result);
              resolve(result as { secure_url: string });
            }
          }
        ).end(buffer);
      });

      imageUrl = uploadResponse.secure_url;

      // Update image URL in database
      const imageUpdateResult = await db.collection("news").updateOne(
        { _id: new ObjectId(id) },
        { $set: { imageUrl } }
      );

      console.log("✅ Image URL updated in DB:", imageUpdateResult);
    }

    // ✅ Fetch the updated blog post and return it with id instead of _id
    const updatedBlog = await db.collection("news").findOne({ _id: new ObjectId(id) });

    console.log("🔄 Returning updated blog post:", updatedBlog);

    return NextResponse.json({
      ...updatedBlog,
      id: updatedBlog?._id?.toString(), // Convert _id to id
    });

  } catch (error) {
    console.error("❌ Error updating blog post:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}