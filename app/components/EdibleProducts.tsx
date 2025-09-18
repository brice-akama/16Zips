// app/edibles/page.tsx (or wherever you're listing edible products)
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from "@/app/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useCart } from "@/app/context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  edibles: boolean;
  popularProduct: boolean;
  mainImage: string;
  slug: string;
  discount?: number;
  seoDescription?: string;
  seeds?: { label: string; price?: number }[];
  weights?: { label: string; price?: number }[];
  description: string;
};

export default function EdibleProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToWishlist } = useWishlist();

  
  useEffect(() => {
    async function fetchProducts() {
      try {
     const res = await fetch('/api/products?edibles=true');
        const { data } = await res.json();
  
        // ✅ Add random discount to some products
        const dataWithDiscount = data.map((product: Product) => {
          const hasDiscount = Math.random() < 0.5; // 50% chance
          if (hasDiscount) {
            const discount = Math.floor(Math.random() * 21) + 5; // 5% to 25%
            return { ...product, discount }; // only add discount if it exists
          }
          return product; // no discount property added
        });
  
        setProducts(dataWithDiscount);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
    fetchProducts();
  }, []);
  

  const handleAddToWishlist = (
    id: string, slug: string, name: string, price: number, mainImage: string
  ) => {
    addToWishlist({ _id: id, name, price: price.toString(), mainImage, slug });
  };

  return (
    <div className="p-4 md:p-8"> {/* 🎨 More consistent padding */}
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 tracking-tight"> {/* 🎨 Stronger weight, tracking */}
          Browse Our Full Collection
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-balance"> {/* 🎨 Better readability */}
          From flower to edibles and everything in between — find your perfect match in our curated collection.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-6 lg:gap-8"> {/* 🎨 Consistent, generous spacing */}
        {products.map(product => (
          <div key={product.id} className="h-full flex">
            <ProductCard
              product={product}
              handleAddToWishlist={handleAddToWishlist}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  handleAddToWishlist,
}: {
  product: Product;
  handleAddToWishlist: (
    id: string,
    slug: string,
    name: string,
    price: number,
    mainImage: string
  ) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { addToCart, openCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);

  const [showOptionsOverlay, setShowOptionsOverlay] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const hasOptions = (product.weights?.length || 0) + (product.seeds?.length || 0) > 0;
  const [quantity, setQuantity] = useState<number>(1);
  const [displayPrice, setDisplayPrice] = useState<number>(
    product.discount ? (product.price - product.price * (product.discount / 100)) : product.price
  );

  useEffect(() => {
    let optionPrice: number | null = null;
    if (selectedOption) {
      const match = selectedOption.match(/\$([\d.]+)/);
      if (match) optionPrice = parseFloat(match[1]);
    }

    const basePrice = product.discount
      ? product.price - product.price * (product.discount / 100)
      : product.price;

    const priceToUse = optionPrice !== null ? optionPrice : basePrice;
    setDisplayPrice(priceToUse * quantity);
  }, [selectedOption, quantity, product.price, product.discount]);

  const [isMdUp, setIsMdUp] = useState(false);
  useEffect(() => {
    function checkScreen() {
      setIsMdUp(window.innerWidth >= 768);
    }
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const showHoverEffect = isMdUp;

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      slug: product.slug,
      name: product.name,
      price: displayPrice.toFixed(2),
      mainImage: product.mainImage,
      quantity,
      option: selectedOption,
    });

    toast.success(`${product.name}${selectedOption ? ` (${selectedOption})` : ""} added to cart!`, {
      duration: 3000,
      icon: "🛒",
    });

    openCart();
  };

  return (
    <div className="relative group flex-1">
      <motion.div
        whileHover={{ scale: 1.02 }} // 🎨 Slightly subtler scale
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }} // 🎨 Smoother easing
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-50 flex flex-col h-full overflow-hidden" // 🎨 Added border, refined shadow
      >
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 drop-shadow-sm"> {/* 🎨 Gradient + drop shadow */}
            -{product.discount}%
          </span>
        )}

        {/* Product Image */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50"> {/* 🎨 Subtle bg for image load */}
          <Link href={`/products/${product.slug}`} className="block h-full">
            <Image
              src={product.mainImage}
              alt={product.name}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Mobile Wishlist */}
          <div className="absolute top-10 right-3 flex sm:hidden z-10">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAddToWishlist(product.id, product.slug, product.name, product.price, product.mainImage)}
              className="bg-white p-3 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 ring-1 ring-gray-200 " // 🎨 Added ring, refined shadow
            >
              <AiOutlineHeart size={20} className="text-gray-700" /> {/* 🎨 Slightly smaller icon */}
            </motion.button>
          </div>

          {/* Hover Icons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {/* Wishlist Icon */}
            <div className="relative group/icon">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ rotate: -8 }}
                onClick={() => handleAddToWishlist(product.id, product.slug, product.name, product.price, product.mainImage)}
                className="bg-white p-2.5 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 ring-1 ring-gray-200"
              >
                <AiOutlineHeart size={18} className="text-gray-700" />
              </motion.button>
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover/icon:opacity-100 transition whitespace-nowrap pointer-events-none">
                Add to Wishlist
              </span>
            </div>

            {/* Search Icon */}
            <div className="relative group/icon hidden md:flex">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ rotate: 8 }}
                onClick={() => setShowQuickView(true)}
                className="bg-white p-2.5 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 ring-1 ring-gray-200"
              >
                <FiSearch size={18} className="text-gray-700" />
              </motion.button>
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover/icon:opacity-100 transition whitespace-nowrap pointer-events-none">
                Quick View
              </span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-grow justify-between text-center relative">
          <div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 hover:text-red-500 transition-colors leading-tight"> {/* 🎨 Better color, leading */}
                {product.name}
              </h3>
            </Link>

            <div className="mt-3">
              {product.discount ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-400 line-through text-sm">${product.price.toFixed(2)}</span> {/* 🎨 Smaller strikethrough */}
                  <span className="text-red-500 font-bold text-lg">${(product.price - (product.price * product.discount) / 100).toFixed(2)}</span> {/* 🎨 Larger discounted price */}
                </div>
              ) : (
                <p className="text-gray-800 font-bold text-lg">${product.price.toFixed(2)}</p> 
              )}
            </div>
          </div>

          {/* Add to Cart Section */}
          <div
            onMouseEnter={() => showHoverEffect && setHovered(true)}
            onMouseLeave={() => showHoverEffect && setHovered(false)}
            className="mt-5 flex flex-col items-center relative"
          >
            {!hovered ? (
              hasOptions ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setShowOptionsOverlay(true)}
                  className="bg-red-500 text-white px-5 py-2.5 whitespace-nowrap rounded-xl shadow-md hover:bg-red-600 transition-all duration-200 font-medium text-sm" // 🎨 Rounded-xl, padding, font size
                >
                  Select Options
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={handleAddToCart}
                  className="bg-red-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-red-600 transition-all duration-200 font-medium text-sm"
                >
                  Add to Cart
                </motion.button>
              )
            ) : (
              <motion.div className="relative flex flex-col items-center gap-2">
                {hasOptions ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setShowOptionsOverlay(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-600 transition-all duration-200 font-medium text-sm"
                  >
                    Select Options
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={handleAddToCart}
                    className="bg-red-500 text-white p-2.5 rounded-xl shadow-md hover:bg-red-600 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5" // 🎨 Slightly smaller icon
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5-4.5M7 13L5.4 7H3m14 6a1 1 0 100 2 1 1 0 000-2zm-8 0a1 1 0 100 2 1 1 0 000-2z"
                      />
                    </svg>
                  </motion.button>
                )}

                {/* Floating SEO Description */}
                <AnimatePresence>
                  {product.seoDescription && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 w-64 bg-white shadow-xl rounded-lg p-3 text-xs text-gray-600 z-50 border border-gray-100" // 🎨 Better shadow, border
                    >
                      {product.seoDescription}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* --- SELECT OPTIONS OVERLAY --- */}
      <AnimatePresence>
        {showOptionsOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl z-2 p-6" // 🎨 Backdrop blur, better shadow, padding
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowOptionsOverlay(false);
                setDropdownOpen(false);
                setSelectedOption(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-medium flex items-center gap-1"
            >
              ✕ <span className="text-sm font-normal">Close</span>
            </button>

            <div className="w-full max-w-xs">
              <label className="block text-gray-700 text-sm font-medium mb-2">Choose Option</label>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm hover:shadow flex justify-between items-center text-left transition"
                >
                  <span className="text-gray-700">{selectedOption ? selectedOption : "Select an option"}</span>
                  <span className={`transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>&#9660;</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
                    {product.weights?.map((opt, i) => (
                      <div
                        key={`weight-${i}-${opt.label}`}
                        onClick={() => {
                          setSelectedOption(`${opt.label} - $${opt.price}`);
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-700 border-b border-gray-50 last:border-0"
                      >
                        {opt.label} - ${opt.price?.toFixed(2)}
                      </div>
                    ))}
                    {product.seeds?.map((opt, i) => (
                      <div
                        key={`seed-${i}-${opt.label}`}
                        onClick={() => {
                          setSelectedOption(`${opt.label}${opt.price ? ` - $${opt.price}` : ""}`);
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-700 border-b border-gray-50 last:border-0"
                      >
                        {opt.label}
                        {opt.price ? ` - $${opt.price.toFixed(2)}` : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5">
                <label className="block text-gray-700 text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center"
                />
              </div>

              <motion.button
                onClick={() => {
                  if (hasOptions && !selectedOption) {
                    toast.error("Please select an option first", { duration: 3000, icon: "⚠️" });
                    return;
                  }

                  addToCart({
                    slug: product.slug,
                    name: product.name,
                    price: displayPrice.toFixed(2),
                    mainImage: product.mainImage,
                    quantity,
                    option: selectedOption,
                  });

                  toast.success(`${product.name}${selectedOption ? ` (${selectedOption})` : ""} added to cart!`, {
                    duration: 3000,
                    icon: "🛒",
                  });

                  setShowOptionsOverlay(false);
                  setDropdownOpen(false);
                  setSelectedOption(null);
                }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full bg-red-500 text-white py-3 rounded-xl shadow-md hover:bg-red-600 transition font-medium"
              >
                Add to Cart — ${displayPrice.toFixed(2)}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- QUICK VIEW MODAL --- */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  p-4 md:p-6" // 🎨 Darker, blurred backdrop
            onClick={(e) => e.target === e.currentTarget && setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative"
            >
              <button
                onClick={() => setShowQuickView(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-xl font-medium z-10 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full"
              >
                ✕ <span className="text-xs">Close</span>
              </button>

              <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-50">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-red-500 font-bold text-xl">${displayPrice.toFixed(2)}</p>
                  <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                    {product.description
                      ? product.description.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
                      : "No description available."}
                  </p>

                  {hasOptions && (
                    <div className="mt-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1">Select Option</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-300 focus:border-transparent"
                        value={selectedOption || ""}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      >
                        <option value="">Select an option</option>
                        {product.weights?.map(opt => (
                          <option key={opt.label} value={`${opt.label} - $${opt.price}`}>
                            {opt.label} - ${opt.price?.toFixed(2)}
                          </option>
                        ))}
                        {product.seeds?.map(opt => (
                          <option key={opt.label} value={`${opt.label}${opt.price ? ` - $${opt.price}` : ""}`}>
                            {opt.label}{opt.price ? ` - $${opt.price.toFixed(2)}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mt-5">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-center"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    className="bg-red-500 text-white py-3 rounded-xl shadow-md hover:bg-red-600 transition font-medium"
                    onClick={() => {
                      if (hasOptions && !selectedOption) {
                        toast.error("Please select an option first", { duration: 3000, icon: "⚠️" });
                        return;
                      }

                      addToCart({
                        slug: product.slug,
                        name: product.name,
                        price: displayPrice.toFixed(2),
                        mainImage: product.mainImage,
                        quantity,
                        option: selectedOption,
                      });

                      toast.success(`${product.name}${selectedOption ? ` (${selectedOption})` : ""} added to cart!`, {
                        duration: 3000,
                        icon: "🛒",
                      });

                      setShowQuickView(false);
                    }}
                  >
                    Add to Cart — ${displayPrice.toFixed(2)}
                  </button>

                  <button
                    className="bg-gray-100 text-gray-700 py-3 rounded-xl shadow-md hover:bg-gray-200 transition font-medium"
                    onClick={() => {
                      handleAddToWishlist(product.id, product.slug, product.name, product.price, product.mainImage);
                      setShowQuickView(false);
                    }}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}