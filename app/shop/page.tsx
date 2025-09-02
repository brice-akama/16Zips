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

// Server-side rendering page
export default async function Page({ searchParams }: { searchParams?: { category?: string } }) {
  const categorySlug = searchParams?.category;

  // Fetch products filtered by category if present
  const [products, categorySEO] = await Promise.all([
    fetchProducts(categorySlug), // pass category slug to backend
    categorySlug ? fetchCategorySEO(categorySlug) : Promise.resolve(null),
  ]);

  return <ShopPage categorySlug={categorySlug} products={products} categorySEO={categorySEO} />;
}
