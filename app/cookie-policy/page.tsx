// app/legal/cookies-policy/page.tsx
import { Metadata } from "next";
import CookiesPolicyPage  from "./CookiesPolicyPage";
import React from "react";

// Define metadata for this page
export const metadata: Metadata = {
  title: 'Cookies Policy | 16Zips',
  description: 'Learn how 16Zips uses cookies to improve your experience on our cannabis e-commerce website.',
  
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cookies Policy - 16Zips",
    url: "https://www.16zip.com/Cookies Policy", // update if needed
    description: 'Learn how 16Zips uses cookies to improve your experience on our cannabis e-commerce website.',
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
      <CookiesPolicyPage />
    </>
  );
}
