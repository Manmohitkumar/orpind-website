'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export default function Carousel({ children, autoPlay = true, interval = 5000, showDots = true, showArrows = true, className = '' }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % children.length) + children.length) % children.length);
  }, [children.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (autoPlay && !isPaused && children.length > 1) {
      timerRef.current = setInterval(next, interval);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, isPaused, next, interval, children.length]);

  if (children.length === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className}`} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="relative">
        {children.map((child, i) => (
          <div key={i} className={`transition-all duration-500 ease-out ${i === current ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-8'}`}>
            {child}
          </div>
        ))}
      </div>
      {showArrows && children.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-soft-md flex items-center justify-center text-neutral-700 hover:bg-white hover:shadow-warm-md transition-all z-10" aria-label="Previous slide">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-soft-md flex items-center justify-center text-neutral-700 hover:bg-white hover:shadow-warm-md transition-all z-10" aria-label="Next slide">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      {showDots && children.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {children.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-gold-500 w-6' : 'bg-neutral-300 hover:bg-neutral-400'}`} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
}
