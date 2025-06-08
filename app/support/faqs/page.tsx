// page.tsx
import { Metadata } from "next";
import FaqPage from "./FaqPage";
import React from "react";

// Define metadata for the FAQ page
export const metadata: Metadata = {
  title: "FAQ - 16Zips",
  description:
    "Find answers to the most frequently asked questions about 16Zips products, services, and policies. Get the information you need to shop and use our services with confidence.",
  keywords:
    "16Zips FAQ, cannabis frequently asked questions, cannabis shopping guide, marijuana order questions, THC product FAQs, cannabis store help",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "FAQ - 16Zips",
    url: "https://www.16zips.com/faq",
    description:
      "Explore our FAQ section to get quick answers to common questions about our cannabis products, shipping, returns, and more.",
    publisher: {
      "@type": "Organization",
      name: "16Zips",
      url: "https://www.16zips.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqPage />
    </>
  );
}
