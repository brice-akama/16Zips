'use client';

import React from "react";
import Head from "next/head";


const PrivacyPolicy = () => {
  return (
     <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">Privacy Policy</h1>
        
      </div>
    <main className="max-w-4xl mx-auto p-6 ">
      <Head>
        <title>Privacy Policy | 16Zips</title>
        <meta
          name="description"
          content="Read our Privacy Policy to understand how 16Zips handles your data and protects your privacy when purchasing cannabis products."
        />
      </Head>
      


     
      <p className="text-gray-600 mt-4">
        Welcome to 16Zips. Your privacy matters to us. This policy outlines how we collect, use, and protect your personal information when you interact with our cannabis marketplace.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Information We Collect</h2>
        <p className="text-gray-600">
          We collect information you provide when making purchases or creating an account, such as your name, email, shipping address, payment details, and age verification information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> How We Use Your Information</h2>
        <p className="text-gray-600">
          We use your data to fulfill orders, verify legal eligibility, improve your shopping experience, and send order confirmations or promotions (if opted in).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Data Protection</h2>
        <p className="text-gray-600">
          We use secure encryption and trusted payment processors to protect your personal and financial data from unauthorized access or misuse.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Age Restriction & Verification</h2>
        <p className="text-gray-600">
          16Zips strictly serves customers who are of legal age (21+ in most jurisdictions). We require age verification to comply with federal and state cannabis regulations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Legal Compliance</h2>
        <p className="text-gray-600">
          Your information may be used to ensure we operate within the laws of your region. We will cooperate with law enforcement when legally required.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Product Preferences & Browsing Data</h2>
        <p className="text-gray-600">
          To personalize your experience, we collect data on your product views, preferences, and purchase history. This helps us recommend relevant cannabis strains and products.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800"> Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about our privacy practices, reach out to us at{" "}
<a href="mailto:info@16zip.com" className="text-blue-600 hover:underline">
  info@16zip.com
</a>

        </p>
      </section>
    </main>
    </div>
  );
};

export default PrivacyPolicy;
