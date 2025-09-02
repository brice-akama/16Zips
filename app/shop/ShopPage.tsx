"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useWishlist } from "@/app/context/WishlistContext";
import Head from "next/head";

type Product = {
  _id: string;
  name: string;
  price: string;
  mainImage: string;
  slug: string;
  category: string;
};

type CategorySEO = {
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  imageUrl?: string;
};

type Props = {
  categorySlug?: string;
  products: Product[];
  categorySEO?: CategorySEO | null;
};

// Helper to normalize category string to slug
function categoryToSlug(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function ShopPage({ categorySlug, products, categorySEO }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  // Determine selected category from URL query or prop
  useEffect(() => {
    let matched: string | undefined;

    const categoryQuery = searchParams.get("category");
    if (categoryQuery) {
      matched = categories.find((c) => categoryToSlug(c) === categoryQuery.toLowerCase());
    }

    if (!matched && categorySlug) {
      matched = categories.find((c) => categoryToSlug(c) === categorySlug.toLowerCase());
    }

    if (matched) setSelectedCategory(matched);
  }, [searchParams, categorySlug, categories]);

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => categoryToSlug(p.category) === categoryToSlug(selectedCategory));

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

  const { addToWishlist } = useWishlist();

  const handleAddToWishlist = (_id: string, slug: string, name: string, price: string, mainImage: string) => {
    addToWishlist({ _id, slug, name, price, mainImage });
  };

  const handleCategoryClick = (subCategory: string) => {
    const formatted = categoryToSlug(subCategory);
    router.push(`/shop?category=${formatted}`);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="w-full h-64 md:h-96 bg-black flex flex-col items-center justify-center relative mt-10">
        <h1 className="text-white text-5xl md:text-6xl font-bold ">
  {selectedCategory === "All" ? "Shop" : selectedCategory}
</h1>


        <div className="flex flex-wrap justify-center gap-6">
          {[
            { name: "Flowers", subMenu: ["Hybrid", "Sativa", "Indica"] },
            { name: "Seeds", subMenu: ["Autoflower Seeds", "Feminized Seeds", "Regular Seeds"] },
            { name: "Pre Rolls", subMenu: ["Hybrid Pre Rolls", "Sativa Pre Rolls", "Indica Pre Rolls"] },
            { name: "Vapes", subMenu: ["Disposables Vapes", "Vape Cartridges", "Vape Pods"] },
            { name: "Capsules", subMenu: ["CBD Capsules", "THC Capsules"] },
            { name: "Edibles", subMenu: ["Edibles Gummies", "Chocolates Edibles"] },
            { name: "Concentrates", subMenu: ["Moon Rock", "Live Resin", "Distillate", "Budder", "Crumble"] },
            { name: "Shrooms", subMenu: ["Dried Mushrooms", "Chocolate Bars", "Gummies"] },
          ].map((item) => (
            <div key={item.name} className="relative group">
              <span className="cursor-pointer px-4 py-2 text-1xl text-white font-bold uppercase rounded inline-block">
                {item.name}
              </span>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                {item.subMenu.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleCategoryClick(sub)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="block text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">Home</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Shop</li>
          </ol>
        </nav>

        {/* SEO */}
        <Head>
          <title>{categorySEO?.metaTitle || "Shop"}</title>
          <meta name="description" content={categorySEO?.metaDescription || "Browse our shop"} />
          <meta property="og:title" content={categorySEO?.metaTitle || "Shop"} />
          <meta property="og:description" content={categorySEO?.metaDescription || "Browse our shop"} />
          <meta property="og:image" content={categorySEO?.imageUrl || "/default-og-image.jpg"} />
        </Head>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
          {/* Categories Sidebar */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold mb-8">Categories</h2>
            <ul>
              {categories.map((category) => (
                <li
                  key={category}
                  className={`cursor-pointer py-2 px-4 rounded-lg ${
                    selectedCategory === category ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map(({ _id, name, price, mainImage, slug }) => (
              <div key={_id} className="bg-gray-100 rounded-lg shadow-lg overflow-hidden relative group self-start">
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
            ))}
          </div>
        </div>

        {/* Pagination */}
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
    </div>
  );
}
