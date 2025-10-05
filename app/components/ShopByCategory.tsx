// components/TopCategorySection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Edible Gummies',
    image: '/assets/edibles.png',
    slug: 'edibles-gummies',
  },
  {
    name: 'Disposable Vapes',
    image: '/assets/vape.png',
    slug: 'disposables-vapes',
  },
  {
    name: 'Premium Flower',
    image: '/assets/flowers.png',
    slug: 'flower',
  },
  {
    name: 'Concentrates',
    image: '/assets/concentrate.png',
    slug: 'moon-rock',
  },
];

export default function TopCategorySection() {
  return (
    <section className=" px-4  from-green-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with Divider Lines */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-8 w-full">
            <div className="flex-1 h-px bg-gray-200 "></div>
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 whitespace-nowrap ">
              Top Category
            </h2>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <p className="text-base md:text-lg text-gray-700 mb-2">
            Our Product Range: Edibles, Vapes, Flower, Concentrates
          </p>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
            At <span className="font-semibold">16Zips</span>, we offer a carefully curated selection of premium, lab-tested cannabis products.
          </p>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Here's a quick look at what we provide:
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                aria-label={`Browse ${cat.name} products`}
              >
                <div className="relative w-full aspect-[4/3] md:aspect-[3/2]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}