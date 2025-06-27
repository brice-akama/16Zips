// page.tsx
// page.tsx
import { Metadata } from "next";
import PrivacyPolicy from "./PrivacyPolicy";
import React from "react";

// Define metadata for this page
export const metadata: Metadata = {
  title: "Privacy Policy - 16Zips",
  description:
    "Review the privacy policy of 16Zips to understand how we collect, use, and protect your personal information when you shop for cannabis products online.",
  keywords:
    "16Zips privacy policy, cannabis privacy, customer data, weed store privacy, cannabis store terms, data protection, THC product privacy",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy - 16Zips",
    url: "https://www.16zip.com/privacy-policy", // update if needed
    description:
      "This Privacy Policy outlines how 16Zips handles your data and respects your privacy while you use our cannabis e-commerce services.",
    publisher: {
      "@type": "Organization",
      name: "16Zips",
      url: "https://www.16zip.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyPolicy />
    </>
  );
}
