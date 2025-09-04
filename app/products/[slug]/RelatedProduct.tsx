'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useWishlist } from "@/app/context/WishlistContext";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  price: number;
  discount?: number;
}

interface RelatedProductsProps {
  currentProductSlug: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductSlug }) => {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`/api/products?slug=${currentProductSlug}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch related products");

        const related = data.data?.relatedProducts || [];

        if (related.length > 0) {
          setRelatedProducts(
            related.map((product: any) => ({
              id: product.id || product._id,
              name: product.name,
              slug: product.slug,
              mainImage: product.mainImage,
              price: product.price,
              discount: product.discount, // optional
            }))
          );
        } else {
          setIsFallback(true);
          const fallbackRes = await fetch(`/api/products?popularProduct=true&limit=4`);
          const fallbackData = await fallbackRes.json();
          setRelatedProducts(
            fallbackData.data.map((product: any) => ({
              id: product.id || product._id,
              name: product.name,
              slug: product.slug,
              mainImage: product.mainImage,
              price: product.price,
              discount: product.discount,
            }))
          );
        }
      } catch (err: any) {
        console.error("Error fetching products:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductSlug]);

  const handleAddToWishlist = (product: RelatedProduct) => {
    addToWishlist({ _id: product.id, name: product.name, price: product.price.toString(), mainImage: product.mainImage, slug: product.slug });
    toast.success(`${product.name} added to wishlist!`, { duration: 2000, icon: "❤️" });
  };

  if (loading) return <p>Loading related products...</p>;
  if (error) return <p className="text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mt-10 text-center">
        {isFallback ? "You May Also Like" : "Related Products"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} product={product} handleAddToWishlist={handleAddToWishlist} />
        ))}
      </div>
    </div>
  );
};

function ProductCard({
  product,
  handleAddToWishlist,
}: {
  product: RelatedProduct;
  handleAddToWishlist: (product: RelatedProduct) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Discount Badge */}
      {product.discount && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{product.discount}%
        </span>
      )}

      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Hover Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAddToWishlist(product)}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <AiOutlineHeart size={20} className="text-gray-700" />
          </motion.button>
        </div>

        {/* Centered Select Options */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-gray-300 text-sm font-semibold rounded-full z-10"
          >
            Select Options
          </button>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium break-words">{product.name}</h3>
        <div className="mt-2">
          {product.discount ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-400 line-through">${product.price}</span>
              <span className="text-red-500 font-bold">
                ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
              </span>
            </div>
          ) : (
            <p className="text-gray-800 font-semibold">${product.price}</p>
          )}
        </div>

        <button
          onClick={() => handleAddToWishlist(product)}
          className="mt-2 px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition"
        >
          Add to Wishlist
        </button>
      </div>
    </motion.div>
  );
}

export default RelatedProducts;
