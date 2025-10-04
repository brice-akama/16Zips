import React from 'react';
import dynamic from 'next/dynamic';
import HeroImage from "./components/HeroImage";
import Description from "./components/Description";
import ShopByCategory from './components/ShopByCategory';
import Banner from './components/Banner';
import  BlogPost from './components/BlogPost';
import Head from "next/head";
import { Metadata } from "next";
import CannabisInfoSection from './components/CannabisInfoSection';
import ReviewsSlider from './components/Reviews';

// Dynamically imported components with loading fallback
const FeatureProduct = dynamic(() => import('./components/FeatureProduct'), {
  loading: () => <p>Loading featured products...</p>,
});



const EdibleProducts = dynamic(() => import('./components/EdibleProducts'), {
  loading: () => <p>Loading edible products...</p>,
});

// Metadata for SEO
export const metadata: Metadata = {
  title: "Home - 16Zips",
  description: "Discover premium cannabis products at 16Zips. From flower to edibles and concentrates, we offer top-shelf quality, fast shipping, and a discreet shopping experience.",
  keywords: "cannabis, weed, marijuana, THC, CBD, cannabis flower, cannabis edibles, cannabis concentrates, 16Zips, premium weed, online cannabis store",
  robots: "index, follow",
};

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Head>
        {/* Your structured data scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "16Zips",
              "url": "https://www.16zips.com",
              "description": "Premium cannabis products: flower, edibles, and concentrates. Fast shipping and discreet service.",
              "sameAs": [
                "https://www.instagram.com/16zips",
                "https://www.twitter.com/16zips"
              ]
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "16Zips",
              "url": "https://www.16zips.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.16zips.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </Head>

      {/* Page Content */}
      <HeroImage />
      <Description />
      <ShopByCategory />
      <EdibleProducts />
      <Banner />
      <FeatureProduct />
      
      <CannabisInfoSection />
      <ReviewsSlider />
      <BlogPost />
    </div>
  );
};

export default Home;