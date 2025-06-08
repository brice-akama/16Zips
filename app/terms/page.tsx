// page.tsx
import { Metadata } from "next";
import TermsAndConditions from "./TermsAndConditions";
import React from "react";

// Define metadata for the Terms and Conditions page
export const metadata: Metadata = {
  title: "Terms and Conditions - 16Zips",
  description:
    "Read the terms and conditions for using 16Zips services. Understand the rules and regulations that govern your use of our cannabis products and website.",
  keywords:
    "16Zips terms and conditions, cannabis terms, website terms, marijuana store terms, 16Zips policies, cannabis purchase agreement",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms and Conditions - 16Zips",
    url: "https://www.16zips.com/terms-and-conditions",
    description:
      "The Terms and Conditions page outlines the rules and regulations for using the 16Zips website and purchasing cannabis products.",
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
      <TermsAndConditions />
    </>
  );
}
