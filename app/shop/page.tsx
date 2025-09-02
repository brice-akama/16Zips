import ShopPage from "./ShopPage";

// Helper to normalize category to slug
function categoryToSlug(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

// Fetch products from backend, optionally filtered by category
async function fetchProducts(category?: string) {
  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
  if (category) {
    url += `?category=${category}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

// Fetch category SEO info
async function fetchCategorySEO(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category?slug=${slug}`);
  const data = await res.json();
  return data?.data || null;
}

// **New helper: fetch Best Selling products (4 only)**
async function fetchBestSellingProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?popularProduct=true`);
  const data = await res.json();
  return Array.isArray(data.data) ? data.data.slice(0, 4) : []; // only 4 products
}

// Server-side rendering page
export default async function Page({ searchParams }: { searchParams?: { category?: string } }) {
  const categorySlug = searchParams?.category;

  // Fetch products filtered by category + SEO + best selling products
  const [products, categorySEO, bestSellingProducts] = await Promise.all([
    fetchProducts(categorySlug), // category products
    categorySlug ? fetchCategorySEO(categorySlug) : Promise.resolve(null), // SEO info
    fetchBestSellingProducts(), // best selling products
  ]);

  // Pass bestSellingProducts as a prop to ShopPage
  return (
    <ShopPage
      categorySlug={categorySlug}
      products={products}
      categorySEO={categorySEO}
      bestSellingProducts={bestSellingProducts} // ✅ added
    />
  );
}
