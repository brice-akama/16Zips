"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function SelectLanguageButton() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false); // Toggle dropdown visibility

  const languageOptions = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2">
      {/* Transparent button to open dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-gray-300 px-4 py-2 rounded-full text-blue-500 shadow-md backdrop-blur-md flex items-center md:hidden"
      >
        🌍
        <span className="md:hidden ml-2 whitespace-nowrap">Select Language</span> {/* Hidden on md, lg, xl */}
      </button>

      {/* Dropdown menu (Appears Above) */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white shadow-lg rounded-lg border p-2 w-40">
          <select
            id="language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setIsOpen(false); // Close dropdown after selection
            }}
            className="w-full p-2 border rounded-md"
          >
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}