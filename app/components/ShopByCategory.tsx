'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    name: 'Flower',
    image: '/assets/flower.png',
    slug: 'indica',
  },
  {
    name: ' Edible Gummies',
    image: '/assets/edible.png',
    slug: 'edibles-gummies',
  },
  {
    name: 'Concentrates',
    image: '/assets/concentrate.png',
    slug: 'budder',
  },
  {
    name: 'Vapes',
    image: '/assets/vape.png',
    slug: 'disposables-vapes',
  },
];

export default function ShopByCategory() {
  return (
    <section className="px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="overflow-hidden rounded-xl shadow-md group"
          >
            <div className="relative w-full h-48">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
           


          </Link>
        ))}
      </div>
    </section>
  );
}
