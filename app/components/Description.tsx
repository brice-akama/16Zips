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
        "At 16Zips, we’re dedicated to delivering premium Cannabis Flowers, Seeds, Edibles, Vapes, and more — all carefully curated to elevate your lifestyle and wellness. With fast, discreet shipping and friendly, reliable support, we make your shopping experience smooth, safe, and enjoyable. Whether you're exploring new favorites or sticking with trusted classics, every order is handled with care and crafted to exceed expectations. Join the 16Zips family — where quality, convenience, and customer care come together.",
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