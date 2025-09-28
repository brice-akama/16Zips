// components/Footer.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebookF,   FaTelegramPlane, FaPaypal, FaBitcoin, FaCcVisa, FaCcMastercard  } from "react-icons/fa";

import { SiCashapp} from "react-icons/si";
import Image from 'next/image';

import { useLanguage } from "@/app/context/LanguageContext";

const Footer: React.FC = () => {
  const { translate } = useLanguage();
  const [email, setEmail] = useState("");
  const [translatedTexts, setTranslatedTexts] = useState({
    companyName: "16Zips",
    description:
      "At 16Zips, we’re committed to delivering high-quality cannabis Flowers, Quality Seeds, Edibles, Vapes, and more — all curated for your lifestyle and wellness. Shop confidently with fast delivery and a customer-first experience. ",
    newsletter: "Newsletter",
    newsletterDesc: "Get updates on new products and special offers.",
    placeholder: "Enter your email",
    subscribe: "Subscribe",
    quickLinks: "Quick Links",
    home: "Home",
    login: "LOGIN",           // refundPolicy
    shop: "Shop",
    privacyPolicy: "Privacy Policy",
    terms: "Terms & Conditions",
    shippingInfo: "Shipping Info",
    refundPolicy: "Shipping Info",
    followUs: "Follow Us",
    copyright: `© ${new Date().getFullYear()} 16zip.com. All rights reserved.`,
  });

  useEffect(() => {
    const translateTexts = async () => {
      setTranslatedTexts({
        companyName: await translate("16zips"),
        description: await translate(
          "At 16Zips, we’re committed to delivering high-quality cannabis Flowers, Quality Seeds, Edibles, Vapes, and more — all curated for your lifestyle and wellness. Shop confidently with fast delivery and a customer-first experience. "
        ),
        newsletter: await translate("Newsletter"),
        newsletterDesc: await translate("Get updates on new products and special offers."),
        placeholder: await translate("Enter your email"),
        subscribe: await translate("Subscribe"),
        quickLinks: await translate("Quick Links"),
        home: await translate("Home"),
        login: await translate("LOGIN"),
        shop: await translate("Shop"),
        privacyPolicy: await translate("Privacy Policy"),   // refundPolicy
        terms: await translate("Terms & Conditions"),
        refundPolicy: await translate("Refund Policy"),
        shippingInfo: await translate("Shipping Info"),
        followUs: await translate("Follow Us"),
        copyright: await translate(
          `© ${new Date().getFullYear()}  16zip.com. All rights reserved.`
        ),
      });
    };

    translateTexts();
  }, [translate]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setEmail(""); // Clear input after success
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <footer className="bg-gray-800 text-white px-6 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
        {/* Company Info */}
        {/* Company Info with Logo */}
<div>
  <div className="flex justify-center md:justify-start mb-3">
    <Image
      src="/assets/nels.png"
      alt="Company Logo"
      width={120}   // adjust as needed
      height={40}   // adjust as needed
      className="object-contain"
    />
  </div>
  <p className="text-sm leading-relaxed text-center md:text-left">
    {translatedTexts.description}
  </p>
</div>
        

        {/* Navigation Links */}
        <div>
          <h3 className="font-semibold text-lg">{translatedTexts.quickLinks}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            
            <li>
              <Link href="/shop" className="hover:underline">
                {translatedTexts.shop}
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                {translatedTexts.privacyPolicy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                {translatedTexts.terms}
              </Link>
            </li>

            <li>
              <Link href="/shipping-info" className="hover:underline">
                {translatedTexts.shippingInfo}
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:underline">
                {translatedTexts.refundPolicy}
              </Link>
            </li>
            <li>
              <Link
                    href="/how-to-order"
                  className="hover:underline"
                  >
                    How To Order
                  </Link>.
            </li>

            <li>
                                <Link
                    href="/track-order"
                    className="hover:underline"
                  >
                    Track Order
                  </Link>
            </li>
                        <li>
                                <Link
                    href="/reviews"
                    className="hover:underline"
                  >
                    Reviews
                  </Link>
            </li>
            
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="font-semibold text-lg">{translatedTexts.newsletter}</h3>
          <p className="text-sm mt-2">{translatedTexts.newsletterDesc}</p>
          <form onSubmit={handleSubscribe} className="flex mt-4">
            <input
              type="email"
              placeholder={translatedTexts.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 w-full rounded-l-md border border-gray-300 text-white"
              required
            />
            <button
              type="submit"
              className="bg-red-700 px-4 rounded-r-md hover:bg-red-800 transition"
            >
              {translatedTexts.subscribe}
            </button>
          </form>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg">{translatedTexts.followUs}</h3>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
<Link
  href="https://www.facebook.com/profile.php?id=100091838611593"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-800 hover:text-blue-300"
>
  <FaFacebookF size={20} />
</Link>

            
<Link
  href="https://t.me/+KA6CTymnCfsxNTJk"
  target="_blank"
  rel="noopener noreferrer"
  className="text-[#0088cc] hover:text-blue-300"
>
  <FaTelegramPlane size={20} />
</Link>




          </div>
        </div>
      </div>

      
{/* Payment Methods */}
<div className="mt-10 text-center">
  <h4 className="text-sm font-semibold mb-4 text-gray-800">We Accept</h4>
  <div className="flex justify-center items-center flex-wrap gap-3">
    {/* PayPal */}
    <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-blue-50 shadow">
      <FaPaypal size={16} className="text-blue-600" />
      <span className="text-[8px] mt-0.5 text-blue-800 font-medium">PayPal</span>
    </div>

    {/* Cash App */}
    <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-green-50 shadow">
      <SiCashapp size={16} className="text-green-500" />
      <span className="text-[8px] mt-0.5 text-green-800 font-medium">Cash App</span>
    </div>

    {/* Bitcoin */}
    <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-yellow-50 shadow">
      <FaBitcoin size={16} className="text-yellow-500" />
      <span className="text-[8px] mt-0.5 text-yellow-800 font-medium">Bitcoin</span>
    </div>

    

    {/* Visa */}
    <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-indigo-50 shadow">
      <FaCcVisa size={16} className="text-indigo-600" />
      <span className="text-[8px] mt-0.5 text-indigo-800 font-medium">Visa</span>
    </div>

    {/* MasterCard */}
    <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-red-50 shadow">
      <FaCcMastercard size={16} className="text-red-600" />
      <span className="text-[8px] mt-0.5 text-red-800 font-medium">MasterCard</span>
    </div>
  </div>
</div>



{/* Copyright */}
<div className="mt-4 text-center text-sm text-white">
  {translatedTexts.copyright}
</div>

    </footer>
  );
};

export default Footer;