// components/Description.tsx

"use client";


import React from 'react';

export default function CannabisProductsSection() {
  return (
    <section className="py-5 px-4  from-green-50 to-emerald-50">
      <div className="max-w-5xl mx-auto">
        {/* Main Heading */}
        <div className="text-center">
          <h2 className="text-1xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
            Premium Cannabis Products, Delivered with Care
          </h2>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto mb-4">
            <span className="font-semibold">Shopping for cannabis online</span> should be simple, safe, and trustworthy.  
            At <span className="font-semibold">16Zips</span>, we’ve built a premium destination where you can confidently explore{' '}
            <span className="font-semibold">lab-tested cannabis products</span> — from flower and vapes to edibles and topicals.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-5 p-8 md:p-12 text-center">
          <p className=" md:text-lg text-gray-700 leading-relaxed mb-8">
            We offer:
          </p>

          <ul className="space-y-3 text-gray-700 text-base md:text-lg">
            <li className="leading-relaxed">
              <span className="font-bold">Premium flower, pre-rolls, and concentrates</span> — sourced from licensed, trusted growers.
            </li>
            <li className="leading-relaxed">
              <span className="font-bold">Disposable vapes, edibles, and tinctures</span> for every experience level and preference.
            </li>
            <li className="leading-relaxed">
              <span className="font-bold">Discreet, fast shipping</span> and <span className="font-bold">secure, age-verified checkout</span>.
            </li>
            <li className="leading-relaxed">
              Detailed lab results, strain info, and dosing guidance — so you always know what you’re getting.
            </li>
          </ul>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed mt-6">
            Whether you’re new to cannabis or a seasoned enthusiast, <span className="font-bold">16Zips</span> is your trusted partner for quality, consistency, and care.{' '}
            <span className="font-bold">Shop now and experience cannabis, elevated.</span>
          </p>
        </div>
      </div>
    </section>
  );
}