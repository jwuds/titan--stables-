import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sliderImages = [
  {
    src: "https://i.postimg.cc/k462kC2x/IMG-20231010-172018-198.webp",
    alt: 'black beast',
  },
  {
    src: 'https://i.postimg.cc/qgfvf69P/IMG-20230914-055517-025.webp',
    alt: 'Close-up of a black Friesian horse looking at the camera',
  },
  {
    src: 'https://i.postimg.cc/G27RRTyr/yeske004-scaled-jpg.webp'
    ,alt: 'Black Friesian horse running freely in a dusty paddock',
  },
  {
    src: 'https://i.postimg.cc/SQL86WMs/Screenshot-20230929-113739.png',
    alt: 'Profile of a noble black Friesian horse against a dark background',
  },
  {
  src: "https://i.postimg.cc/mhxgx1vc/IMG-20230914-055326-211.webp",
  alt: "Friesian horse"
}


];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const HeroSlider = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection) => {
    setPage([(page + newDirection + sliderImages.length) % sliderImages.length, newDirection]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [page]);

  const imageIndex = page;

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={sliderImages[imageIndex].src}
          alt={sliderImages[imageIndex].alt}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {sliderImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > imageIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === imageIndex ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;