'use client';

import Image from 'next/image';
import Link from 'next/link';


const Banner: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[550px] lg:h-[750px] overflow-hidden mt-5">
      {/* Background Image */}
      <Image
        src="/assets/hero3.jpg" // Replace with your image path
        alt="Aquabite Premium Water Solutions"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-opacity-50 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
        Discover the Best Cannabis Products
        </h1>
        <p className="text-lg md:text-xl text-white mt-2 max-w-2xl">
        Explore our premium collection of cannabis strains, edibles, and accessories, handpicked for your perfect experience.
        </p>

        {/* Call-to-Action Button */}
        <Link href="/shop">
          <button className="mt-4 px-6 py-3 bg-red-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-red-600 transition duration-300">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;