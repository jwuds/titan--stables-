
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551782450-17144efb9c50?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-30"></div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
        >
          About Titan Stables
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="font-montserrat text-xl md:text-2xl lg:text-3xl text-[#D4AF37] font-light max-w-3xl mx-auto"
        >
          A Legacy of Excellence in Friesian Breeding and Global Horse Distribution
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="mt-12"
        >
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-8 h-12 border-2 border-[#D4AF37] rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 bg-[#D4AF37] rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
