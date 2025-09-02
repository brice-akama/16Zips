'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoTrashBinOutline } from 'react-icons/io5';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from "@/app/context/CartContext";

interface WishlistItem {
  slug: string;
  name: string;
  price: string;
  mainImage: string;
}

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist() as {
    wishlist: WishlistItem[];
    removeFromWishlist: (slug: string) => void;
  };
  const { addToCart, openCart } = useCart();
  const router = useRouter();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleViewProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const updateQuantity = (slug: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [slug]: Math.max(1, (prev[slug] || 1) + value),
    }));
  };

  const handleAddToCart = (item: WishlistItem) => {
    const quantity = quantities[item.slug] || 1;
    addToCart({
      slug: item.slug,
      name: item.name,
      price: item.price,
      mainImage: item.mainImage,
      quantity,
    });
    openCart();
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 mt-40">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Your Wishlist</h1>
        <p className="text-lg mt-3 text-gray-600">Here are the products you've added to your wishlist.</p>
      </div>

      {wishlist.length > 0 ? (
        <>
          {/* Desktop / Tablet */}
          <div className="hidden md:block">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Quantity</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item, idx) => (
                  <tr key={`${item.slug}-${idx}`} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="flex items-center py-4 px-4 gap-4 cursor-pointer" onClick={() => handleViewProduct(item.slug)}>
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded"
                      />
                      <span className="text-blue-600 font-medium underline">{item.name}</span>
                    </td>
                    <td className="py-4 px-4">${item.price}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-gray-200 rounded px-2 py-1"
                          onClick={() => updateQuantity(item.slug, -1)}
                        >-</button>
                        <span className="text-center w-6">{quantities[item.slug] || 1}</span>
                        <button
                          className="bg-gray-200 rounded px-2 py-1"
                          onClick={() => updateQuantity(item.slug, 1)}
                        >+</button>
                      </div>
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <button
                        onClick={() => removeFromWishlist(item.slug)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 whitespace-nowrap"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 whitespace-nowrap"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleViewProduct(item.slug)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 whitespace-nowrap"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="block md:hidden space-y-4">
            {wishlist.map((item, idx) => (
              <div
                key={`${item.slug}-${idx}`}
                className="border border-gray-200 rounded-lg p-4 flex flex-col items-start gap-4"
              >
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleViewProduct(item.slug)}>
                  <Image
                    src={item.mainImage}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded"
                  />
                  <span className="text-blue-600 font-medium underline">{item.name}</span>
                </div>
                <p className="text-gray-800 font-semibold">${item.price}</p>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-200 rounded px-2 py-1"
                    onClick={() => updateQuantity(item.slug, -1)}
                  >-</button>
                  <span className="w-6 text-center">{quantities[item.slug] || 1}</span>
                  <button
                    className="bg-gray-200 rounded px-2 py-1"
                    onClick={() => updateQuantity(item.slug, 1)}
                  >+</button>
                </div>
                <div className="flex gap-2 flex-wrap w-full">
                  <button
                    onClick={() => removeFromWishlist(item.slug)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex-1"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex-1"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleViewProduct(item.slug)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex-1"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600 mt-10">
          <p>Your wishlist is empty.</p>
          <Link href="/shop" className="text-blue-600 font-semibold hover:underline mt-4 inline-block">
            Start shopping now!
          </Link>
        </div>
      )}
    </section>
  );
};

export default WishlistPage;
