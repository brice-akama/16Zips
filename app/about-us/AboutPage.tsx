"use client";

import Image from "next/image";
import React, { useState } from "react";
import BlogPostAbout from "../components/BlogPostAbout";

export default function AboutPage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setEmail(""); // Clear input after success
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="px-4 py-10 space-y-16 mt-20">
      {/* About Us Section */}
      <section className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="w-full h-80 md:h-96 lg:h-[400px] xl:h-[500px] relative">
          <Image
            src="/assets/about.jpeg"
            alt="About 16Zips"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-2xl mt-5 md:mt-20"
          />
        </div>

        <div>
          <div
            role="heading"
            aria-level={1}
            className="text-3xl font-bold text-green-700 mb-4 md:mt-20"
          >
            About 16Zips
          </div>

          <p className="text-gray-600 text-lg">
  At 16Zips, we specialize in premium cannabis products tailored to meet the
  needs of every type of customer. Whether you&apos;re looking for flower, edibles,
  concentrates, or accessories, we&rsquo;ve got it all. Our mission is to provide
  top-quality, discreet, and secure access to cannabis for everyone, regardless
  of location or legality. We value privacy, fast shipping, and customer
  satisfaction above all.
</p>

            <p className="text-gray-600 text-lg">
  Driven by innovation and a deep understanding of the culture, 16Zips doesn&rsquo;t just sell cannabis&mdash;it cultivates community. The company emphasizes transparency and education, empowering customers to make informed decisions through clear labeling, product guides, and expert support. With an eye on lifestyle, 16Zips also integrates fashion and streetwear elements into its branding, creating a modern, relatable image that resonates with the new wave of cannabis consumers. As legalization continues to expand, 16Zips is poised to lead with quality, trust, and style.
</p>

        </div>
      </section>

      {/* Subscribe Section */}
      <section className="p-6 rounded-2xl text-center space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 lg:mt-10">
          Want to receive discounts, promos, special offers, and 10% off your next purchase?
        </h2>
        <p className="text-gray-600">
          Join our newsletter and be the first to hear about exclusive offers, promotions, and more.
        </p>
        <p className="text-gray-600 mt-4 text-sm">
          We respect your privacy and will never share your information. You can unsubscribe at any time.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="px-4 py-2 rounded-xl border border-gray-300 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}               // <== controlled input value
            onChange={(e) => setEmail(e.target.value)} // <== update state on change
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Subscribe
          </button>
        </form>
        <BlogPostAbout />
      </section>
    </div>
  );
}
