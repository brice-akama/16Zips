// components/Footer.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebookF,   FaTelegramPlane } from "react-icons/fa";
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
          `© ${new Date().getFullYear()}  16zips.com. All rights reserved.`
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
    <footer className="bg-gray-100 text-black px-6 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-bold">{translatedTexts.companyName}</h2>
          <p className="text-sm mt-2 leading-relaxed">{translatedTexts.description}</p>
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
              className="p-2 w-full rounded-l-md border border-gray-300 text-black"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 px-4 rounded-r-md hover:bg-blue-700 transition"
            >
              {translatedTexts.subscribe}
            </button>
          </form>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="font-semibold text-lg">{translatedTexts.quickLinks}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                {translatedTexts.home}
              </Link>
            </li>
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
            
          </ul>
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

      {/* Copyright */}
      <div className="mt-10 text-center text-sm text-gray-800">
        {translatedTexts.copyright}
      </div>
    </footer>
  );
};

export default Footer;