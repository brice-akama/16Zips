'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoTrashBinOutline } from 'react-icons/io5';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useWishlist } from '@/app/context/WishlistContext'; // Import Wishlist Context
import { useCart } from "@/app/context/CartContext";

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist(); // Get wishlist and remove function from context
  const router = useRouter();
    const { addToCart, openCart } = useCart();
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Navigate to product detail page
  const handleViewProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  // Handle quantity changes
  const updateQuantity = (slug: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [slug]: Math.max(1, (Number(prev[slug]) || 1) + value),
    }));
  };
  

 // Handle adding to cart and redirecting
 const handleAddToCart = (id: string, name: string, price: string,  slug: string, mainImage: string) => {
  const quantity = quantities[id] || 1;
  addToCart({ slug, name, price, mainImage, quantity });
  openCart(); // Open cart drawer
};

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 mt-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-20">Your Wishlist</h1>
        <p className="text-lg mt-3 text-gray-600">Here are the products you've added to your wishlist.</p>
      </div>

      {/* Wishlist Products Grid */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <div key={product.slug} className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
              {/* Product Image */}
              <Link href={`/products/${product.slug}`} className="block relative w-full h-48 sm:h-60 md:h-72 lg:h-48">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg mb-4 md:h-72 lg:h-48 h-48 sm:h-60"
                />
              </Link>

              {/* Product Name */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-xl text-blue-600 mb-4">${product.price}</p>

              {/* Quantity Selector */}
<div className="mt-3 flex justify-center items-center space-x-3">
  <button
    className="bg-gray-200 rounded px-3 py-1"
    onClick={() => updateQuantity(product.slug, -1)} 
  >
    -
  </button>
  <span className="text-lg font-bold">{quantities[product.slug] || 1}</span> {/* Access the quantity by product.slug */}
  <button
    className="bg-gray-200 rounded px-3 py-1"
    onClick={() => updateQuantity(product.slug, 1)} 
  >
    +
  </button>
</div>





              {/* View Product Button */}
              <button
                onClick={() => handleViewProduct(product.slug)}
                className="text-blue-600 mb-4 hover:underline"
              >
                View Product
              </button>

              {/* Add to Cart Button */}
              <button
  onClick={() => handleAddToCart(product.slug, product.name, product.price, product.slug, product.mainImage)}
  className="bg-black text-white font-semibold py-2 px-4 rounded w-full mb-4"
>
  Add to Cart
</button>



              {/* Remove from Wishlist Button */}
              <button
                onClick={() => removeFromWishlist(product.slug)}
                className="text-red-600 flex items-center gap-2 hover:text-red-700"
              >
                <IoTrashBinOutline />
                Remove from Wishlist
              </button>

              {/* Social Media Share Icons */}
              <div className="flex space-x-3 mt-4">
                <Link href={`https://www.facebook.com/sharer/sharer.php?u=https://yourwebsite.com/product/${product.slug}`} target="_blank" rel="noopener noreferrer">
                  <FaFacebookF className="text-blue-600 text-2xl hover:text-blue-800" />
                </Link>
                <Link href={`https://www.instagram.com/share?url=https://yourwebsite.com/product/${product.slug}`} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-pink-600 text-2xl hover:text-pink-800" />
                </Link>
                <Link href={`https://twitter.com/share?url=https://yourwebsite.com/product/${product.slug}`} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-blue-400 text-2xl hover:text-blue-600" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p>Your wishlist is empty.</p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline mt-4">
            Start shopping now!
          </Link>
        </div>
      )}
    </section>
  );
};

export default WishlistPage;