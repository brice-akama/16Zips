import { Metadata } from "next";
import OrderPage from "./OrderPage";

// Metadata (still valid)
export const metadata: Metadata = {
  title: "Checkout  - 16Zips",
  description:
    "Learn more about 16Zips, your trusted source for premium cannabis products. We're committed to quality, discretion, and exceptional customer service.",
  keywords:
    "16Zips, cannabis company, cannabis products, weed delivery, marijuana dispensary, premium cannabis, THC, CBD, edibles, cannabis flower, cannabis concentrates",
  
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "16Zips",
    url: "https://www.16zip.com",
    
    description:
      "16Zips is a premium cannabis brand offering high-quality cannabis flower, edibles, and concentrates. Trusted by thousands for discreet and reliable delivery.",
    sameAs: [
      "https://www.instagram.com/16zips",
      "https://www.facebook.com/16zips",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OrderPage />
    </>
  );
}
