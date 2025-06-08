// page.tsx
import { Metadata } from "next";
import SupportPage from "./SupportPage";  // Renamed the import to SupportPage
import React from "react";

// Define metadata for the Support page
export const metadata: Metadata = {
  title: "Support - 16Zips",
  description:
    "Get support for your cannabis product orders, including tracking, returns, and account updates on 16Zips.",
  keywords:
    "16Zips support, cannabis order support, track orders, return policy, account updates, customer service, marijuana help",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Support - 16Zips",
    url: "https://www.16zips.com/support",
    description:
      "The Support page provides answers to common questions like order tracking, return policies, and account updates. Get help with your cannabis orders on 16Zips.",
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
      <SupportPage />  {/* Renamed to SupportPage */}
    </>
  );
}
