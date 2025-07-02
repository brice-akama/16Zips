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
        "At 16Zips, we’re passionate about offering you the highest-quality Cannabis Flowers, Seeds, Edibles, Vapes, and more — all carefully selected to enhance your lifestyle and wellness. We believe shopping should be easy, enjoyable, and personal, which is why we provide fast delivery and friendly, dedicated support every step of the way. Whether you’re exploring new favorites or sticking with trusted classics, we’re here to make your experience exceptional. Join the 16Zips family today and feel the difference in every order.",
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