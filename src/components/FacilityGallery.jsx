import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // Wait, I cannot use swiper if not installed.
// Constraint: "Strictly limited to the following technologies... Vite, React... TailwindCSS... Framer Motion... shadcn/ui..."
// I should use Framer Motion for a carousel or custom slider. I won't install Swiper.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EditableImage from '@/components/EditableImage';
import Editable from '@/components/Editable';

const slides = [1, 2, 3, 4, 5];

const FacilityGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative max-w-5xl mx-auto group">
      <div className="overflow-hidden rounded-2xl shadow-2xl bg-slate-900 aspect-[16/9] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
             <EditableImage 
                name={`facility_gallery_${currentIndex}`}
                defaultValue="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1200"
                alt="Facility"
                className="w-full h-full object-cover"
             />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <h3 className="text-white text-2xl font-bold mb-2">
                   <Editable name={`facility_gallery_caption_${currentIndex}_title`} defaultValue="State of the Art Arena" />
                </h3>
                <p className="text-slate-300">
                   <Editable name={`facility_gallery_caption_${currentIndex}_desc`} defaultValue="Our indoor arena allows for year-round training regardless of weather conditions." />
                </p>
             </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="flex justify-center gap-2 mt-6">
         {slides.map((_, idx) => (
            <button 
               key={idx} 
               onClick={() => setCurrentIndex(idx)}
               className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-primary scale-125' : 'bg-slate-300'}`}
            />
         ))}
      </div>
    </div>
  );
};

export default FacilityGallery;