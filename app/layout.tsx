"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { usePathname } from "next/navigation";
import Footer from "./components/Footer";
import { useEffect } from "react";
import Script from "next/script";
import CartDrawer from "./components/CartDrawer";
import SlideContact from "./components/SlideContact";
import AnalyticsProvider from "./components/AnalyticsProvider";
import CookieConsent from "./components/CookieConsent";
import { GA_TRACKING_ID } from "@/lib/analytics";
import BackToTop from "./components/BackToTop";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import SalesNotification from "./components/SalesNotification";
import BottomNav from "./components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const logTraffic = async () => {
  const response = await fetch("/api/logTrffiac", {
    method: "POST",
  });
  if (!response.ok) {
    console.error("Error logging traffic");
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isResetPasswordPage = pathname === "/reset-password";
  const isAdminLoginPage = pathname === "/admin/login";

  useEffect(() => {
    logTraffic();
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />

        {/* Google Analytics */}
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

          {/* Conditionally load JivoChat only if NOT admin and NOT reset-password */}

        {!isAdminRoute && !isResetPasswordPage && !isAdminLoginPage && (

          <Script

            src="https://code.jivosite.com/widget/YO0AKY0r12"

            strategy="afterInteractive"

            async

          />

        )}

      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WishlistProvider>
          <CartProvider>
            <LanguageProvider>
              <AnalyticsProvider />
              <Toaster position="top-center" />

              {/* Show only if not admin or reset-password */}
              {!isAdminRoute && !isResetPasswordPage && <Navbar />}
              <CartDrawer />
              {/* Add SalesNotification here */}
        {!isAdminRoute && !isResetPasswordPage && <SalesNotification />}

              <main>
                 <ScrollToTop /> {/* ✅ Add this here */}
                {children}
                {!isAdminRoute && !isResetPasswordPage && <BackToTop />}
                {!isAdminRoute && !isResetPasswordPage && <BottomNav />}
              </main>

              {!isAdminRoute && !isResetPasswordPage && <Footer />}
              {!isAdminRoute && !isResetPasswordPage && <SlideContact />}
              {!isAdminRoute && !isResetPasswordPage && <CookieConsent />}
               {/* Bottom navigation for mobile */}
    
            </LanguageProvider>
          </CartProvider>
        </WishlistProvider>

        

      </body>
    </html>
  );
}
