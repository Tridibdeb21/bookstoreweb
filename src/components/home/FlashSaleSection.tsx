import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { BookCard } from './BookCard';
import { Zap, Clock } from 'lucide-react';

export const FlashSaleSection: React.FC = () => {
  const { books } = useStore();

  const flashSaleBooks = books.filter(
    (b) =>
      b.flashSalePrice != null &&
      b.flashSaleExpiry != null &&
      b.flashSaleExpiry > Date.now()
  );

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 18,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    if (flashSaleBooks.length === 0) return;
    const earliestExpiry = Math.min(...flashSaleBooks.map((b) => b.flashSaleExpiry!));

    const interval = setInterval(() => {
      const distance = earliestExpiry - Date.now();
      if (distance <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSaleBooks]);

  if (flashSaleBooks.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 rounded-3xl p-6 sm:p-8 border border-amber-300/40">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Limited-Time Flash Deals
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Grab extraordinary titles before promotional timers expire!
            </p>
          </div>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-2xl shadow-md text-xs font-bold font-mono">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>ENDS IN:</span>
          <span className="text-amber-400 font-black">
            {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {flashSaleBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};
