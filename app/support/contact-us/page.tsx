// page.tsx
import { Metadata } from "next";
import ContactUsWithMap from "./ContactUsWithMap";
import React from "react";

// Define metadata for the Contact Us with Map page
export const metadata: Metadata = {
  title: "Contact Us - 16Zips",
  description:
    "Get in touch with 16Zips. Visit us, or reach out for inquiries, support, or feedback. Our location and contact details are provided for your convenience.",
  keywords:
    "contact 16Zips, customer service, cannabis store contact, support contact, marijuana store address, 16Zips contact details, cannabis store location",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Contact Us - 16Zips",
    url: "https://www.16zip.com/contact-us",
    description:
      "Contact 16Zips for any inquiries, or visit us. We are happy to assist you with any questions about our products or services.",
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
      <ContactUsWithMap />
    </>
  );
}
