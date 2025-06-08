"use client";

import { useLanguage } from "../context/LanguageContext";
// Globe icon for better UI

export default function SelectLanguageButton() {
  const { language, setLanguage } = useLanguage();

  // Mapping languages to country flags (using emoji for simplicity)
  const languageOptions = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
  ];

  return (
    <div className="flex items-center space-x-2">
      
      <label htmlFor="language" className="font-medium whitespace-nowrap mt-1"></label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded-md p-2"
      >
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}