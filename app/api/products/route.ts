import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import slugify from 'slugify';
import clientPromise from '../../lib/mongodb';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import sanitizeHTML  from 'sanitize-html';


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

// Helper function to convert file to a stream for Cloudinary upload
const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null); // signals the end of the stream
  return readable;
};

// Product Schema Interface
interface Product {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  edibles: boolean;
  popularProduct: boolean;
  mainImage: string;
  thumbnails: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  isPublished: boolean;
  weights?: { label: string; price: number }[]; // Optional field
  seeds?: { label: string; price: number }[]; // Optional field
  relatedProductIds?: ObjectId[];
}


// Helper function to sanitize inputs
const sanitizeInput = (input: string) => {
  // Sanitize the input to remove harmful code (like <script> tags)
  return sanitizeHTML(input, {
    allowedTags: [ 'b', 'i', 'em', 'strong', 'u', 'p', 'br', 'a', 'ul', 'ol', 'li' ], // Allowed HTML tags
    allowedAttributes: { '*': [ 'href', 'target' ] }, // Allow <a> tag to have href and target attributes
    allowedIframeHostnames: [ 'www.youtube.com', 'player.vimeo.com' ], // Example of safe iframe
  });
}

// Translate text helper
async function translateText(text: string, source: string, target: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, target }),
  });

  const data = await response.json();
  return data.translatedText || text;
}


// Handle Product Creation (POST request)
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData(); // Handle FormData in Next.js
    console.log('Received form data:', form);

    const name = sanitizeInput(form.get('name') as string);
    const description = sanitizeInput(form.get('description') as string);
    const price = parseFloat(form.get('price') as string);
    const category = sanitizeInput(form.get('category') as string);
    const edibles = form.get('edibles') === 'true';
    const popularProduct = form.get('popularProduct') === 'true';
    const seoTitle = sanitizeInput(form.get('seoTitle') as string);
    const seoDescription = sanitizeInput(form.get('seoDescription') as string);
    const seoKeywords = sanitizeInput(form.get('seoKeywords') as string);
    const isPublished = form.get('isPublished') === 'true';

    // Parse weights and seeds as arrays of objects
    const weights = JSON.parse(form.get('weights') as string) || []; // [{ label: "1g", price: 10 }]
    const seeds = JSON.parse(form.get('seeds') as string) || []; // [{ label: "5 seeds", price: 30 }]

    const mainImage = form.get('mainImage') as File;
    const thumbnails = Array.from(form.getAll('thumbnails'));

    console.log('Thumbnails received:', thumbnails);
   
    // Translate to other languages
    const translations = {
      fr: {
        name: await translateText(name, 'en', 'fr'),
        description: await translateText(description, 'en', 'fr'),
        category: await translateText(category, 'en', 'fr'),
        seoTitle: await translateText(seoTitle || '', 'en', 'fr'),
        seoDescription: await translateText(seoDescription || '', 'en', 'fr'),
        seoKeywords: await translateText(seoKeywords || '', 'en', 'fr'),
      },
      es: {
        name: await translateText(name, 'en', 'es'),
        description: await translateText(description, 'en', 'es'),
        category: await translateText(category, 'en', 'es'),
        seoTitle: await translateText(seoTitle || '', 'en', 'es'),
        seoDescription: await translateText(seoDescription || '', 'en', 'es'),
        seoKeywords: await translateText(seoKeywords || '', 'en', 'es'),
      },
      it: {
        name: await translateText(name, 'en', 'it'),
        description: await translateText(description, 'en', 'it'),
        category: await translateText(category, 'en', 'it'),
        seoTitle: await translateText(seoTitle || '', 'en', 'it'),
        seoDescription: await translateText(seoDescription || '', 'en', 'it'),
        seoKeywords: await translateText(seoKeywords || '', 'en', 'it'),
      }
    };

    // Validate required fields
    if (!name || !description || !price || !category || !mainImage) {
      console.error('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // Upload main image to Cloudinary
    console.log('Uploading main image...');
    const mainImageBuffer = Buffer.from(await mainImage.arrayBuffer()); // Convert to buffer
    const mainImageStream = bufferToStream(mainImageBuffer);

    const mainImageUpload = await new Promise<any>((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { folder: 'products/main' },
        (error, result) => {
          if (error) {
            console.error('Main image upload error:', error);
            reject(error);
          } else {
            console.log('Main image uploaded successfully:', result?.secure_url);
            resolve(result);
          }
        }
      ).end(mainImageBuffer);
    });

    // Upload thumbnails to Cloudinary
    console.log('Uploading thumbnails...');
    const uploadedThumbnails = await Promise.all(
      thumbnails.map(async (thumbnail: FormDataEntryValue, index) => {
        if (thumbnail instanceof File) { // Ensure it's a File object
          console.log(`Processing thumbnail ${index + 1}:`, thumbnail.name);

          const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
          console.log(`Thumbnail ${index + 1} buffer size:`, thumbnailBuffer.length);

          const upload = await new Promise<{ secure_url: string } | null>((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
              { folder: 'products/thumbnails' },
              (error, result) => {
                if (error) {
                  console.error(`Thumbnail ${index + 1} upload error:`, error);
                  reject(error);
                } else {
                  console.log(`Thumbnail ${index + 1} uploaded successfully:`, result?.secure_url);
                  resolve(result as { secure_url: string });
                }
              }
            ).end(thumbnailBuffer);
          });

          return upload?.secure_url || null;
        }

        console.warn(`Skipping invalid thumbnail ${index + 1}:`, thumbnail);
        return null; // Handle non-File values gracefully
      })
    );

    console.log('Final uploaded thumbnails:', uploadedThumbnails.filter(Boolean));

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("school-project");

    // Generate a MongoDB ObjectId
    const newId = new ObjectId().toHexString();

    // Insert product into the database
    const newProduct: Product & { translations: any } = {
      _id: new ObjectId(newId),
      name,
      slug,
      description,
      price,
      category,
      edibles,
      popularProduct,
      mainImage: mainImageUpload?.secure_url || '',
      thumbnails: uploadedThumbnails.filter(Boolean) as string[],
      seoTitle,
      seoDescription,
      seoKeywords,
      isPublished,
      weights, // Store weights as array of objects
      seeds,   // Store seeds as array of objects
      translations,
    };
    

    console.log('Saving product to database:', newProduct);
    await db.collection('products').insertOne(newProduct);

   // Find related products based on name, category, and similar price range
