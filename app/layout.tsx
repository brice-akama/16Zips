"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";// Import LanguageProvider
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import SelectLanguageButtons from "./components/SelectLanguageButtons";
import { WishlistProvider } from "@/app/context/WishlistContext"; // Import WishlistProvider
import { usePathname } from "next/navigation"; // Import usePathname
import Footer from "./components/Footer";
import { useEffect } from 'react';
import Script from "next/script";
import CartDrawer from "./components/CartDrawer";
import SlideContact from "./components/SlideContact";
import AnalyticsProvider from "./components/AnalyticsProvider";
import CookieConsent from "./components/CookieConsent";
import { GA_TRACKING_ID } from "@/lib/analytics";
import BackToTop from "./components/BackToTop";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Log traffic function
const logTraffic = async () => {
  const response = await fetch('/api/logTrffiac', {
    method: 'POST',
  });
  if (!response.ok) {
    console.error('Error logging traffic');
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current route
  const isAdminRoute = pathname.startsWith("/admin"); // Check if it's an admin route

  useEffect(() => {
    logTraffic(); // Log traffic on page load
  }, []);

  return (
    <html lang="en">
       <head>
        {/* Link to your PNG favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        
        {/* Removed metadata logic here */}
        {/* Google Analytics Scripts */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WishlistProvider>
          <CartProvider>
          <LanguageProvider>
            <AnalyticsProvider /> {/* ✅ Place AnalyticsProvider inside LanguageProvider */}
            <Toaster position="top-center" /> {/* ✅ Add Toaster here */}
              {!isAdminRoute && <Navbar />} {/* Render Navbar only if not in /admin */}
              <CartDrawer /> {/* Keep CartDrawer as needed */}
              <main>{children}
              {!isAdminRoute && <BackToTop />} {/* Add BackToTop button here */}
              </main>
              {!isAdminRoute && <Footer />}{/* Render Footer only if not in /admin */}
              {!isAdminRoute && <SelectLanguageButtons />} {/* Render only on non-admin pages */}
              {!isAdminRoute && <SlideContact />} {/* Add SideContact here */}
               
              {!isAdminRoute && <CookieConsent />} {/* Add CookieConsent here */}
              </LanguageProvider>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}