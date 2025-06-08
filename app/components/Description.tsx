// components/Description.tsx
"use client";

import React, { FC, useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

const Description: FC = () => {
  const { translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    const translateText = async () => {
      const translated = await translate(
        "At 16Zips, we’re committed to delivering high-quality cannabis, edibles, vapes, and more — all curated for your lifestyle and wellness. Shop confidently with fast delivery and a customer-first experience. Our team is dedicated to providing you with the best products and service, ensuring that your shopping experience is seamless and enjoyable. Whether you’re looking for the latest cannabis trends or classic favorites, we’ve got you covered. Explore our selection today and discover the 16Zips difference!",
      );
      setTranslatedText(translated);
    };

    translateText();
  }, [translate]);

  return (
    <div className="w-full py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {translatedText || "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default Description;