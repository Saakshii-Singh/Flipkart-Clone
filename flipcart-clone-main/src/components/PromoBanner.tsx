import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: 'Big Billion Days Sale',
    subtitle: 'Up to 80% off on Electronics, Fashion & more',
    gradient: 'from-blue-600 to-blue-800',
    accent: 'bg-flipkart-yellow text-flipkart-dark',
  },
  {
    id: 2,
    title: 'Fashion Mega Sale',
    subtitle: 'Flat 50-70% off on top brands',
    gradient: 'from-pink-600 to-purple-700',
    accent: 'bg-primary-foreground text-foreground',
  },
  {
    id: 3,
    title: 'Electronics Super Deal',
    subtitle: 'Extra 10% bank discount on all gadgets',
    gradient: 'from-green-600 to-teal-700',
    accent: 'bg-flipkart-yellow text-flipkart-dark',
  },
  {
    id: 4,
    title: 'Home & Furniture Fest',
    subtitle: 'Min 40% off + Free delivery on ₹499+',
    gradient: 'from-orange-500 to-red-600',
    accent: 'bg-primary-foreground text-foreground',
  },
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(c => (c > 0 ? c - 1 : banners.length - 1));
  const next = () => setCurrent(c => (c + 1) % banners.length);

  return (
    <div className="relative overflow-hidden bg-card shadow-sm">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`min-w-full bg-gradient-to-r ${banner.gradient} py-8 sm:py-12 px-6 sm:px-12 flex flex-col items-center justify-center text-center`}
          >
            <span className={`${banner.accent} text-xs sm:text-sm font-bold px-3 py-1 rounded-sm mb-3`}>
              LIMITED OFFER
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-2">{banner.title}</h2>
            <p className="text-sm sm:text-lg text-primary-foreground/80">{banner.subtitle}</p>
          </div>
        ))}
      </div>
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-1.5 shadow-md">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card rounded-full p-1.5 shadow-md">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary-foreground' : 'bg-primary-foreground/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
