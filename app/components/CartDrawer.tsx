"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext"; // Adjust the path as necessary
import Link from "next/link";
import Image from "next/image";

const CartDrawer: React.FC = () => {
  const { cartItems, totalPrice, removeFromCart, isCartOpen, closeCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Initialize quantities when the cart items change
  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      acc[item.slug] = item.quantity || 1;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [cartItems]);

  // Update the quantity and recalculate the total price
  const updateQuantity = (slug: string, value: number) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[slug] || 1) + value);
      return { ...prev, [slug]: newQuantity };
    });
  };

  // Function to handle closing the cart when a link is clicked
  const handleLinkClick = () => {
    closeCart(); // Close the cart when the user clicks on the link
  };

  if (!isCartOpen) return null;

  return (
    <div id="cart-drawer" className="fixed right-0 top-0 w-80 bg-gray-100 shadow-lg h-full p-4 mt-20 z-20 overflow-hidden">
      {/* Close Button */}
      <button onClick={closeCart} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl">
        ✖
      </button>

      <h2 className="text-xl font-bold mt-20 text-center">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-6">
          <p>Your cart is empty, continue shopping.</p>
          <Link href="/shop" className="mt-4 block bg-blue-600 text-white text-center py-2 rounded mt-10" onClick={handleLinkClick}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          {/* Scrollable Cart Items */}
          <div className="h-72 overflow-y-auto">
            <ul>
              {cartItems.map((item, index) => {
                const itemQuantity = quantities[item.slug] || 1;
                const itemTotalPrice = (parseFloat(item.price) * itemQuantity).toFixed(2);

                return (
                  <React.Fragment key={item.slug}>
                    <li className="flex justify-between items-center my-2">
                      <Image src={item.mainImage} alt={item.name} width={64} height={64}  unoptimized className="object-cover" />
                      <div>
                        <h3 className="whitespace-nowrap">{item.name}</h3>
                        <div className="mt-3 flex justify-center items-center space-x-3">
                          <button className="bg-gray-200 rounded px-3 py-1" onClick={() => updateQuantity(item.slug, -1)}>
                            -
                          </button>
                          <span className="text-lg font-bold">{itemQuantity}</span>
                          <button className="bg-gray-200 rounded px-3 py-1" onClick={() => updateQuantity(item.slug, 1)}>
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <span>${itemTotalPrice}</span>
                        <button onClick={() => removeFromCart(item.slug)} className="ml-2 text-red-500">
                          Remove
                        </button>
                      </div>
                    </li>

                    {/* Add a horizontal line except after the last item */}
                    {index < cartItems.length - 1 && <hr className="my-3 border-t border-gray-300 opacity-50" />}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>

          {/* Total and Buttons */}
          <div className="mt-4">
            <h3 className="font-bold">
              Total: $
              {cartItems
                .reduce((acc, item) => acc + parseFloat(item.price) * (quantities[item.slug] || 1), 0)
                .toFixed(2)}
            </h3>
            <Link href="/cart-drawer" className=" block text-blue-600 text-center py-2" onClick={handleLinkClick}>
              View Cart
            </Link>
            <Link href="/checkout" className="block  bg-blue-600 text-white text-center py-2 rounded" onClick={handleLinkClick}>
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;