const relatedProducts = await db.collection('products')
.find({
  _id: { $ne: new ObjectId(newId) }, // exclude the current product
  category: newProduct.category,
  price: { $gte: newProduct.price * 0.7, $lte: newProduct.price * 1.3 } // within ±30%
})
.limit(4)
.project({ _id: 1 }) // only get the _id
.toArray();

// Extract the _id of related products
const relatedProductIds = relatedProducts.map(p => p._id);

// Update the product with related product references
await db.collection('products').updateOne(
{ _id: new ObjectId(newId) },
{ $set: { relatedProductIds } } // Make sure the field name is consistent with the schema
);

const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(newId) });

return NextResponse.json({
message: 'Product created successfully',
product: updatedProduct,
}, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



// Handle Product Fetching (GET request)
// Handle Product Fetching (GET request with pagination)
export async function GET(req: NextRequest) {
  try {
    console.log("Fetching product data...");

    const client = await clientPromise;
    const db = client.db("school-project");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const edibles = searchParams.get("edibles") === "true";
    const popularProduct = searchParams.get("popularProduct") === "true";

    // Pagination (optional)
   // Pagination (optional)
const pageParam = searchParams.get("page") || searchParams.get("_page");
const perPageParam = searchParams.get("perPage") || searchParams.get("_limit");
const limitParam = searchParams.get("limit"); // 👈 new addition

let skip = 0;
let limit = 0;

if (pageParam && perPageParam) {
  const page = parseInt(pageParam, 10);
  const perPage = parseInt(perPageParam, 10);
  skip = (page - 1) * perPage;
  limit = perPage;
} else if (limitParam) {
  limit = parseInt(limitParam, 10); // 👈 now supports limit=4 directly
}


    // Sorting
    const sortField = searchParams.get("sort") || searchParams.get("_sort") || "createdAt";
    const sortOrder =
      (searchParams.get("order") || searchParams.get("_order") || "desc").toLowerCase() === "asc" ? 1 : -1;

    console.log("Request received", {
      id,
      slug,
      edibles,
      popularProduct,
      skip,
      limit,
      sortField,
      sortOrder,
    });

    // Fetch by ID
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
      const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ data: { id: product._id.toString(), ...product } }, { status: 200 });
    }

     // Fetch product by slug
     if (slug) {
      const product = await db.collection("products").findOne({ slug });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Fetch related products based on the relatedProductIds field
      const relatedProducts = await db.collection("products").find({
        _id: {
          $in: product.relatedProductIds.map((id: string) => new ObjectId(id)),
        },
      }).toArray();
      

      return NextResponse.json({
        data: {
          id: product._id.toString(),
          ...product,
          relatedProducts: relatedProducts.map((relatedProduct) => ({
            id: relatedProduct._id.toString(),
            name: relatedProduct.name,
            slug: relatedProduct.slug,
            mainImage: relatedProduct.mainImage,
            price: relatedProduct.price
          }))
        }
      }, { status: 200 });
    }

    

    // Fetch all with filters
    const filter: any = {};
    if (edibles) filter.edibles = true;
    if (popularProduct) filter.popularProduct = true;

    const totalCount = await db.collection("products").countDocuments(filter);

    // --- Handle category filtering ---
