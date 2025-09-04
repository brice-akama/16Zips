import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { toast } from "react-hot-toast";

interface StickyBarProps {
  product: any;
  totalPrice: number;
  quantity: number;
  handleQuantityChange: (action: 'increase' | 'decrease') => void;
  getEffectiveUnitPrice: () => number;
  selectedWeight: any;
  selectedSeed: any;
  lastOptionType: "weight" | "seed" | null;
  setSelectedWeight: (weight: any) => void;
  setSelectedSeed: (seed: any) => void;
  setLastOptionType: (type: "weight" | "seed") => void;
}

const StickyBottomBar: React.FC<StickyBarProps> = ({
  product,
  totalPrice,
  quantity,
  handleQuantityChange,
  getEffectiveUnitPrice,
  lastOptionType,
  setSelectedWeight,
  setSelectedSeed,
  setLastOptionType,
}) => {
  const [show, setShow] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { addToCart, openCart } = useCart();
  const { addToWishlist } = useWishlist();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  const handleAddToCart = () => {
    if (totalPrice < 120) {
      toast.error("Minimum order is $120");
      return;
    }
    addToCart({
      slug: product.slug,
      name: product.name,
      price: getEffectiveUnitPrice().toString(),
      mainImage: product.mainImage,
      quantity,
      option: lastOptionType,
    });
    toast.success(`${product.name} added to cart!`);
    openCart();
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      _id: product._id,
      name: product.name,
      price: getEffectiveUnitPrice().toString(),
      mainImage: product.mainImage,
      slug: product.slug,
    });
  };

  const hasOptions =
    (product.weights && product.weights.length > 0) ||
    (product.seeds && product.seeds.length > 0);

  return (
    <div className="hidden md:flex fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 shadow-md p-4 flex-col max-w-6xl mx-auto">
      

      {/* Main Image */}
  <div className="w-20 h-20 flex-shrink-0 mr-4">
    <img
      src={product.selectedThumbnail ? product.thumbnails[product.selectedThumbnail - 1] : product.mainImage}
      alt={product.name}
      className="w-full h-full object-cover rounded-md"
    />
  </div>
      {/* Options section */}
      {hasOptions && (
        <div className="mb-2">
          <button
            className="w-full text-blue-600 font-semibold border border-blue-600 rounded px-4 py-2 hover:bg-blue-600 hover:text-white transition"
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? "Hide Options" : "Select Options..."}
          </button>

          {showOptions && (
            <div className="mt-2 flex flex-col gap-2">
              {product.weights && product.weights.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">Select Weight:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.weights.map((weight: any) => (
                      <button
                        key={weight.label}
                        onClick={() => {
                          setSelectedWeight(weight);
                          setLastOptionType("weight");
                        }}
                        className={`px-3 py-1 rounded-md border ${
                          lastOptionType === "weight" && weight === product.selectedWeight
                            ? "bg-blue-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {weight.label} (${weight.price})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.seeds && product.seeds.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mt-2">Select Seed:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.seeds.map((seed: any) => (
                      <button
                        key={seed.label}
                        onClick={() => {
                          setSelectedSeed(seed);
                          setLastOptionType("seed");
                        }}
                        className={`px-3 py-1 rounded-md border ${
                          lastOptionType === "seed" && seed === product.selectedSeed
                            ? "bg-blue-600 text-white"
                            : "border-gray-300"
                        }`}
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
      )}

      {/* Quantity + Price + Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="border px-3 py-1 rounded-md"
            onClick={() => handleQuantityChange("decrease")}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            className="border px-3 py-1 rounded-md"
            onClick={() => handleQuantityChange("increase")}
          >
            +
          </button>
          <span className="font-semibold ml-4">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
          >
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyBottomBar;
