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

              <main>
                {children}
                {!isAdminRoute && !isResetPasswordPage && <BackToTop />}
              </main>

              {!isAdminRoute && !isResetPasswordPage && <Footer />}
              {!isAdminRoute && !isResetPasswordPage && <SlideContact />}
              {!isAdminRoute && !isResetPasswordPage && <CookieConsent />}
            </LanguageProvider>
          </CartProvider>
        </WishlistProvider>

        {/* ✅ Load Tawk.to Live Chat - Just Before </body> */}
        {!isAdminRoute && !isResetPasswordPage && !isAdminLoginPage && (
  <Script
    id="tawk-script"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        (function(global){
          global.$_Tawk_AccountKey='6866211125edf7190f46dc4a';
          global.$_Tawk_WidgetId='1iv7f2c64';
          global.$_Tawk_Unstable=false;
          global.$_Tawk = global.$_Tawk || {};
          (function (w){
            function l() {
              if (window.$_Tawk.init !== undefined) {
                return;
              }
              window.$_Tawk.init = true;
              var files = [
                'https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-main.js',
                'https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-vendor.js',
                'https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-chunk-vendors.js',
                'https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-chunk-common.js',
                'https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-runtime.js',
                'https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-app.js'
              ];
              if (typeof Promise === 'undefined') {
                files.unshift('https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-promise-polyfill.js');
              }
              if (typeof Symbol === 'undefined' || typeof Symbol.iterator === 'undefined') {
                files.unshift('https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-iterator-polyfill.js');
              }
              if (typeof Object.entries === 'undefined') {
                files.unshift('https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-entries-polyfill.js');
              }
              if (!window.crypto) {
                window.crypto = window.msCrypto;
              }
              if (typeof Event !== 'function') {
                files.unshift('https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-event-polyfill.js');
              }
              if (!Object.values) {
                files.unshift('https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-object-values-polyfill.js');
              }
              if (typeof Array.prototype.find === 'undefined') {
                files.unshift('https://embed.tawk.to/_s/v4/app/685389b9a70/js/twk-arr-find-polyfill.js');
              }
              var s0 = document.getElementsByTagName('script')[0];
              for (var i = 0; i < files.length; i++) {
                var s1 = document.createElement('script');
                s1.src = files[i];
                s1.charset = 'UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1, s0);
              }
            }
            if (document.readyState === 'complete') {
              l();
            } else if (w.attachEvent) {
              w.attachEvent('onload', l);
            } else {
              w.addEventListener('load', l, false);
            }
          })(window);
        })(window);
      `,
    }}
  />
)}

      </body>
    </html>
  );
}
