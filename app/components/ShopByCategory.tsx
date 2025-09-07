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
    name: 'Vapes',
    image: '/assets/vape.png',
    slug: 'disposables-vapes',
  },
  {
    name: 'Flower',
    image: '/assets/flowers.png',
    slug: 'indica',
  },
  {
    name: 'Concentrates',
    image: '/assets/concentrate.png',
    slug: 'budder',
  },
];

export default function ShopByCategory() {
  return (
    <section className="px-4 py-10">
      <div
        role="heading"
        aria-level={2}
        className="text-2xl font-bold text-center mb-10"
      >
        Shop by Category
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="overflow-hidden rounded-xl shadow-md"
          >
            <Link href={`/shop?category=${cat.slug}`}>
              <div className="relative w-full h-48">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300"
                />
              </div>
              
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
