'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  price: number;
}

interface RelatedProductsProps {
  currentProductSlug: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductSlug }) => {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(false); // To toggle heading
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`/api/products?slug=${currentProductSlug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch related products");
        }

        const related = data.data?.relatedProducts || [];

        if (related.length > 0) {
          const formatted = related.map((product: any) => ({
            id: product.id || product._id,
            name: product.name,
            slug: product.slug,
            mainImage: product.mainImage,
            price: product.price,
          }));
          setRelatedProducts(formatted);
        } else {
          // Fallback logic if no related products
          setIsFallback(true);
          const fallbackRes = await fetch(`/api/products?popularProduct=true&limit=4`); // create this API endpoint
          const fallbackData = await fallbackRes.json();

          const formattedFallback = fallbackData.data.map((product: any) => ({
            id: product.id || product._id,
            name: product.name,
            slug: product.slug,
            mainImage: product.mainImage,
            price: product.price,
          }));

          setRelatedProducts(formattedFallback);
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
    // Use destructuring to access product properties
    const { id, name, price, mainImage, slug } = product;
    addToWishlist({ _id: id, name, price: price.toString(), mainImage, slug });
  };

  if (loading) return <p>Loading related products...</p>;
  if (error) return <p className="text-red-500 mt-10">Error: {error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mt-10">
        {isFallback ? "You May Also Like" : "Related Products"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div key={product.id} className="group">
            <div className="relative w-full h-[300px] overflow-hidden rounded-lg mt-10">
              <Image
                src={product.mainImage}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                unoptimized
                className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              />

              {/* Select Options Button - Centered on Hover */}
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

            <div className="mt-4 text-center">
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-blue-600">${product.price}</p>
              <button 
                className="mt-2 px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition"
                onClick={() => handleAddToWishlist(product)} // Pass the entire product object here
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
