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
  // European
  "James", "Oliver", "Lucas", "Emma", "Sophie", "Noah", "Liam", "Isabella", "Charlotte", "Léo",
  "Chloé", "Mia", "Hugo", "Oscar", "Elena", "Maximilian", "Nina", "Theo", "Amelie", "Matteo",

  // Latin America
  "Carlos", "Mateo", "Santiago", "Valentina", "Camila", "Fernanda", "Diego", "Lucia", "Andrés", "Julieta",

  // North America
  "Aiden", "Grace", "Logan", "Harper", "Daniel", "Ava", "Benjamin", "Zoe", "Ella", "Michael",

  // Asia
  "Hiroshi", "Yuki", "Sakura", "Jin", "Min", "Sora", "Mei", "Akira", "Takeshi", "Naoko"
];



const fakeLocations = [
  // Europe
  "Berlin", "Paris", "Rome", "London", "Madrid", "Lisbon", "Vienna", "Prague", "Amsterdam", "Brussels",
  "Zurich", "Oslo", "Copenhagen", "Stockholm", "Helsinki", "Athens", "Warsaw", "Budapest", "Dublin", "Munich",

  // Latin America
  "São Paulo", "Buenos Aires", "Lima", "Bogotá", "Santiago", "Mexico City", "Caracas", "Quito", "Montevideo", "La Paz",

  // North America
  "New York", "Los Angeles", "Chicago", "Toronto", "Vancouver", "Miami", "San Francisco", "Boston", "Seattle", "Dallas",

  // Asia
  "Tokyo", "Seoul", "Bangkok", "Singapore", "Hong Kong", "Dubai", "Kuala Lumpur", "Taipei", "Jakarta", "Istanbul",

  // Oceania
  "Sydney", "Melbourne", "Auckland", "Brisbane", "Perth"
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
    w-[320px] md:w-[380px] lg:w-[420px]
    bg-blue-100 shadow-xl rounded-full flex items-center space-x-3 py-1 px-2
    border border-blue-200
  "
>


          <img
  src={current.mainImage}
  alt={current.product}
  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border"
/>


          <div className="text-sm leading-tight">
  <p className="font-medium text-gray-800">
    {current.name} in {current.location} just bought
  </p>
  <p className="text-green-600 font-semibold text-sm">{current.product}</p>
  <p className="text-xs text-gray-500 mt-0.5">{current.timeAgo}</p>
</div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
