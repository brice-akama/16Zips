"use client";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import ReviewForm from "./ReviewForm";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import DOMPurify from "dompurify";
import { toast } from 'react-hot-toast';
import ReviewList from "./ReviewList";
import RelatedProducts from "./RelatedProduct";

const stripHtmlTags = (html: string): string => {
  if (typeof window !== 'undefined') {
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'h2', 'h3'],
    });
    return sanitized;
  }
  return html;
};

const formatDescription = (description: string): string => {
  return description
    .split("\n")
    .map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return ''; // Skip empty lines

      // Apply margin to paragraphs
      if (trimmed.startsWith('## ')) {
        return `<h2 class="mt-9">${trimmed.replace(/^## /, '')}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        return `<h3 class="mt-9">${trimmed.replace(/^### /, '')}</h3>`;
      }

      if (/^\*\*(.+?)\*\*$/.test(trimmed)) {
        const content = trimmed.match(/^\*\*(.+?)\*\*$/)?.[1] ?? trimmed;
        return `<p class="font-semibold mt-6">${content}</p>`;
      }

      // Regular paragraph
      const className = index > 0 ? ' class="mt-9"' : ' class="mt-9"'; // Apply margin to all paragraphs
      return `<p${className}>${trimmed}</p>`;
    })
    .join('');
};


interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  mainImage: string;
  thumbnails: string[];
  weights?: { label: string; price: number }[];
  seeds?: { label: string; price: number }[];
}

interface Props {
  product: Product;
}

