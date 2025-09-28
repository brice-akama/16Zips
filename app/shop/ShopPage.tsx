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
import { ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

// ✅ Extended Product type to include client-side generated fields
type Product = {
  _id: string;
  name: string;
  price: number;
  mainImage: string;
  slug: string;
  category: string;
  discount?: number; // Server-side discount (if any)
  seoDescription?: string;
  seeds?: { label: string; price?: number }[];
  weights?: { label: string; price?: number }[];
  // ✅ Client-side generated fields
  clientDiscount?: number;
  clientFinalProductPrice?: number;
};

// ✅ Extended Option type to include client-side generated field
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
  bestSellingProducts: Product[];
};

// ✅ Extended Option type
type Option = {
  label: string;
  price?: number;
  // ✅ Client-side generated field
  clientFinalPrice?: number;
};

// Helper to normalize category string to slug
function categoryToSlug(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function ShopPage({ categorySlug, products, categorySEO, bestSellingProducts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [showQuickView, setShowQuickView] = useState<Product | null>(null);
  const [showOptionsOverlay, setShowOptionsOverlay] = useState<Product | null>(null);
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState<string | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [quickViewSelectedOption, setQuickViewSelectedOption] = useState<Option | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 180]);
  const { addToCart, openCart } = useCart();
  const [productsPerPage, setProductsPerPage] = useState(12);
  

  // Update productsPerPage on resize
  useEffect(() => {
    const updateProductsPerPage = () => {
      if (window.innerWidth < 640) {
        setProductsPerPage(6);
      } else {
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
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter((p) => p.category === selectedCategory);

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

  // ✅ Updated handleAddToCart to accept a finalPrice
  function handleAddToCart(product: Product, finalPrice: number, optionLabel?: string) {
    addToCart({
      slug: product.slug,
      name: product.name,
      price: finalPrice.toFixed(2),
      mainImage: product.mainImage,
      quantity: quantity,
      option: optionLabel,
    });
    toast.success(
      `${product.name}${optionLabel ? ` (${optionLabel})` : ""} added to cart!`,
      { duration: 3000, icon: "🛒" }
    );
    openCart();
  }

  const handleAddToWishlist = (
    id: string,
    slug: string,
    name: string,
    price: number,
    mainImage: string
  ) => {
    addToWishlist({ _id: id, name, price: price.toString(), mainImage, slug });
    toast.success(`${name} added to wishlist!`, { duration: 2000, icon: "💖" });
  };

  const handleCategoryClick = (subCategory: string) => {
    const formatted = categoryToSlug(subCategory);
    router.push(`/shop?category=${formatted}`);
    setCurrentPage(1);
  };

  const handleFilter = () => {
    let url = `/shop?minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;
    if (selectedCategory && selectedCategory !== "All") {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    router.push(url);
  };

  return (
    <div>
      {/* SEO */}
      <Head>
        <title>{categorySEO?.metaTitle || "Shop"}</title>
        <meta name="description" content={categorySEO?.metaDescription || "Browse our shop"} />
        <meta property="og:title" content={categorySEO?.metaTitle || "Shop"} />
        <meta property="og:description" content={categorySEO?.metaDescription || "Browse our shop"} />
        <meta property="og:image" content={categorySEO?.imageUrl || "/default-og-image.jpg"} />
      </Head>

      {/* Hero Section */}
      <div className="w-full h-64 md:h-96 bg-black flex flex-col items-center justify-center relative mt-10 lg:mt-20">

        <h1 className="text-white text-5xl md:text-4xl font-bold whitespace-nowrap ">
          {selectedCategory === "All" ? "Shop" : selectedCategory}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-6 ">
          {/* Desktop Hover Menu */}
          <div className="hidden md:flex flex-wrap justify-center gap-6 ">
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
          <div className="md:hidden w-full max-w-xs mx-auto  relative">
            <button
              className="w-full bg-white rounded-lg shadow px-20 py-2 flex justify-between items-center font-bold"
              onClick={() => {
                setMobileCategoriesOpen(!mobileCategoriesOpen);
                setMobileSelectedCategory(null);
              }}
            >
              Categories
              <span
                className={`transform transition-transform ${mobileCategoriesOpen ? "rotate-90" : ""}`}
              >
                &#9654;
              </span>
            </button>
            {mobileCategoriesOpen && (
              <div className="absolute top-full left-0 w-full  bg-white rounded-lg shadow-lg border z-1">
                {!mobileSelectedCategory ? (
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
        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
          {/* Categories Sidebar */}
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
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openCategory === item.name ? "-rotate-90" : "rotate-0"
                      }`}
                    />
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
              <hr className="my-8 border-gray-300" />
              <h2 className="text-xl font-bold mt-10 ">Filter by Price</h2>
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <p className="text-sm">
                  Price: ${priceRange[0]} — ${priceRange[1]}
                </p>
                <button
                  onClick={handleFilter}
                  className="mt-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                >
                  Filter
                </button>
              </div>
              <hr className="my-8 border-gray-300" />
              <h2 className="text-xl font-bold mb-4">Best Selling</h2>
              <ul>
                {bestSellingProducts.map((product: Product) => (
                  <li key={product._id} className="flex items-center mb-4">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-12 h-12 object-cover mr-3"
                    />
                    <div>
                      <Link href={`/products/${product.slug}`}>
                        <p className="text-gray-800 text-sm font-semibold hover:underline">
                          {product.name}
                        </p>
                        <p className="text-red-700 text-sm">${product.price}</p>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </ul>
          </div>

          {/* Mobile / Medium Sidebar */}
          <div className="lg:hidden">
            <button
              className="flex items-center px-4 py-2 bg-red-700 text-white rounded mb-4"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="mr-2">&#9776;</span> Show Sidebar
            </button>
            {sidebarOpen && (
              <div className="fixed inset-0 z-100  bg-opacity-50 flex">
                <div
                  ref={sidebarRef}
                  className="w-64 bg-white p-4 overflow-y-auto relative"
                >
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
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openCategory === item.name ? "-rotate-90" : "rotate-0"
                            }`}
                          />
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
                                  setSidebarOpen(false);
                                  setOpenCategory(null);
                                }}
                              >
                                {sub}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                    <hr className="my-8 border-gray-300" />
                    <h2 className="text-xl font-bold mt-10 mb-4">Filter by Price</h2>
                    <div className="flex flex-col gap-2">
                      <input
                        type="range"
                        min={0}
                        max={500}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min={0}
                        max={500}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full"
                      />
                      <p className="text-sm">
                        Price: ${priceRange[0]} — ${priceRange[1]}
                      </p>
                      <button
                        onClick={handleFilter}
                        className="mt-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                      >
                        Filter
                      </button>
                    </div>
                    <hr className="my-8 border-gray-300" />
                    <h2 className="text-xl font-bold mb-4">Best Selling</h2>
                    <ul>
                      {bestSellingProducts.map((product: Product) => (
                        <li key={product._id} className="flex items-center mb-4">
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-12 h-12 object-cover mr-3"
                          />
                          <div>
                            <Link href={`/products/${product.slug}`}>
                              <p className="text-gray-800 text-sm font-semibold hover:underline">
                                {product.name}
                              </p>
                              <p className="text-red-700 text-sm">${product.price}</p>
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* --- Sorting + Grid Wrapper --- */}
          <div className="md:col-span-3 flex flex-col">
            {/* Breadcrumb and Header with Product Count and Sort Options */}
            <div className="">

              {/* Product Count and Controls Row */}
              <div className="flex justify-between items-center flex-wrap gap-4">

                              {/* Breadcrumb */}
              <nav className=" text-sm text-gray-600" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-2">
                  <li>
                    <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li>
                    <Link href="/shop" className="text-blue-600 hover:text-blue-800 transition-colors">
                      Shop
                    </Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li className="text-gray-900 font-medium">
                    {selectedCategory === "All" ? "Categories" : selectedCategory}
                  </li>
                </ol>
              </nav>
              
                {/* Product Count */}
                <div className="text-gray-600 text-sm">
                  Show: <span className="font-semibold text-gray-900">{(currentPage - 1) * productsPerPage + 1}</span>
                  {" / "}
                  <span className="font-semibold text-gray-900">{Math.min(currentPage * productsPerPage, sortedProducts.length)}</span>
                  {" / "}
                  <span className="font-semibold text-gray-900">{sortedProducts.length}</span>
                </div>
                
               
                  
                  

                {/* Sort Dropdown */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border rounded-lg px-4 py-2 bg-white shadow text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Sort by popularity</option>
                  <option value="low-to-high">Sort by price: low to high</option>
                  <option value="high-to-low">Sort by price: high to low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => {
                // ✅ Generate discount and final price for each product
                const hasDiscount = Math.random() < 0.4;
                const clientDiscount = hasDiscount ? Math.floor(Math.random() * 16) + 5 : 0;
                const clientFinalProductPrice = clientDiscount > 0 ? (Number(product.price) - (Number(product.price) * clientDiscount) / 100) : Number(product.price);

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
                      {clientDiscount > 0 && (
                        <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                          -{clientDiscount}%
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
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
                          <div className="flex items-center gap-2">
                            <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap block ">
                              Quick View
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              whileHover={{ rotate: 10 }}
                              onClick={() => setQuickViewProduct({ ...product, clientDiscount, clientFinalProductPrice })}
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
                          {clientDiscount > 0 ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-gray-400 line-through">
                                ${Number(product.price).toFixed(2)}
                              </span>
                              <span className="text-red-700 font-bold">
                                ${clientFinalProductPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-gray-800 font-semibold">${Number(product.price).toFixed(2)}</p>
                          )}
                        </div>

                        {/* --- Add to Cart / Select Options --- */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="mt-4 flex justify-center relative"
                        >
                          {hasOptions ? (
                            <div className="relative flex flex-col items-center group">
                              <button
                                onClick={() => setShowOptionsOverlay({ ...product, clientDiscount, clientFinalProductPrice })}
                                className="bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-red-800 transition"
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
                                onClick={() => handleAddToCart(product, clientFinalProductPrice)}
                                className="bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-red-800 transition"
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

            {/* Pagination */}
            <div className="flex justify-center items-center flex-wrap mt-6 gap-2 max-w-[90%] mx-auto">
              <button
                onClick={() => {
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3 py-2 border rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
              >
                {"<"}
              </button>
              {(() => {
                const pageWindow = 3;
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
              <button
                onClick={() => {
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3 py-2 border rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>

        {/* Options Overlay */}
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">{showOptionsOverlay.name}</h2>
                  <button
                    onClick={() => setShowOptionsOverlay(null)}
                    className="text-gray-500 hover:text-gray-700 font-bold text-xl"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {(showOptionsOverlay.seeds ?? []).map((opt) => {
                    // ✅ Calculate final price for option
                    const optionFinalPrice = showOptionsOverlay.clientDiscount && showOptionsOverlay.clientDiscount > 0
                      ? (opt.price || showOptionsOverlay.price) - ((opt.price || showOptionsOverlay.price) * showOptionsOverlay.clientDiscount) / 100
                      : (opt.price || showOptionsOverlay.price);

                    return (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedOption({ ...opt, clientFinalPrice: optionFinalPrice })}
                        className={`border px-4 py-2 rounded w-full text-left hover:bg-gray-100 ${selectedOption?.label === opt.label ? "bg-gray-200" : ""
                          }`}
                      >
                        {opt.label} {opt.price ? `(+${opt.price})` : ""}
                        {showOptionsOverlay.clientDiscount && showOptionsOverlay.clientDiscount > 0 && (
                          <span className="text-red-700 text-sm ml-2">
                            ${optionFinalPrice.toFixed(2)} (after {showOptionsOverlay.clientDiscount}% off)
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {(showOptionsOverlay.weights ?? []).map((opt) => {
                    const optionFinalPrice = showOptionsOverlay.clientDiscount && showOptionsOverlay.clientDiscount > 0
                      ? (opt.price || showOptionsOverlay.price) - ((opt.price || showOptionsOverlay.price) * showOptionsOverlay.clientDiscount) / 100
                      : (opt.price || showOptionsOverlay.price);

                    return (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedOption({ ...opt, clientFinalPrice: optionFinalPrice })}
                        className={`border px-4 py-2 rounded w-full text-left hover:bg-gray-100 ${selectedOption?.label === opt.label ? "bg-gray-200" : ""
                          }`}
                      >
                        {opt.label} {opt.price ? `(+${opt.price})` : ""}
                        {showOptionsOverlay.clientDiscount && showOptionsOverlay.clientDiscount > 0 && (
                          <span className="text-red-700 text-sm ml-2">
                            ${optionFinalPrice.toFixed(2)} (after {showOptionsOverlay.clientDiscount}% off)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedOption && (
                  <button
                    onClick={() => {
                      handleAddToCart(
                        showOptionsOverlay,
                        selectedOption.clientFinalPrice ?? showOptionsOverlay.clientFinalProductPrice ?? showOptionsOverlay.price,
                        selectedOption.label
                      );
                      setShowOptionsOverlay(null);
                      setSelectedOption(null);
                    }}
                    className="mt-4 w-full bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-red-800 transition"
                  >
                    Add to Cart
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick View Modal */}
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
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 text-xl font-bold text-gray-600"
                >
                  &times;
                </button>
                <div className="w-1/2 relative flex flex-col">
                  <Image
                    src={quickViewProduct.mainImage}
                    alt={quickViewProduct.name}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full rounded-l-2xl"
                  />
                  <Link href={`/products/${quickViewProduct.slug}`}>
                    <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-700 text-white px-4 py-2 rounded-lg w-full">
                      View Details
                    </button>
                  </Link>
                </div>
                <div className="w-1/2 p-6 flex flex-col gap-4">
                  <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
                  {/* ✅ Display correct price */}
                  {quickViewProduct.clientDiscount && quickViewProduct.clientDiscount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through">
                        ${Number(quickViewProduct.price).toFixed(2)}
                      </span>
                      <p className="text-xl text-red-700 font-semibold">
                        ${quickViewProduct.clientFinalProductPrice?.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xl text-red-700 font-semibold">${quickViewProduct.price}</p>
                  )}

                  {/* Options Dropdown */}
                  {(quickViewProduct.seeds?.length || quickViewProduct.weights?.length) && (
                    <select
                      className="border rounded p-2"
                      onChange={(e) => {
                        const allOptions = [...(quickViewProduct.seeds || []), ...(quickViewProduct.weights || [])];
                        const selectedOpt = allOptions.find(opt => opt.label === e.target.value) || null;
                        if (selectedOpt) {
                          // ✅ Calculate final price for selected option
                          const optionFinalPrice = quickViewProduct.clientDiscount && quickViewProduct.clientDiscount > 0
                            ? (selectedOpt.price || quickViewProduct.price) - ((selectedOpt.price || quickViewProduct.price) * quickViewProduct.clientDiscount) / 100
                            : (selectedOpt.price || quickViewProduct.price);
                          setQuickViewSelectedOption({ ...selectedOpt, clientFinalPrice: optionFinalPrice });
                        } else {
                          setQuickViewSelectedOption(null);
                        }
                      }}
                      value={quickViewSelectedOption?.label || ""}
                    >
                      <option value="">Select an option</option>
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
                    <button
                      onClick={() => {
                        const finalPriceToAdd = quickViewSelectedOption?.clientFinalPrice ?? quickViewProduct.clientFinalProductPrice ?? quickViewProduct.price;
                        handleAddToCart(quickViewProduct, finalPriceToAdd, quickViewSelectedOption?.label);
                      }}
                      className="bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-red-800 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() =>
                        handleAddToWishlist(
                          quickViewProduct._id,
                          quickViewProduct.slug,
                          quickViewProduct.name,
                          Number(quickViewProduct.price),
                          quickViewProduct.mainImage
                        )
                      }
                      className="bg-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
                    >
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
    </div>
  );
}