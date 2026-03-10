import { useState, useEffect } from 'react';

interface AnimatedExerciseProps {
  images: string[];
  intervalMs?: number;
  className?: string;
}

export function AnimatedExercise({ images, intervalMs = 1000, className = '' }: AnimatedExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [images, intervalMs]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative overflow-hidden rounded-lg bg-white/5 border border-white/10 ${className}`}>
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`Exercise frame ${idx + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
