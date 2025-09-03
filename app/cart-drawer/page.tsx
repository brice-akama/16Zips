"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext"; 
import Image from "next/image";
import Link from "next/link";
import CartProduct from "../components/CartProduct";

type ShippingOption = {
  label: string;
  cost: number;
};

const shippingOptions: ShippingOption[] = [
  { label: "Standard 3-5 Business Days", cost: 25 },
  { label: "Express 1-3 Business Days", cost: 30 },
  { label: "Same Day Express Delivery", cost: 40 },
  { label: "International Shipping (5-7 Business Days)", cost: 35 },
];

const CartDrawerPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      acc[item.slug] = item.quantity || 1;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const handleQuantityChange = (slug: string, change: number) => {
    const newQuantity = (quantities[slug] || 1) + change;
    if (newQuantity >= 1) {
      setQuantities((prev) => ({ ...prev, [slug]: newQuantity }));
      updateQuantity(slug, newQuantity);
    }
  };

  const applyCoupon = () => {
    if (couponCode === "SAVE10") {
      setDiscount(10);
      alert("Coupon applied! You saved $10.");
    } else {
      setDiscount(0);
      alert("Invalid coupon code.");
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const qty = quantities[item.slug] || 1;
    return acc + Number(item.price) * qty;
  }, 0);

  const shippingCost = selectedShipping ? selectedShipping.cost : 0;
  const salesTaxAmount = subtotal * 0.07;
  const total = subtotal + shippingCost + salesTaxAmount - discount;

  return (
    <div className="mt-27 lg:mt-40">
      {/* Full width black header */}
      <div className="bg-black text-white py-8 text-center w-screen">
        <h1 className="text-4xl font-black">Shopping Cart</h1>
        <p className="text-sm mb-2">
    <Link href="/" className="underline hover:text-gray-300">Home</Link> 
  </p>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {cartItems.length === 0 ? (
          <div className="text-center mt-6">
            <p>Your cart is empty. Go back to shopping!</p>
            <Link href="/shop" className="mt-4 text-blue-600">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li
                    key={item.slug}
                    className="flex flex-col md:flex-row justify-between items-center border-b py-4"
                  >
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      width={100}
                      height={100}
                      unoptimized
                      className="object-cover"
                    />

                    <div className="flex-1 px-4 w-full md:w-auto">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Price: ${Number(item.price).toFixed(2)}</p>

                      <div className="flex items-center space-x-3 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.slug, -1)}
                          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50"
                          disabled={quantities[item.slug] <= 1}
                        >
                          -
                        </button>
                        <span className="font-semibold">{quantities[item.slug]}</span>
                        <button
                          onClick={() => handleQuantityChange(item.slug, 1)}
                          className="px-3 py-1 border border-gray-400 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right mt-2 md:mt-0">
                      <span className="font-semibold">
                        ${(Number(item.price) * quantities[item.slug]).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.slug)}
                        className="ml-4 text-red-500 hover:text-red-700 block md:inline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coupon Input */}
              <div className="mt-6 mb-6 max-w-md">
                <label htmlFor="coupon" className="block mb-1 font-semibold">Coupon</label>
                <div className="flex">
                  <input
                    id="coupon"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-400 rounded-l focus:outline-none"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-red-500 text-white px-4 rounded-r hover:bg-red-600"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-green-600 mt-2">Coupon applied! You saved ${discount.toFixed(2)}.</p>
                )}
              </div>
            </div>

            {/* Cart Totals */}
            <div className="w-full md:w-2/3 lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-xl mb-6">Cart Totals</h3>

              <div className="flex justify-between mb-3">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping Options */}
              <div className="mb-4">
                <span className="font-semibold block mb-2">Shipping Options</span>
                {shippingOptions.map((option) => (
                  <label key={option.label} className="flex items-center mb-1">
                    <input
                      type="radio"
                      name="shipping"
                      className="mr-2"
                      checked={selectedShipping?.label === option.label}
                      onChange={() => setSelectedShipping(option)}
                    />
                    <span>{option.label}: </span>
                    <span className="text-red-500 font-semibold">${option.cost.toFixed(2)}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between mb-3">
                <span>Sales Tax</span>
                <span>${salesTaxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)} USD</span>
              </div>

              {/* Proceed to Checkout */}
              <Link
                href={selectedShipping ? "/checkout" : "#"}
                className={`block mt-6 text-white text-center py-3 rounded font-semibold transition-colors
                  ${selectedShipping ? "bg-red-500 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed border border-red-500"}`}
                onClick={(e) => { if (!selectedShipping) e.preventDefault(); }}
              >
                Proceed to Checkout
              </Link>

              {!selectedShipping && (
                <p className="mt-2 text-red-600 text-sm font-semibold text-center">
                  ⚠️ Please select a shipping option before proceeding.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Related Products / CartProduct */}
        <CartProduct />
      </div>
    </div>
  );
};

export default CartDrawerPage;
