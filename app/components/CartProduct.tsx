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
  seeds?: { label: string; price?: number }[];   // ✅ array of objects
  weights?: { label: string; price?: number }[]; // ✅ array of objects
  description: string;
};

export default function CartProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToWishlist } = useWishlist();
  


  useEffect(() => {
  async function fetchProducts() {
    try {
      const res = await fetch(`/api/products?popularProduct=true&limit=4`);
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
    <div className="p-6">
      {/* Heading */}
      <div className=" mt-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">You May Also Like</h1>

        
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-5 md:gap-4 lg:gap-6">
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
  const { addToCart, openCart, totalPrice } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);



  // --- NEW STATES FOR SELECT OPTIONS OVERLAY ---
  const [showOptionsOverlay, setShowOptionsOverlay] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const hasOptions = (product.weights?.length || 0) + (product.seeds?.length || 0) > 0;
const [quantity, setQuantity] = useState<number>(1);
const [displayPrice, setDisplayPrice] = useState<number>(
  product.discount ? (product.price - product.price * (product.discount / 100)) : product.price
);

// --- Update price whenever quantity or selected option changes ---



useEffect(() => {
  // Parse the option price from the selected option
  let optionPrice: number | null = null;
  if (selectedOption) {
    const match = selectedOption.match(/\$([\d.]+)/);
    if (match) optionPrice = parseFloat(match[1]);
  }

  // Determine the price to display
  const basePrice = product.discount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  // ✅ If an option price exists, use it; otherwise use base price
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
  if (product) {
    addToCart({
      slug: product.slug,
      name: product.name,
      price: displayPrice.toFixed(2),   // total price including options & quantity
      mainImage: product.mainImage,
      quantity: quantity,               // use selected quantity
      option: selectedOption,           // selected weight or seed
    });

    toast.success(`${product.name}${selectedOption ? ` (${selectedOption})` : ""} added to cart!`, {
      duration: 3000,
      icon: "🛒",
    });

    openCart();
  }
};

return (
  <div className="relative group flex-1">
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full"
    >
      {/* Discount Badge */}
      {product.discount && (
        <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{product.discount}%
        </span>
      )}

      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
       {/* ✅ Mobile & Medium: Always visible bottom-right */}
  <div className="absolute bottom-3 right-3 flex sm:hidden z-10 mb-20">
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={() =>
      handleAddToWishlist(
        product.id,
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

        {/* Hover Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {/* Wishlist Icon */}
          <div className="relative group/icon">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ rotate: -10 }}
              onClick={() =>
                handleAddToWishlist(
                  product.id,
                  product.slug,
                  product.name,
                  product.price,
                  product.mainImage
                )
              }
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <AiOutlineHeart size={20} className="text-gray-700" />
            </motion.button>
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover/icon:opacity-100 transition whitespace-nowrap">
              Add to Wishlist
            </span>
          </div>

          {/* Search Icon */}
         <div className="relative group/icon hidden md:flex">
  <motion.button
    whileTap={{ scale: 0.9 }}
    whileHover={{ rotate: 10 }}
    onClick={() => setShowQuickView(true)}
    className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
  >
    <FiSearch size={20} className="text-gray-700" />
  </motion.button>

  <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover/icon:opacity-100 transition whitespace-nowrap">
    Quick View
  </span>
</div>

        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow justify-between text-center relative">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-lg font-semibold hover:text-blue-500 transition-colors break-words">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2">
            {product.discount ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-400 line-through">${product.price}</span>
                <span className="text-red-700 font-bold">
                  ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-gray-800 font-semibold">${product.price}</p>
            )}
          </div>
        </div>

        {/* Add to Cart Section */}
        <div
          onMouseEnter={() => showHoverEffect && setHovered(true)}
          onMouseLeave={() => showHoverEffect && setHovered(false)}
          className="mt-4 flex flex-col items-center relative"
        >
          {!hovered ? (
            hasOptions ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowOptionsOverlay(true)}
                className="bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-red-800 transition whitespace-nowrap"
              >
                Select Options
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleAddToCart}
                className="bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-red-800 transition whitespace-nowrap"
              >
                Add to Cart
              </motion.button>
            )
          ) : (
            <motion.div className="relative flex flex-col items-center">
              {hasOptions ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowOptionsOverlay(true)}
                  className="p-2 rounded-lg bg-red-700 hover:bg-red-800 text-white shadow transition"
                >
                  Select Options
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleAddToCart}
                  className="p-2 rounded-lg bg-red-700 hover:bg-red-800 text-white shadow transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 bg-white shadow-lg rounded-lg p-3 text-sm text-gray-600 z-50"
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center  rounded-2xl shadow-lg z-1 p-2"
        >
          {/* Close Button */}
         {/* Close Button */}
<button
  onClick={() => {
    setShowOptionsOverlay(false);
    setDropdownOpen(false);
    setSelectedOption(null);
  }}
  className="absolute top-0 right-12 flex items-center gap-1 text-gray-600 hover:text-gray-900 text-base font-semibold px-2 py-1 rounded"
>
  ✕ <span className="text-sm">Close</span>
</button>


          {/* Choose Options Button */}
          <div className="w-48 relative mb-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full border rounded-lg px-3 py-2 flex justify-between items-center bg-white shadow"
            >
              {selectedOption ? selectedOption : "Choose Options"}
              <span className="ml-2">&#9662;</span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto z-50">
                {product.weights?.map((opt, i) => (
                  <div
                    key={`weight-${i}-${opt.label}`}
                    onClick={() => {
                      setSelectedOption(`${opt.label} - $${opt.price}`);
                      setDropdownOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {opt.label} - ${opt.price}
                  </div>
                ))}
                {product.seeds?.map((opt, i) => (
                  <div
                    key={`seed-${i}-${opt.label}`}
                    onClick={() => {
                      setSelectedOption(`${opt.label}${opt.price ? ` - $${opt.price}` : ""}`);
                      setDropdownOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {opt.label}
                    {opt.price ? ` - $${opt.price}` : ""}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
  onClick={() => {
    // ✅ Validate if options exist but not selected
    if (hasOptions && !selectedOption) {
      toast.error("Please select an option first", { duration: 3000, icon: "⚠️" });
      return;
    }

    // ✅ Add to cart with updated price, quantity, and option
    addToCart({
      slug: product.slug,
      name: product.name,
      price: displayPrice.toFixed(2), // use dynamic displayPrice
      mainImage: product.mainImage,
      quantity: quantity,             // use selected quantity
      option: selectedOption,         // selected weight or seed
    });

    toast.success(`${product.name}${selectedOption ? ` (${selectedOption})` : ""} added to cart!`, {
      duration: 3000,
      icon: "🛒",
    });

    openCart(); // optional, if you want to open the cart panel
  }}
  whileTap={{ scale: 0.95 }}
  className="bg-red-700 text-white px-6 py-2 rounded-lg shadow hover:bg-red-800 transition whitespace-nowrap"
>
  Add to Cart
</motion.button>

        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
  {showQuickView && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 p-4 md:p-10"
      onClick={(e) => {
        // ✅ Only close if the user clicked directly on the overlay, not inside the modal
        if (e.target === e.currentTarget) {
          setShowQuickView(false);
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowQuickView(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-lg font-semibold flex items-center gap-1"
        >
          ✕ <span className="text-sm">Close</span>
        </button>

        {/* Left: Product Image */}
       {/* Left: Product Image */}
<div className="relative w-full md:w-1/2 h-64 md:h-auto">
  <Image
    src={product.mainImage}
    alt={product.name}
    fill
    unoptimized
    className="object-cover"
  />
  <Link href={`/products/${product.slug}`} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:block hidden w-full">
    <button className="bg-red-700 w-full text-white px-4 py-2 rounded shadow hover:bg-red-800 transition">
      View Details
    </button>
  </Link>
</div>


        {/* Right: Info */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold">{product.name}</h3>
            {/* Price */}
<p className="text-red-700 font-bold text-xl mt-2">
  ${displayPrice.toFixed(2)}
</p>
           <p className="text-gray-600 text-sm mt-4">
      {product.description
        ? (product.description.replace(/<[^>]+>/g, "").slice(0, 120) + "...")
        : ""}
    </p>

            {/* Optional: Weight / Seeds dropdowns */}
            {/* Options Dropdown */}
{hasOptions && (
  <select
    className="w-full border rounded p-2 mt-2"
    value={selectedOption || ""}
    onChange={(e) => setSelectedOption(e.target.value)}
  >
    <option value="">Select...</option>
    {product.weights?.map(opt => (
      <option key={opt.label} value={`${opt.label} - $${opt.price}`}>
        {opt.label} - ${opt.price}
      </option>
    ))}
    {product.seeds?.map(opt => (
      <option key={opt.label} value={`${opt.label}${opt.price ? ` - $${opt.price}` : ""}`}>
        {opt.label}{opt.price ? ` - $${opt.price}` : ""}
      </option>
    ))}
  </select>
)}
          </div>

          {/* Quantity + Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {/* Quantity Input */}
<input
  type="number"
  min={1}
  value={quantity}
  onChange={(e) => setQuantity(parseInt(e.target.value))}
  className="w-24 border rounded p-2"
/>
            <button
  className="bg-red-700 text-white px-4 py-2 rounded shadow hover:bg-red-800 transition"
  onClick={() => {
    if (hasOptions && !selectedOption) {
      toast.error("Please select an option first", { duration: 3000, icon: "⚠️" });
      return;
    }

    addToCart({
      slug: product.slug,
      name: product.name,
      price: displayPrice.toFixed(2),   // ✅ total price including option + quantity
      mainImage: product.mainImage,
      quantity: quantity,               // ✅ quantity selected
      option: selectedOption,           // ✅ selected weight or seed
    });

    toast.success(`${product.name}${selectedOption ? ` (${selectedOption})` : ""} added to cart!`, {
      duration: 3000,
      icon: "🛒",
    });
  }}
>
  Add to Cart
</button>

            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-300 transition"
              onClick={() => handleAddToWishlist(product.id, product.slug, product.name, product.price, product.mainImage)}
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
