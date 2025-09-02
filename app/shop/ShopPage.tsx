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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  // Track which main category is open on mobile
const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);
const [mobileSelectedCategory, setMobileSelectedCategory] = useState<string | null>(null);
const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);


  

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];



  // Close sidebar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

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
      {/* Hero Section */}
<div className="w-full h-64 md:h-96 bg-black flex flex-col items-center justify-center relative mt-10">
  <h1 className="text-white text-5xl md:text-6xl font-bold whitespace-nowrap ">
    {selectedCategory === "All" ? "Shop" : selectedCategory}
  </h1>

  <div className="flex flex-wrap justify-center gap-6 mt-4">

    {/* Desktop Hover Menu */}
    <div className="hidden md:flex flex-wrap justify-center gap-6">
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

    {/* Mobile Dropdown Menu */}
    {/* Mobile Dropdown Menu */}
{/* Mobile Dropdown Menu */}
<div className="md:hidden w-full max-w-xs mx-auto  relative">
  {/* Categories button */}
  <button
    className="w-full bg-white rounded-lg shadow px-20 py-2 flex justify-between items-center font-bold"
    onClick={() => {
      setMobileCategoriesOpen(!mobileCategoriesOpen);
      setMobileSelectedCategory(null); // reset selection when reopening
    }}
  >
    Categories
    <span
      className={`transform transition-transform ${mobileCategoriesOpen ? "rotate-90" : ""}`}
    >
      &#9654;
    </span>
  </button>

  {/* Dropdown container */}
  {mobileCategoriesOpen && (
    <div className="absolute top-full left-0 w-full  bg-white rounded-lg shadow-lg border z-1">
      {!mobileSelectedCategory ? (
        // Main categories
        <div>
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
            <button
              key={item.name}
              className="block w-full text-left whitespace-nowrap px-4 py-3 hover:bg-gray-100 border-b last:border-none"
              onClick={() => setMobileSelectedCategory(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : (
        // Subcategories
        <div>
          {[
            { name: "Flowers", subMenu: ["Hybrid", "Sativa", "Indica"] },
            { name: "Seeds", subMenu: ["Autoflower Seeds", "Feminized Seeds", "Regular Seeds"] },
            { name: "Pre Rolls", subMenu: ["Hybrid Pre Rolls", "Sativa Pre Rolls", "Indica Pre Rolls"] },
            { name: "Vapes", subMenu: ["Disposables Vapes", "Vape Cartridges", "Vape Pods"] },
            { name: "Capsules", subMenu: ["CBD Capsules", "THC Capsules"] },
            { name: "Edibles", subMenu: ["Edibles Gummies", "Chocolates Edibles"] },
            { name: "Concentrates", subMenu: ["Moon Rock", "Live Resin", "Distillate", "Budder", "Crumble"] },
            { name: "Shrooms", subMenu: ["Dried Mushrooms", "Chocolate Bars", "Gummies"] },
          ]
            .find((c) => c.name === mobileSelectedCategory)!
            .subMenu.map((sub) => (
              <button
                key={sub}
                className="block w-full text-left px-0 py-3 hover:bg-gray-100 border-b last:border-none whitespace-nowrap"
                onClick={() => {
                  handleCategoryClick(sub);
                  setMobileCategoriesOpen(false);
                  setMobileSelectedCategory(null);
                }}
              >
                {sub}
              </button>
            ))}
        </div>
      )}
    </div>
  )}
</div>


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

{/* Desktop Sidebar */}
<div className="hidden lg:block">
  <h2 className="text-xl font-bold mb-8">Categories</h2>
  <ul>
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
      <li key={item.name} className="mb-2">
        <div
          className={`flex justify-between items-center cursor-pointer py-2 px-4 rounded-lg ${
            selectedCategory === item.name ? "bg-blue-600 text-white" : "hover:bg-gray-200"
          }`}
          onClick={() =>
            setOpenCategory(openCategory === item.name ? null : item.name)
          }
        >
          <span>{item.name}</span>
          <span
            className={`transform transition-transform ${
              openCategory === item.name ? "rotate-90" : ""
            }`}
          >
            &#9654;
          </span>
        </div>
        {openCategory === item.name && (
          <ul className="ml-4 mt-1">
            {item.subMenu.map((sub) => (
              <li
                key={sub}
                className={`cursor-pointer py-1 px-4 rounded-lg ${
                  selectedCategory === sub ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => handleCategoryClick(sub)}
              >
                {sub}
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
</div>

{/* Mobile / Medium Sidebar */}
<div className="lg:hidden">
  {/* Toggle Button */}
  <button
    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded mb-4"
    onClick={() => setSidebarOpen(true)}
  >
    <span className="mr-2">&#9776;</span> Show Sidebar
  </button>

  {/* Sidebar Overlay */}
  {sidebarOpen && (
    <div className="fixed inset-0 z-40  bg-opacity-50 flex">
      <div
        ref={sidebarRef}
        className="w-64 bg-white p-4 overflow-y-auto relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-xl font-bold"
          onClick={() => setSidebarOpen(false)}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul>
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
            <li key={item.name} className="mb-2">
              <div
                className={`flex justify-between items-center cursor-pointer py-2 px-4 rounded-lg ${
                  selectedCategory === item.name ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                }`}
                onClick={() =>
                  setOpenCategory(openCategory === item.name ? null : item.name)
                }
              >
                <span>{item.name}</span>
                <span
                  className={`transform transition-transform ${
                    openCategory === item.name ? "rotate-90" : ""
                  }`}
                >
                  &#9654;
                </span>
              </div>
              {openCategory === item.name && (
                <ul className="ml-4 mt-1">
                  {item.subMenu.map((sub) => (
                    <li
                      key={sub}
                      className={`cursor-pointer py-1 px-4 rounded-lg ${
                        selectedCategory === sub ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        handleCategoryClick(sub);
                        setSidebarOpen(false); // close sidebar after selection
                        setOpenCategory(null); // close category
                      }}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )}
</div>


          {/* Product Grid */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map(({ _id, name, price, mainImage, slug }) => (
              <div key={_id} className="bg-gray-100 rounded-lg shadow-lg overflow-hidden relative group self-start">
                <Link href={`/products/${slug}`} className="block">
                  <div className="relative w-full h-40 sm:h-48 md:h-60 lg:h-72 bg-white">
                    {mainImage ? (
  <Image
    src={mainImage}
    alt={name}
    fill
    unoptimized
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
    className="object-cover transition-transform duration-300 transform group-hover:scale-105"
  />
) : (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
    No Image
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
