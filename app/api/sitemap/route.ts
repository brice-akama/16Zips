import { SitemapStream, streamToPromise } from 'sitemap';
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb'; // Import MongoDB client promise

// Function to fetch products from MongoDB
const getProducts = async () => {
  const client = await clientPromise;  // Wait for the MongoDB client
  const db = client.db("school-project");  // Connect to the default database

  // Query the products collection to get all products with slugs
  const products = await db.collection('products').find({}, { projection: { slug: 1 } }).toArray();

  return products;
};

// ✅ Fetch blogs
const getBlogs = async () => {
  const client = await clientPromise;
  const db = client.db("school-project");
  return db.collection('news').find({}, { projection: { slug: 1 } }).toArray();
};

export async function GET() {
  const sitemap = new SitemapStream({ hostname: 'https://www.16zip.com' });

  // Static URLs for the site
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about-us', changefreq: 'weekly', priority: 0.8 });
  sitemap.write({ url: '/contact-us', changefreq: 'monthly', priority: 0.6 });
  sitemap.write({ url: '/privacy-policy', changefreq: 'monthly', priority: 0.6 });
  sitemap.write({ url: '/refund-policy', changefreq: 'monthly', priority: 0.6 });
   sitemap.write({ url: '/shop', changefreq: 'monthly', priority: 0.6 });
    sitemap.write({ url: '/shipping-info', changefreq: 'monthly', priority: 0.6 });
     sitemap.write({ url: '/support', changefreq: 'monthly', priority: 0.6 });
      sitemap.write({ url: '/terms', changefreq: 'monthly', priority: 0.6 });
       sitemap.write({ url: '/blog', changefreq: 'monthly', priority: 0.6 });
        sitemap.write({ url: '/cookie-policy', changefreq: 'monthly', priority: 0.6 });
         sitemap.write({ url: '/faqs', changefreq: 'monthly', priority: 0.6 });
         
        

  try {
    // Fetch product data from MongoDB
    const [products, news] = await Promise.all([getProducts(), getBlogs()]);

    // Add product URLs to the sitemap
    products.forEach((product) => {
      // Ensure the slug exists before adding to the sitemap
      if (product.slug) {
        sitemap.write({
          url: `/products/${product.slug}`,  // Dynamic product URL
          changefreq: 'daily',
          priority: 0.7,
        });
      }
    });

    // ✅ Add blog URLs
    news.forEach((blog) => {
      if (blog.slug) {
        sitemap.write({
          url: `/blog/${blog.slug}`,
          changefreq: 'weekly',
          priority: 0.65,
        });
      }
    });

    sitemap.end();

    // Return the sitemap as XML
    const sitemapXml = await streamToPromise(sitemap);
    return new NextResponse(sitemapXml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}