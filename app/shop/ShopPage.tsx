"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

type Props = {
  category?: string;
};



const ShopPage = ({ category }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredProduct, setHoveredProduct] = useState<string | number | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  
  const { addToWishlist } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const productsPerPage = 12;
  const searchParams = useSearchParams();
const categoryFromURL = searchParams.get("category");
const router = useRouter();
const [categorySEO, setCategorySEO] = useState<any | null>(null);


  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowCategories(false);
    // Update the URL with the selected category
    const newUrl = new URL(window.location.href);
    if (category === "All") {
      newUrl.searchParams.delete("category");
    } else {
      newUrl.searchParams.set("category", category.toLowerCase().replace(/\s+/g, "-"));
    }
    router.push(newUrl.toString());
  };
  
  

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        const productList = Array.isArray(data.data) ? data.data : [];
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch only once on mount, not every time categoryFromURL changes
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategorySEO = async () => {
      if (!categoryFromURL) return;
  
      try {
        const response = await fetch(`/api/category?slug=${categoryFromURL}`);
        const data = await response.json();
  
        if (data?.data) {
          setCategorySEO(data.data);
        }
      } catch (error) {
        console.error('Error fetching category SEO:', error);
      }
    };
  
    fetchCategorySEO();
  }, [categoryFromURL]);
  

  // Set selected category after products are loaded
  useEffect(() => {
    if (categoryFromURL && products.length > 0) {
      const uniqueCategories = ["All", ...new Set(products.map(p => p.category))];
  
      const matchedCategory =
        uniqueCategories.find(
          (cat) =>
            cat.toLowerCase().replace(/\s+/g, "-") === categoryFromURL.toLowerCase()
        ) || "All";
  
      setSelectedCategory(matchedCategory);
    }
  }, [categoryFromURL, products]);
  
  useEffect(() => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);
  

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-to-high") return Number(a.price) - Number(b.price);
    if (sortOrder === "high-to-low") return Number(b.price) - Number(a.price);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle quantity changes
  

  
  
  
  const handleAddToWishlist = (_id: string, slug: string, name: string, price: string, mainImage: string) => {
    addToWishlist({ _id, name, price, mainImage, slug });
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-20">

    
    <Head>
    <title>{categorySEO?.metaTitle || "Shop"}</title>
    <meta name="description" content={categorySEO?.metaDescription || "Browse our shop"} />
  
    <meta property="og:title" content={categorySEO?.metaTitle || "Shop"} />
    <meta property="og:description" content={categorySEO?.metaDescription || "Browse our shop"} />
    <meta property="og:image" content={categorySEO?.imageUrl || "/default-og-image.jpg"} />
  
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": categorySEO?.name || "Shop",
          "description": categorySEO?.metaDescription || "Shop category",
          "image": categorySEO?.imageUrl || "/default-og-image.jpg",
        }),
      }}
    />
  </Head>
  
  
        
    
      {/* Mobile View - Sorting & Categories */}
      <div className="md:hidden flex flex-col space-y-4 mb-6">
        <button
          className="bg-blue-600 text-white p-2 rounded"
          onClick={() => setShowCategories(!showCategories)}
        >
          Select Categories
        </button>
        {showCategories && (
          <ul className="bg-white shadow-lg rounded p-4">
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer py-2 px-4 rounded-lg ${
                  selectedCategory === category ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => handleCategoryChange(category ?? "All")}

              >
                {category}
              </li>
            ))}
          </ul>
        )}

        <select
          className="border p-2 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default Sorting</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      {/* Desktop View - Sorting on the Left */}
      {/* Desktop View - Sorting on the Right */}
      <div className="hidden md:flex justify-end items-center mt-20">
        <select
          className="border p-2 rounded w-40"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default Sorting</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
        {/* Left Sidebar - Categories */}
        <div className="hidden md:block">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer py-2 px-4 rounded-lg ${
                  selectedCategory === category ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => handleCategoryChange(category ?? "All")}

              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Section - Product Grid */}
        <div ref={productsRef} className="md:col-span-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {loading ? (
            <div>Loading products...</div>
          ) : (
            displayedProducts.map(({ _id, name, price, mainImage, slug }) => (
              <div
  key={_id}
  className="bg-gray-100 rounded-lg shadow-lg overflow-hidden relative group self-start"
  onMouseEnter={() => setHoveredProduct(_id)}
  onMouseLeave={() => setHoveredProduct(null)}
>

  <Link href={`/products/${slug}`} className="block">
    <div className="relative w-full h-40 sm:h-48 md:h-60 lg:h-72 bg-white">
      <Image
        src={mainImage}
        alt={name}
        fill
        unoptimized
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 transform group-hover:scale-105"
      />

      {/* Select Options Overlay */}
      {hoveredProduct === _id && (
  <div className="absolute inset-0 bg-opacity-0 flex items-center justify-center transition-opacity duration-300">
    <span className="bg-blue-500 text-white text-lg font-semibold rounded-full p-2">
      Select Options
    </span>
  </div>
)}

    </div>
  </Link>

<div className="p-4 text-center">
<Link href={`/products/${slug}`}>
  <div className="h-12 flex items-center justify-center">
    <h3 className="text-lg font-semibold line-clamp-2">{name}</h3>
  </div>
  <p className="text-gray-700">${price}</p>
</Link>
<button
  className="mt-2 px-4 py-2 bg-transparent border border-gray-700 text-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition whitespace-nowrap"
  onClick={() => handleAddToWishlist(_id, slug, name, price, mainImage)}
>
  Add to Wishlist
</button>
</div>

</div>

            ))
          )}
        </div>
      </div>

      {/* Pagination Controls */}
     <div className="flex justify-center flex-wrap mt-6 gap-2 max-w-[90%] mx-auto">

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-1 border rounded ${
              currentPage === index + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;