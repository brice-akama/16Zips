'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
    {
    name: ' Edible Gummies',
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
    sizes="(max-width: 768px) 100vw, 33vw"
    className="object-cover transition-transform duration-300 group-hover:scale-105"
  />
</div>

           


          </Link>
        ))}
      </div>
    </section>
  );
}
