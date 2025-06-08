"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  fetchTranslatedProducts: () => Promise<any[]>; // Fetch products in selected language
  fetchTranslatedBlogPosts: () => Promise<any[]>; // Fetch blog posts in sele
  fetchStaticTranslation: (text: string) => Promise<string>; // Fetch translated static content
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>("en"); // Default language is English

  // Function to translate static text
  const translate = async (text: string): Promise<string> => {
    if (language === "en") return text; // No translation needed for English

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: "en", target: language }),
      });

      const data = await res.json();
      return data.translatedText || text;
    } catch (error) {
      console.error("Translation failed", error);
      return text; // Return the original text if translation fails
    }
  };

  // Fetch translated products from the database
  const fetchTranslatedProducts = async (): Promise<any[]> => {
    try {
      const res = await fetch(`/api/product?lang=${language}`); // Request products in selected language
      const data = await res.json();
      return data.products || [];
    } catch (error) {
      console.error("Failed to fetch products", error);
      return [];
    }
  };

   // Fetch translated blog posts from the database
   const fetchTranslatedBlogPosts = async (): Promise<any[]> => {
    try {
      const res = await fetch(`/api/blog?lang=${language}`); // Request blog posts in selected language
      const data = await res.json();
      return data || [];
    } catch (error) {
      console.error("Failed to fetch blog posts", error);
      return [];
    }
  };

  // Fetch static content translations
  const fetchStaticTranslation = async (text: string): Promise<string> => {
    if (language === "en") return text; // No translation needed for English
  
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: "en", target: language }),
      });
  
      const data = await res.json();
      return data.translatedText || text; // Return translated text or original if failed
    } catch (error) {
      console.error("Static translation failed", error);
      return text; // Return the original text if translation fails
    }
  };
  

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, fetchTranslatedProducts, fetchStaticTranslation,  fetchTranslatedBlogPosts }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}