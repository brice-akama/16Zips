// page.tsx
import { Metadata } from "next";
import ShippingPolicy from "./ShippingPolicy";
import React from "react";

// Define metadata for the Shipping Policy page
export const metadata: Metadata = {
  title: "Shipping Policy - 16Zips",
  description:
    "Learn about our shipping policy, including delivery times, areas served, shipping methods, and what to expect when ordering cannabis from 16Zips.",
  keywords:
    "16Zips shipping policy, cannabis delivery, weed shipping information, THC product delivery, shipping terms, marijuana shipping rules",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shipping Policy - 16Zips",
    url: "https://www.16zip.com/shipping-policy",
    description:
      "This Shipping Policy explains how and when cannabis products from 16Zips will be delivered, including estimated delivery times and shipping restrictions.",
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
      <ShippingPolicy />
    </>
  );
}