const ProductDetailsPage: React.FC<Props> = ({ product }) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(true);
  const [showReviewList, setShowReviewList] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // New state to toggle options visibility
  const [selectedWeight, setSelectedWeight] = useState<{ label: string; price: number } | null>(null);
  const [selectedSeed, setSelectedSeed] = useState<{ label: string; price: number } | null>(null);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const { addToCart, openCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [lastOptionType, setLastOptionType] = useState<'weight' | 'seed' | null>(null);

  


  const getEffectiveUnitPrice = () => {
    if (lastOptionType === 'weight' && selectedWeight) return selectedWeight.price;
    if (lastOptionType === 'seed' && selectedSeed) return selectedSeed.price;
    return product.price;
  };
  
  const totalPrice = getEffectiveUnitPrice() * quantity;


  const handleAddToCart = () => {
    if (totalPrice < 120) {
      toast.error("Minimum order is $120", {
        duration: 4000,
        style: {
          border: '1px solid #f87171',
          padding: '16px',
          color: '#b91c1c',
        },
        icon: '⚠️',
      });
      return;
    }
  
    if (product) {
      addToCart({
        slug: product.slug,
        name: product.name,
        price: getEffectiveUnitPrice().toString(),
        mainImage: product.mainImage,
        quantity,
        option: lastOptionType,
      });
  
      toast.success(`${product.name} added to cart!`, {
        duration: 3000,
        icon: '🛒',
      });
  
      openCart();
    }
  };
  
  

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: getEffectiveUnitPrice().toString(),

        mainImage: product.mainImage,
        slug: product.slug,
      });
    }
  };

  const toggleReviews = () => {
    if (!showReviewList && !showReviewForm) {
      setShowReviewList(true);
      setShowReviewForm(true);
      setShowDescription(false);
    } else {
      setShowReviewList(false);
      setShowReviewForm(false);
      setShowDescription(true);
    }
  };

  const showProductDescription = () => {
    setShowDescription(true);
    setShowReviewList(false);
    setShowReviewForm(false);
  };

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) return <p>Loading...</p>;

  const hasOptions = (product.weights && product.weights.length > 0) || (product.seeds && product.seeds.length > 0);

 

  return (
    <>

     {isImagePopupOpen && (
  <div className="fixed inset-0 z-50  bg-opacity-75 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg relative max-w-2xl w-full">
      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-2xl"
        onClick={() => setIsImagePopupOpen(false)}
        aria-label="Close image preview"
      >
        &times;
      </button>
      <Image
        src={selectedThumbnail === 0 ? product.mainImage : product.thumbnails[selectedThumbnail - 1]}
        alt="Enlarged product"
        width={800}
        height={800}
        unoptimized
        className="w-full h-auto rounded-md"
      />
    </div>
  </div>
)}

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              image: [product.mainImage, ...product.thumbnails],
              description: product.description,
              sku: product.slug,
              offers: {
                "@type": "Offer",
                url: `https://yourdomain.com/product/${product.slug}`,
                priceCurrency: "USD",
                price: product.price,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        ></script>
      </Head>

      <section className="max-w-6xl mx-auto px-4 py-10 mt-20">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Main Image and Thumbnails */}
          <div className="w-full md:w-1/2">
           <div className="relative cursor-zoom-in overflow-hidden" onClick={() => setIsImagePopupOpen(true)}>
  <Image
    src={selectedThumbnail === 0 ? product.mainImage : product.thumbnails[selectedThumbnail - 1]}
    alt={product.name}
    width={500}
    height={500}
    unoptimized
    className="rounded-lg transition-transform duration-300 ease-in-out hover:scale-110"
  />
</div>


            <div className="flex gap-4 mt-4">
              {[product.mainImage, ...product.thumbnails].map((thumb, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedThumbnail(index)}
                  className={`cursor-pointer ${selectedThumbnail === index ? "border-2 border-blue-500" : ""}`}
                >
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2 mt-10 md:mt-20">
            <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
            <p className="text-xl text-blue-600 mt-2">${totalPrice.toFixed(2)}</p>


            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-4">
              <button
                className="border border-gray-300 px-4 py-2 rounded-md"
                onClick={() => handleQuantityChange('decrease')}
              >
                -
              </button>
              <span className="text-lg">{quantity}</span>
              <button
                className="border border-gray-300 px-4 py-2 rounded-md"
                onClick={() => handleQuantityChange('increase')}
              >
                +
              </button>
            </div>
            <div className="border-t border-gray-300 my-4"></div>

            {/* Add to Cart and Wishlist buttons */}
            <button
              className="bg-black text-white py-3 mt-4 w-full rounded-md"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="mt-3 w-full block text-blue-600 font-semibold border border-blue-600 rounded px-4 py-2 hover:bg-blue-600 hover:text-white transition"
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </button>

            

            {/* Select Options Toggle Button */}
            {hasOptions && (
              <button
                className="mt-3 w-full block text-blue-600 font-semibold border border-blue-600 rounded px-4 py-2 hover:bg-blue-600 hover:text-white transition"
                onClick={() => setShowOptions(!showOptions)}
              >
                {showOptions ? "Hide Options" : "Select Options..."}
              </button>
            )}

            {/* Weight and Seed Options */}
            {showOptions && (
              <div className="mt-4">
                {product.weights && product.weights.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Select Weight:</h3>
                    <div className="flex flex-col gap-3 mt-2">
                      {product.weights.map((weight) => (
                        <button
                          key={weight.label}
                          onClick={() => {
                            setSelectedWeight(weight);
                            setLastOptionType('weight');
                          }}
                          
                          className={`px-4 py-2 rounded-md border ${selectedWeight?.label === weight.label ? "bg-blue-600 text-white" : "border-gray-300"}`}
                        >
                          {weight.label} (${weight.price})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.seeds && product.seeds.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Select Seed:</h3>
                    <div className="flex flex-col gap-3 mt-2">
                      {product.seeds.map((seed) => (
                        <button
                          key={seed.label}
                          onClick={() => {
                            setSelectedSeed(seed);
                            setLastOptionType('seed');
                          }}
                          className={`px-4 py-2 rounded-md border ${selectedSeed?.label === seed.label ? "bg-blue-600 text-white" : "border-gray-300"}`}
                        >
                          {seed.label} (${seed.price})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Description and Reviews */}
        <div className="mt-9 flex gap-6">
          <span
            className={`text-lg font-semibold cursor-pointer ${showDescription ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"}`}
            onClick={showProductDescription}
          >
            Product Description
          </span>
          <span
            className={`text-lg font-semibold cursor-pointer ${showReviewList || showReviewForm ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700"}`}
            onClick={toggleReviews}
          >
            Reviews
          </span>
        </div>

        {/* Product Description */}
        {showDescription && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: stripHtmlTags(formatDescription(product.description)),
            }}
          ></div>
        )}

        {/* Reviews Section */}
        {showReviewList && <ReviewList productSlug={product.slug} />}
          {showReviewForm && <ReviewForm productName={product.name} slug={product.slug} />}
          <RelatedProducts currentProductSlug={product.slug} />
      </section>
    </>
  );
};

export default ProductDetailsPage;
