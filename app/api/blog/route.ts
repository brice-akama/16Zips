import clientPromise from '../../lib/mongodb';
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import slugify from 'slugify';
import { ObjectId } from 'mongodb';
import sanitizeHtml from 'sanitize-html';
import { safeGet, safeSet, safeDelPattern } from '@/lib/redis';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

// -------------------- Helpers --------------------
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

async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) reject(error);
      else if (result) resolve(result.secure_url);
    });
    Readable.from(buffer).pipe(uploadStream);
  });
}

async function translateText(text: string, source: string, target: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, target }),
  });
  const data = await response.json();
  return data.translatedText || text;
}

const sanitize = (input: string) =>
  sanitizeHtml(input, {
    allowedTags: ['b','i','em','strong','a','ul','ol','li','p','br','img'],
    allowedAttributes: { a:['href','target'], img:['src','alt','title','width','height'] },
    allowedSchemes: ['http','https','data'],
  });

// -------------------- POST Blog --------------------
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = sanitize(formData.get('title') as string);
    const content = sanitize(formData.get('content') as string);
    const author = sanitize(formData.get('author') as string);
    const category = sanitize(formData.get('category') as string);
    const metaTitle = sanitize(formData.get('metaTitle') as string);
    const metaDescription = sanitize(formData.get('metaDescription') as string);
    const imageFile = formData.get('image') as File | null;

    let imageUrl = '';
    if (imageFile) {
      const imageBuffer = await streamToBuffer(imageFile.stream());
      imageUrl = await uploadToCloudinary(imageBuffer, 'news');
    }

    const slug = slugify(title, { lower: true });
    const languages = ['en','fr','es','it'];
    const translations: any = {};
    for (let lang of languages) {
      translations[lang] = {
        title: sanitize(await translateText(title, 'en', lang)),
        content: sanitize(await translateText(content, 'en', lang)),
        metaTitle: sanitize(await translateText(metaTitle, 'en', lang)),
        metaDescription: sanitize(await translateText(metaDescription, 'en', lang)),
      };
    }

    const client = await clientPromise;
    const db = client.db("school-project");
    const result = await db.collection('news').insertOne({
      title, slug, content, author, category, imageUrl, metaTitle, metaDescription,
      translations, createdAt: new Date(), updatedAt: new Date(),
    });

    // ✅ Clear Redis search cache
    await safeDelPattern("search:*");

    return NextResponse.json({
      data: { id: result.insertedId.toString(), title, slug, content, author, category, imageUrl, metaTitle, metaDescription, translations },
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Error in POST request:", error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// -------------------- GET Blog with Redis --------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id: string | null = searchParams.get("id");
  const slug: string | null = searchParams.get("slug");
  const lang: string = searchParams.get("lang") || "en";
  const limit: string | null = searchParams.get("limit");
  const page: string | null = searchParams.get("page");
  const category: string | null = searchParams.get("category");

  const client = await clientPromise;
  const db = client.db("school-project");

  try {
    // Redis cache key
    const cacheKey = id ? `news:id:${id}:lang:${lang}`
      : slug ? `news:slug:${slug}:lang:${lang}`
      : `news:all:lang:${lang}:category:${category || 'all'}:limit:${limit || 'all'}:page:${page || 1}`;

    // ✅ Try Redis cache first
    const cached = await safeGet(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    let resultData: any;

    if (id) {
      if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
      const post = await db.collection("news").findOne({ _id: new ObjectId(id) });
      if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

      resultData = {
        data: {
          ...post,
          id: post._id.toString(),
          title: post.translations?.[lang]?.title || post.title,
          content: post.translations?.[lang]?.content || post.content,
          metaTitle: post.translations?.[lang]?.metaTitle || post.metaTitle,
          metaDescription: post.translations?.[lang]?.metaDescription || post.metaDescription,
        }
      };
    } else if (slug) {
      const post = await db.collection("news").findOne({ slug });
      if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

      resultData = {
        data: {
          ...post,
          id: post._id.toString(),
          title: post.translations?.[lang]?.title || post.title,
          content: post.translations?.[lang]?.content || post.content,
          metaTitle: post.translations?.[lang]?.metaTitle || post.metaTitle,
          metaDescription: post.translations?.[lang]?.metaDescription || post.metaDescription,
        }
      };
    } else {
      const query: Record<string, string> = {};
      if (category) query.category = category;

      const isPaginated = limit !== null || page !== null;

      let posts = [];
      let totalPosts = 0;

      if (isPaginated) {
        const limitNumber = Number(limit || 10);
        const pageNumber = Number(page || 1);
        const skip = (pageNumber - 1) * limitNumber;

        totalPosts = await db.collection("news").countDocuments(query);

        posts = await db.collection("news")
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNumber)
          .toArray();
      } else {
        posts = await db.collection("news")
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();
        totalPosts = posts.length;
      }

      const translatedPosts = posts.map((post) => ({
        ...post,
        id: post._id.toString(),
        title: post.translations?.[lang]?.title || post.title,
        content: post.translations?.[lang]?.content || post.content,
      }));

      resultData = { data: translatedPosts, total: totalPosts };
    }

    // ✅ Save GET result in Redis for 60s
    await safeSet(cacheKey, JSON.stringify(resultData), 60);

    return NextResponse.json(resultData);

  } catch (error) {
    console.error("❌ Error fetching blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

// -------------------- DELETE Blog --------------------
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");
    if (!id) {
      const body = await req.json();
      id = body.id;
    }

    if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid or missing blog ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("school-project");

    const post = await db.collection("news").findOne({ _id: new ObjectId(id) });
    if (!post) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });

    if (post.imageUrl) {
      const publicId = post.imageUrl.split('/').pop()?.split('.')[0];
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await db.collection("news").deleteOne({ _id: new ObjectId(id) });

    // ✅ Clear Redis cache after deletion
    await safeDelPattern("news:*");
    await safeDelPattern("search:*");

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting blog post:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}

// -------------------- PUT Blog --------------------
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const imageFile = formData.get('image') as File | null;

    const languages = ['en','fr','es','it'];
    let imageUrl = '';
    if (imageFile) {
      const imageBuffer = await streamToBuffer(imageFile.stream());
      imageUrl = await uploadToCloudinary(imageBuffer, 'news');
    }

    const slug = slugify(title, { lower: true });
    const translations: any = {};
    for (let lang of languages) {
      translations[lang] = {
        title: await translateText(title, 'en', lang),
        content: await translateText(content, 'en', lang),
        metaTitle: await translateText(metaTitle, 'en', lang),
        metaDescription: await translateText(metaDescription, 'en', lang),
      };
    }

    const client = await clientPromise;
    const db = client.db("school-project");

    const updateFields: any = { title, content, author, category, metaTitle, metaDescription, slug, translations, updatedAt: new Date() };
    if (imageUrl) updateFields.imageUrl = imageUrl;

    await db.collection('news').updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    // ✅ Clear Redis cache after update
    await safeDelPattern("news:*");
    await safeDelPattern("search:*");

    return NextResponse.json({ message: "Blog post updated successfully", data: { id, ...updateFields } });
  } catch (error) {
    console.error("❌ Error updating blog post:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}
