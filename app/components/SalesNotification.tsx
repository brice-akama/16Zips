// components/SalesNotification.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Sale = {
  product: string;
  mainImage: string;
  location: string;
  timeAgo: string;
  name: string;
};

const fakeNames = [
  "James", "Amina", "Luis", "Sarah", "Mohamed", "Léa", "Daniel", "Elena", "John", "Sofia",
];

const fakeLocations = [
  "Berlin", "Toronto", "Paris", "Chicago", "Rome", "London", "New York", "Sydney", "Lagos", "Cape Town",
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTimeAgo() {
  const isHours = Math.random() < 0.3;
  if (isHours) {
    const hours = getRandomInt(1, 5);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const minutes = getRandomInt(1, 59);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
}

export default function SalesNotification() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [current, setCurrent] = useState<Sale | null>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchSales = async () => {
      const res = await fetch('/api/fake-sales');
      const data = await res.json();

      const enriched: Sale[] = data.map((item: any) => ({
        ...item,
        name: fakeNames[getRandomInt(0, fakeNames.length - 1)],
        location: fakeLocations[getRandomInt(0, fakeLocations.length - 1)],
        timeAgo: getRandomTimeAgo(),
      }));

      setSales(enriched);
      setCurrent(enriched[0]);
    };
    fetchSales();
  }, []);

  useEffect(() => {
  if (!sales.length) return;

  const showNext = () => {
    setCurrent(sales[index]);
    setVisible(true);

    setTimeout(() => setVisible(false), 5000); // Show popup for 5s

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % sales.length);
    }, getRandomInt(7000, 12000)); // Wait before moving to next
  };

  const interval = setInterval(showNext, 10000);

  // Delay first popup between 8-12 seconds
  const initialDelay = getRandomInt(8000, 12000);
  const timeout = setTimeout(showNext, initialDelay);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}, [sales, index]);


  return (
    <AnimatePresence>
      {visible && current && (
   <motion.div
  key={current.product}
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 30 }}
  transition={{ duration: 0.5 }}
  className="
    fixed z-50
    bottom-6
     
    w-[320px]
    bg-blue-100 shadow-xl rounded-full flex items-center space-x-4 p-4
    border border-blue-200
  "
>

          <img
            src={current.mainImage}
            alt={current.product}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border"
          />

          <div className="text-sm">
            <p className="font-semibold text-gray-800">
              {current.name} in {current.location} just bought
            </p>
            <p className="text-green-600 font-bold">{current.product}</p>
            <p className="text-xs text-gray-500 mt-1">{current.timeAgo}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