// --- Handle category filtering ---
// --- Handle category filtering ---
const categoryQuery = searchParams.get("category");
if (categoryQuery) {
  // Convert URL slug to DB category match (ignore case)
  const formattedCategory = categoryQuery.replace(/-/g, " "); // e.g. vape-cartridges → vape cartridges

  // Special handling for known exceptions
  let regexString = formattedCategory;

  // If category is 'disposables vapes', allow matching 'disposables' or 'disposables vapes'
  if (formattedCategory === "disposables vapes") {
    regexString = "disposables( vapes)?";
  }

  // Use a loose regex match
  filter.category = { $regex: new RegExp(regexString, "i") };
}





    // Build query
    const query = db.collection("products").find(filter).sort({ [sortField]: sortOrder });

    if (limit > 0) {
      query.skip(skip).limit(limit);
    }

    const products = await query.toArray();

    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      ...product
    }));

    return NextResponse.json(
      {
        data: formattedProducts,
        total: totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const form = await req.formData();
    const id = form.get('id') as string;

    console.log('Received PUT request with ID:', id);

    if (!id || !ObjectId.isValid(id)) {
      console.error('Invalid or missing ID:', id);
      return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    }

    const name = sanitizeInput(form.get('name') as string);
    const description = sanitizeInput(form.get('description') as string);
    const price = parseFloat(form.get('price') as string);
    const category = sanitizeInput(form.get('category') as string);
    const seoTitle = sanitizeInput(form.get('seoTitle') as string);
    const seoDescription = sanitizeInput(form.get('seoDescription') as string);
    const seoKeywords = sanitizeInput(form.get('seoKeywords') as string);
    const isPublished = form.get('isPublished') === 'true';

    // Parsing and optional fields for weight and seeds
    const weightRaw = form.get('weights') as string;
    const seedsRaw = form.get('seeds') as string;

    // Parse weight if it exists and is a valid string (could be a JSON string of array)
    const weights = weightRaw ? JSON.parse(weightRaw) : [];
    // Parse seeds if it exists and is a valid string (could be a JSON string of array)
    const seeds = seedsRaw ? JSON.parse(seedsRaw) : [];

    const mainImage = form.get('mainImage') as File | null;
    const thumbnails = Array.from(form.getAll('thumbnails'));


    console.log('Parsed & sanitized inputs:', {
      name,
      description,
      price,
      category,
      seoTitle,
      seoDescription,
      seoKeywords,
      isPublished,
      weights,
      seeds,
    });

    const translations = {
      fr: {
        name: await translateText(name, 'en', 'fr'),
        description: await translateText(description, 'en', 'fr'),
        category: await translateText(category, 'en', 'fr'),
        seoTitle: await translateText(seoTitle || '', 'en', 'fr'),
        seoDescription: await translateText(seoDescription || '', 'en', 'fr'),
        seoKeywords: await translateText(seoKeywords || '', 'en', 'fr'),
      },
      es: {
        name: await translateText(name, 'en', 'es'),
        description: await translateText(description, 'en', 'es'),
        category: await translateText(category, 'en', 'es'),
        seoTitle: await translateText(seoTitle || '', 'en', 'es'),
        seoDescription: await translateText(seoDescription || '', 'en', 'es'),
        seoKeywords: await translateText(seoKeywords || '', 'en', 'es'),
      },
      it: {
        name: await translateText(name, 'en', 'it'),
        description: await translateText(description, 'en', 'it'),
        category: await translateText(category, 'en', 'it'),
        seoTitle: await translateText(seoTitle || '', 'en', 'it'),
        seoDescription: await translateText(seoDescription || '', 'en', 'it'),
        seoKeywords: await translateText(seoKeywords || '', 'en', 'it'),
      },
    };

    let mainImageUrl = '';
    if (mainImage && mainImage.size > 0) {
      const buffer = Buffer.from(await mainImage.arrayBuffer());
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { folder: 'products/main' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      mainImageUrl = result.secure_url;
    }

    let uploadedThumbnails: string[] = [];
    if (thumbnails.length > 0 && thumbnails[0] instanceof File) {
      uploadedThumbnails = await Promise.all(
        thumbnails.map(async (thumb: FormDataEntryValue) => {
          if (thumb instanceof File) {
            const buffer = Buffer.from(await thumb.arrayBuffer());
            const result = await new Promise<any>((resolve, reject) => {
              cloudinary.v2.uploader.upload_stream(
                { folder: 'products/thumbnails' },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              ).end(buffer);
            });
            return result.secure_url;
          }
          return null;
        })
      ).then(res => res.filter(Boolean));
    }


    const updateFields = {
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      price,
      category,
      seoTitle,
      seoDescription,
      mainImage: mainImageUrl,
      thumbnails: uploadedThumbnails,
      seoKeywords,
      isPublished,
      weights, // Optional weight array
      seeds,   // Optional seeds array
      translations,
      updatedAt: new Date(),
    };

    if (mainImageUrl) updateFields.mainImage = mainImageUrl;
    if (uploadedThumbnails.length > 0) updateFields.thumbnails = uploadedThumbnails;
    console.log('Update fields:', updateFields);

   
    

    const client = await clientPromise;
    const db = client.db('school-project');

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    console.log('MongoDB update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ✅ DELETE PRODUCT
export async function DELETE(req: NextRequest) {
  try {
    console.log("Received DELETE request");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log("Product ID:", id);

    if (!id) {
      console.error("Error: Product ID is required");
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("school-project");

    console.log("Connecting to database...");
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    console.log("Product found:", product);

    if (!product) {
      console.error("Error: Product not found");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete images from Cloudinary
    try {
      if (product.mainImage) {
        console.log("Deleting main image from Cloudinary:", product.mainImage);
        await cloudinary.v2.uploader.destroy(product.mainImage);
        console.log("Main image deleted successfully");
      }

      if (product.thumbnails?.length) {
        console.log(`Deleting ${product.thumbnails.length} thumbnails from Cloudinary...`);
        for (const thumbnail of product.thumbnails) {
          await cloudinary.v2.uploader.destroy(thumbnail);
          console.log("Deleted thumbnail:", thumbnail);
        }
      }
    } catch (cloudinaryError) {
      console.error("Error deleting images from Cloudinary:", cloudinaryError);
    }

    console.log("Deleting product from database...");
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    console.log("Product deleted successfully");

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}