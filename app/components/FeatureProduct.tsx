

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from "@/app/context/WishlistContext";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  edibles: boolean;
  popularProduct: boolean;
  mainImage: string;
  slug: string;
};

export default function FeatureProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?popularProduct=true');
        const { data } = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch edible products:', error);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToWishlist = (id: string, slug: string, name: string, price: number, mainImage: string) => {
    addToWishlist({ _id: id, name, price: price.toString(), mainImage, slug });

  };

  return (
    <div className="p-4">
      {/* Heading and paragraph (one time at top) */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Browse Our Full Collection
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
        From flower to edibles and everything in between — find your perfect match in our curated collection.
        </p>
      </div>

      {/* Grid of products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">

        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            handleAddToWishlist={handleAddToWishlist}
          />
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

  return (
    <div
  className="relative group flex flex-col h-full"
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>

      <Link href={`/products/${product.slug}`}>
        <div className="w-full aspect-square relative overflow-hidden flex-grow">
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
          />
          {/* Add to Cart button over image */}
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-blue-400 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-blue-500 transition-colors">
                Select Options
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3 text-center">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold hover:underline">{product.name}</h3>
        </Link>
        <p className="text-gray-600 mt-1">${product.price}</p>

        {/* Wishlist button under price */}
        <button
          className="mt-2 bg-white border border-black text-black px-4 py-1 rounded-full shadow-sm hover:bg-black hover:text-white transition-colors"
          onClick={() =>
            handleAddToWishlist(
              product.id,
              product.slug,
              product.name,
              product.price,
              product.mainImage
            )
          }
        >
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}
