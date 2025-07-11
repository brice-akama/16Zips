"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Typewriter } from "react-simple-typewriter";


const HeroImage = () => {
  const slides = [
    {
      image: "/assets/cannabis.png",
      title: "Where Quality Takes Root.",
      subtitle:
        "Explore our expertly cultivated cannabis grown under precision lighting for peak potency.",
    },
    {
      image: "/assets/hero1.jpg",
      title: "Relax Recharge Reconnect.",
      subtitle:
        "Unwind with handpicked edibles and potent concentrates made for mindful moments.",
    },
    {
      image: "/assets/images.png",
      title: "Elevated Living Starts Here.",
      subtitle:
        "Discover premium cannabis curated to complement your lifestyle and wellness journey.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const { title, subtitle, image } = slides[currentIndex];

  return (
    <div className="relative w-full h-[500px] sm:h-[500px] md:h-[600px] lg:h-[650px] xl:h-[750px] overflow-hidden">
      <Image
        src={image}
        alt={`Hero image ${currentIndex + 1}`}
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="transition-all duration-1000"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      {/* Text content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-4 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold break-words mb-4">
          <Typewriter
            key={`title-${currentIndex}`} // forces re-mount on index change
            words={[title]}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </h1>
        <p className="text-base sm:text-lg md:text-xl break-words">
          <Typewriter
            key={`subtitle-${currentIndex}`} // also force re-mount
            words={[subtitle]}
            cursor={false}
            typeSpeed={35}
            deleteSpeed={0}
            delaySpeed={1500}
          />
        </p>
        

      </div>
    </div>
  );
};

export default HeroImage;
