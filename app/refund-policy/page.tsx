// page.tsx
import { Metadata } from "next";
import RefundPolicy from "./RefundPolicy";
import React from "react";

// Define metadata for the Refund Policy page
export const metadata: Metadata = {
  title: "Refund Policy - 16Zips",
  description:
    "Read our refund policy to understand how 16Zips handles product returns and refund requests. We aim to provide a fair and transparent experience.",
  keywords:
    "16Zips refund policy, cannabis return policy, weed product refunds, THC product return, cannabis order issues, product replacement policy",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Refund Policy - 16Zips",
    url: "https://www.16zip.com/refund-policy",
    description:
      "Our refund policy outlines the conditions under which refunds or replacements may be issued for cannabis products purchased from 16Zips.",
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
      <RefundPolicy />
    </>
  );
}
