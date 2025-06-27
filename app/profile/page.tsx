// page.tsx
import { Metadata } from "next";
import LoginPage from "./LoginPage";
import React from "react";

// Define metadata for the Login page
export const metadata: Metadata = {
  title: "Login - 16Zips",
  description:
    "Access your 16Zips account to manage orders, track deliveries, and enjoy a personalized cannabis shopping experience.",
  keywords:
    "16Zips login, customer login, cannabis account access, weed order tracking, THC product dashboard, cannabis customer area",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Login - 16Zips",
    url: "https://www.16zip.com/login",
    description:
      "Login to your 16Zips account for a personalized experience, order tracking, and access to premium cannabis products.",
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
      <LoginPage />
    </>
  );
}
