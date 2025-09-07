"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIPPING_THRESHOLD = 400;

const CartDrawer: React.FC = () => {
  const { cartItems, removeFromCart, isCartOpen, closeCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      acc[item.slug] = item.quantity || 1;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const updateQuantity = (slug: string, value: number) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[slug] || 1) + value);
      return { ...prev, [slug]: newQuantity };
    });
  };

  const handleLinkClick = () => {
    closeCart();
  };

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * (quantities[item.slug] || 1),
    0
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-20 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay background */}
          <div
            className="absolute inset-0  bg-opacity-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="relative w-80 h-full bg-white shadow-lg z-30 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={closeCart}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mt-16 text-center">Your Cart</h2>

            {cartItems.length === 0 ? (
              <div className="text-center mt-6 flex-1 flex flex-col justify-center">
                <p>Your cart is empty, continue shopping.</p>
                <Link
                  href="/shop"
                  className="block bg-red-500 text-white text-center py-2 rounded mt-4"
                  onClick={handleLinkClick}
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Scrollable Cart Items */}
                <div className="flex-1 overflow-y-auto mt-4 px-2">
                  <ul className="space-y-4">
                    {cartItems.map((item, index) => {
                      const itemQuantity = quantities[item.slug] || 1;
                      const itemTotalPrice = (
                        parseFloat(item.price) * itemQuantity
                      ).toFixed(2);

                      return (
                        <React.Fragment key={item.slug}>
                          <li className="flex justify-between items-center h-28">
                            <Image
                              src={item.mainImage}
                              alt={item.name}
                              width={64}
                              height={64}
                              unoptimized
                              className="object-cover rounded"
                            />
                            <div className="flex-1 px-2">
                              <h3 className="text-sm font-semibold break-words">
                                {item.name}
                              </h3>
                              <div className="mt-3 flex justify-start items-center space-x-3">
                                <button
                                  className="bg-gray-200 rounded px-3 py-1"
                                  onClick={() => updateQuantity(item.slug, -1)}
                                >
                                  -
                                </button>
                                <span className="text-lg font-bold">
                                  {itemQuantity}
                                </span>
                                <button
                                  className="bg-gray-200 rounded px-3 py-1"
                                  onClick={() => updateQuantity(item.slug, 1)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <span>${itemTotalPrice}</span>
                              <button
                                onClick={() => removeFromCart(item.slug)}
                                className="ml-2 text-red-500 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                          {index < cartItems.length - 1 && (
                            <hr className="my-3 border-t border-gray-300 opacity-50" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </div>

                {/* Fixed Footer with Total & Buttons */}
                <div className="p-4 border-t border-gray-300 mb-10">
                  {cartTotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-sm text-orange-500 font-medium mb-2">
                      Add ${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(2)}{" "}
                      more for free shipping!
                    </p>
                  )}
                  {cartTotal >= FREE_SHIPPING_THRESHOLD && (
                    <p className="text-sm text-green-600 font-medium mb-2">
                      You qualify for free shipping! 🎉
                    </p>
                  )}

                  <h3 className="font-bold mb-2">
                    Total: ${cartTotal.toFixed(2)}
                  </h3>

                  <Link
                    href="/cart-drawer"
                    className="block bg-red-500 text-white text-center py-2 rounded mb-2"
                    onClick={handleLinkClick}
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="block bg-red-500 text-white text-center py-2 rounded"
                    onClick={handleLinkClick}
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
