"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useWishlist } from "@/app/context/WishlistContext";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";



type Product = {
  _id: string;
  name: string;
  price: number;
  mainImage: string;
  slug: string;
  category: string;
  discount?: number;
  seoDescription?: string;
  seeds?: { label: string; price?: number }[];   // ✅ array of objects
  weights?: { label: string; price?: number }[]; // ✅ array of objects
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

type Option = {
  label: string;
  price?: number;
};


// Helper to normalize category string to slug
function categoryToSlug(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function ShopPage({ categorySlug, products, categorySEO }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  // Track which main category is open on mobile
  const [showQuickView, setShowQuickView] = useState<Product | null>(null);
  const [showOptionsOverlay, setShowOptionsOverlay] = useState<Product | null>(null);
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState<string | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [quantity, setQuantity] = useState(1);

  
const hasDiscount = Math.random() < 0.4; // 40% chance to have discount
const discount = hasDiscount ? Math.floor(Math.random() * 16) + 5 : 0; // 5% to 20%


const [productsPerPage, setProductsPerPage] = useState(12);

// Update productsPerPage on resize
useEffect(() => {
  const updateProductsPerPage = () => {
    if (window.innerWidth < 640) { // mobile
      setProductsPerPage(6);
    } else { // tablet & desktop
      setProductsPerPage(12);
    }
  };

  updateProductsPerPage();
  window.addEventListener("resize", updateProductsPerPage);

  return () => window.removeEventListener("resize", updateProductsPerPage);
}, []);









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



  function handleAddToCart(product: Product, option?: { label: string; price?: number }) {
    console.log("Adding to cart:", product.name, option);
    // Add your cart logic here
  }


  const handleAddToWishlist = (
    id: string,
    slug: string,
    name: string,
    price: number,
    image?: string
  ) => {
    // TODO: Replace with your wishlist logic
    console.log("Add to wishlist:", name);
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
                    className={`flex justify-between items-center cursor-pointer py-2 px-4 rounded-lg ${selectedCategory === item.name ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                      }`}
                    onClick={() =>
                      setOpenCategory(openCategory === item.name ? null : item.name)
                    }
                  >
                    <span>{item.name}</span>
                    <span
                      className={`transform transition-transform ${openCategory === item.name ? "rotate-90" : ""
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
                          className={`cursor-pointer py-1 px-4 rounded-lg ${selectedCategory === sub ? "bg-blue-500 text-white" : "hover:bg-gray-100"
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
                          className={`flex justify-between items-center cursor-pointer py-2 px-4 rounded-lg ${selectedCategory === item.name ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                            }`}
                          onClick={() =>
                            setOpenCategory(openCategory === item.name ? null : item.name)
                          }
                        >
                          <span>{item.name}</span>
                          <span
                            className={`transform transition-transform ${openCategory === item.name ? "rotate-90" : ""
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
                                className={`cursor-pointer py-1 px-4 rounded-lg ${selectedCategory === sub ? "bg-blue-500 text-white" : "hover:bg-gray-100"
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
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">

            {displayedProducts.map((product) => {
              const hasOptions = (product.weights?.length || 0) + (product.seeds?.length || 0) > 0;

              return (
                <div key={product._id} className="relative group flex-1">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full"
                  >
                    {/* --- Discount Badge --- */}
                   {discount > 0 && (
  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
    -{discount}%
  </span>
)}
                    {/* --- Product Image --- */}
                    <div className="relative w-full aspect-square overflow-hidden">
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={product.mainImage || "/placeholder.png"}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* --- Wishlist Icon (mobile always visible) --- */}
                      <div className="absolute  right-3 flex sm:hidden z-10">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            handleAddToWishlist(
                              product._id,
                              product.slug,
                              product.name,
                              product.price,
                              product.mainImage
                            )
                          }
                          className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition"
                        >
                          <AiOutlineHeart size={22} className="text-gray-700" />
                        </motion.button>
                      </div>

                      {/* --- Hover Icons (desktop) --- */}
                      {/* --- Hover Icons (desktop) --- */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        {/* Wishlist Icon */}
                        <div className="flex items-center gap-2">
                          <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap block">
                            Add to Wishlist
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ rotate: -10 }}
                            onClick={() =>
                              handleAddToWishlist(
                                product._id,
                                product.slug,
                                product.name,
                                product.price,
                                product.mainImage
                              )
                            }
                            className="bg-white p-2 rounded-full hidden md:flex shadow hover:bg-gray-100 transition"
                          >
                            <AiOutlineHeart size={20} className="text-gray-700" />
                          </motion.button>
                        </div>

                        {/* Quick View Icon */}
                        <div className="flex items-center gap-2">
                          <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap block ">
                            Quick View
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ rotate: 10 }}
                             onClick={() => setQuickViewProduct(product)}
                            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition hidden md:flex"
                          >
                            <FiSearch size={20} className="text-gray-700" />
                          </motion.button>
                        </div>
                      </div>


                    </div>

                    {/* --- Product Details --- */}
                    <div className="p-4 flex flex-col flex-grow justify-between text-center relative">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-lg font-semibold hover:text-blue-500 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price & Discount */}
                      <div className="mt-2">
                        {product.discount ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-gray-400 line-through">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            <span className="text-red-500 font-bold">
                              ${(Number(product.price) - (Number(product.price) * Number(product.discount ?? 0)) / 100).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-800 font-semibold">${Number(product.price).toFixed(2)}</p>
                        )}

                      </div>

                      {/* --- Add to Cart / Select Options --- */}
                      {/* --- Add to Cart / Select Options --- */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="mt-4 flex justify-center relative"
                      >
                        {hasOptions ? (
                          <div className="relative flex flex-col items-center group">
                            <button
                              onClick={() => setShowOptionsOverlay(product)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                            >
                              Select Options
                            </button>

                            {product.seoDescription && (
                              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-white text-black text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {product.seoDescription}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="relative flex flex-col items-center group">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                            >
                              Add to Cart
                            </button>

                            {product.seoDescription && (
                              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs bg-white text-black text-xs px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {product.seoDescription}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>

                    </div>
                  </motion.div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center flex-wrap mt-6 gap-2 max-w-[90%] mx-auto">
  {/* Previous button */}
  <button
    onClick={() => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className={`px-3 py-2 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
  >
    &lt;
  </button>

  {/* Calculate sliding pages */}
  {(() => {
    const pageWindow = 3; // number of pages to show at a time
    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(startPage + pageWindow - 1, totalPages);

    if (endPage - startPage + 1 < pageWindow) {
      startPage = Math.max(endPage - pageWindow + 1, 1);
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

    return visiblePages.map((page, idx) => (
      <button
        key={page}
        onClick={() => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`px-4 py-2 mx-1 border rounded ${currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
      >
        {page}
      </button>
    ));
  })()}

  {/* Next button */}
  <button
    onClick={() => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className={`px-3 py-2 border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
  >
    &gt;
  </button>
</div>

      </div>
      
        
      <AnimatePresence>
        {showOptionsOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg max-w-md w-full"
            >
              {/* Header & Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{showOptionsOverlay.name}</h2>
                <button
                  onClick={() => setShowOptionsOverlay(null)}
                  className="text-gray-500 hover:text-gray-700 font-bold text-xl"
                >
                  &times;
                </button>
              </div>

              {/* Seeds & Weights Options */}
              <div className="flex flex-col gap-2">
                {(showOptionsOverlay.seeds ?? []).map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedOption(opt)} // record selected option
                    className={`border px-4 py-2 rounded w-full text-left hover:bg-gray-100 ${selectedOption?.label === opt.label ? "bg-gray-200" : ""
                      }`}
                  >
                    {opt.label} {opt.price ? `(+${opt.price})` : ""}
                  </button>
                ))}

                {(showOptionsOverlay.weights ?? []).map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedOption(opt)} // record selected option
                    className={`border px-4 py-2 rounded w-full text-left hover:bg-gray-100 ${selectedOption?.label === opt.label ? "bg-gray-200" : ""
                      }`}
                  >
                    {opt.label} {opt.price ? `(+${opt.price})` : ""}
                  </button>
                ))}
              </div>

              {/* Add to Cart Button */}
              {/* Add to Cart Button */}
              {selectedOption && (
                <button
                  onClick={() => {
                    handleAddToCart(showOptionsOverlay, selectedOption); // Pass separately
                    setShowOptionsOverlay(null); // close popup
                  }}
                  className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                >
                  Add to Cart
                </button>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
           

 <AnimatePresence>
  {quickViewProduct && (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && setQuickViewProduct(null)}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white rounded-2xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto flex relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 text-xl font-bold text-gray-600"
        >
          &times;
        </button>

        {/* Left: Image */}
        <div className="w-1/2 relative flex flex-col">
          <Image
            src={quickViewProduct.mainImage}
            alt={quickViewProduct.name}
            width={500}
            height={500}
            className="object-cover w-full h-full rounded-l-2xl"
          />
          <Link href={`/products/${quickViewProduct.slug}`}>
            <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg w-full">
              View Details
            </button>
          </Link>
        </div>

        {/* Right: Info */}
        <div className="w-1/2 p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
          <p className="text-xl text-red-500 font-semibold">${quickViewProduct.price}</p>

          {/* Options Dropdown */}
          {(quickViewProduct.seeds?.length || quickViewProduct.weights?.length) && (
            <select className="border rounded p-2">
              {quickViewProduct.seeds?.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.label} {o.price ? `(+${o.price})` : ""}
                </option>
              ))}
              {quickViewProduct.weights?.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.label} {o.price ? `(+${o.price})` : ""}
                </option>
              ))}
            </select>
          )}

           {/* Quantity Selector */}
  <div className="flex items-center gap-2 mt-2">
    <span>Quantity:</span>
    <div className="flex items-center border rounded">
      <button
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
        onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
      >
        -
      </button>
      <span className="px-4">{quantity}</span>
      <button
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
        onClick={() => setQuantity((prev) => prev + 1)}
      >
        +
      </button>
    </div>
  </div>

          <div className="flex gap-2 mt-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition">
              Add to Cart
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition">
              Add to Wishlist
            </button>
          </div>

          <p className="text-gray-700 line-clamp-3">{quickViewProduct.seoDescription}</p>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}
