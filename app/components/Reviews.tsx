'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  { id: 1, name: "Kevin", location: "Brooklyn, NY", rating: 5, text: "16zips is the only place I trust for premium cannabis. Their live resin carts are fire—smooth, potent, and fast shipping!" },
  { id: 2, name: "Danielle", location: "Scottsdale, AZ", rating: 5, text: "From gummies to flower, everything I’ve tried from 16zips is top-shelf. Discreet packaging and lightning-fast delivery!" },
  { id: 3, name: "Marcus", location: "Miami, FL", rating: 5, text: "Outstanding quality across all products—edibles, vapes, and prerolls. Customer service is just as elite. 10/10!" },
  { id: 4, name: "Sarah", location: "Portland, OR", rating: 5, text: "Best online cannabis experience ever. Fresh flower, potent concentrates, and always lab-tested. 16zips never misses!" },
  { id: 5, name: "Jamal", location: "Atlanta, GA", rating: 5, text: "Consistently reliable. Whether it’s shatter, gummies, or vape carts—16zips delivers quality and consistency every time." },
  { id: 6, name: "Lena", location: "Denver, CO", rating: 5, text: "As a daily user, I need quality and speed. 16zips nails both. Their full-spectrum selection is unmatched online." },
  { id: 7, name: "Tyler", location: "Austin, TX", rating: 5, text: "Finally found a legit source for all my cannabis needs. No more sketchy sites—16zips is my one-stop shop." },
  { id: 8, name: "Aisha", location: "Chicago, IL", rating: 5, text: "Discreet, fast, and premium. Their infused pre-rolls and live rosin changed the game for me. Highly recommend 16zips!" },
  { id: 9, name: "Carlos", location: "San Diego, CA", rating: 5, text: "Best flavor and effects I’ve experienced online. From edibles to diamonds—16zips has it all at fair prices." },
  { id: 10, name: "Mia", location: "Seattle, WA", rating: 5, text: "Love the consistency! Every product—from tinctures to moon rocks—performs exactly as promised. No duds, ever." },
  { id: 11, name: "Devin", location: "Nashville, TN", rating: 5, text: "Customer service went above and beyond when I had a question about dosing. Truly care about their customers. Big respect!" },
  { id: 12, name: "Zoe", location: "Philadelphia, PA", rating: 5, text: "Smooth, potent, and delicious across the board. 16zips is my forever source for all things cannabis. Never looking back!" }
];

export default function ReviewsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(2); // ✅ default for desktop
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Handle responsive slides per view
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1); // Mobile: show 1
      } else {
        setItemsPerSlide(2); // Tablet/Desktop: show 2
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);

    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) =>
      prev + itemsPerSlide >= reviews.length ? 0 : prev + itemsPerSlide
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) =>
      prev - itemsPerSlide < 0 ? Math.max(reviews.length - itemsPerSlide, 0) : prev - itemsPerSlide
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // ✅ Auto-slide every 6s (always runs)
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [itemsPerSlide]);

  const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsPerSlide);
  const totalSlides = Math.ceil(reviews.length / itemsPerSlide);
  const currentSlide = Math.floor(currentIndex / itemsPerSlide);

  return (
    <section className="py-5 px-4 from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Happy Clients Are Saying About Us
          </h2>
          <p className="text-lg text-gray-600 mt-6">
            Join thousands of customers who trust <span className="font-semibold text-gray-900">16zips</span> as their
            go-to source for <span className="font-semibold text-gray-900">premium cannabis products</span>—from
            flower and edibles to concentrates and vapes.
          </p>
        </div>

        {/* Reviews Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-indigo-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-indigo-50 disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Reviews Grid */}
          <div className={`grid gap-8 px-4 md:px-16 ${itemsPerSlide === 2 ? "md:grid-cols-2" : "grid-cols-1"}`}>
            {visibleReviews.map((review, idx) => (
              <div
                key={review.id}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform ${
                  isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                  "{review.text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalSlides)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx * itemsPerSlide)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx ? "w-8 h-3 bg-red-700" : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/reviews"
            className="px-8 py-4 border-2 border-red-700 text-red-700 rounded-lg font-semibold hover:bg-red-700 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-block"
          >
            READ MORE
          </Link>
        </div>
      </div>
    </section>
  );
}
