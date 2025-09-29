"use client";

import React, { FC, useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

const Description: FC = () => {
  const { translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    const translateText = async () => {
      const translated = await translate(
        "At 16Zips, we provide premium, lab-tested Cannabis Flowers, Seeds, Edibles, Vapes, and more—sourced for quality, consistency, and wellness. Every product is discreetly shipped with care, backed by responsive support and a commitment to your satisfaction. Whether you’re discovering new essentials or returning to trusted favorites, you can count on a seamless, secure, and elevated experience. Welcome to 16Zips—where excellence meets reliability.",
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