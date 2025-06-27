"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const HeroImage = () => {
  // Array of image objects with text
  const slides = [
    
    
    
    {
      image: "/assets/hero1.jpg",
      title: "Relax, Recharge, Reconnect",
      subtitle: "Explore our curated edibles and concentrates",
    },
    {
      image: "/assets/images.png",
      title: "Crafted for the Curated Experience.",
      subtitle: "Premium cannabis products crafted for your lifestyle.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] sm:h-[500px] md:h-[600px] lg:h-[650px] xl:h-[750px] overflow-hidden">
      <Image
        src={slides[currentIndex].image}
        alt={`Hero image ${currentIndex + 1}`}
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="transition-all duration-1000"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      {/* Text content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold break-words">{slides[currentIndex].title}</h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl break-words">{slides[currentIndex].subtitle}</p>
      </div>
    </div>
  );
};

export default HeroImage;
