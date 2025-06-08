// page.tsx
import { Metadata } from "next";
import WishlistPage from "./WishlistPage";
import React from "react";

// Define metadata for the Wishlist page
export const metadata: Metadata = {
  title: "Wishlist - 16Zips",
  description:
    "View and manage your wishlist on 16Zips. Keep track of your favorite cannabis products and save them for later purchase.",
  keywords:
    "16Zips wishlist, cannabis wishlist, save products for later, weed wishlist, cannabis favorites, THC products wishlist",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Wishlist - 16Zips",
    url: "https://www.16zips.com/wishlist",
    description:
      "The Wishlist page allows users to save their favorite cannabis products for later purchase on 16Zips.",
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
      <WishlistPage />
    </>
  );
}
