
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-3xl pointer-events-none"
      ></motion.div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <Sparkles className="w-12 h-12 text-[#D4AF37]" />
          </div>

          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Ready to Find Your Perfect Companion?
          </h2>

          <p className="font-montserrat text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Explore our exceptional collection of Friesian horses and discover the one that speaks to your heart.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/store"
              className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#B8860B] text-black font-montserrat font-bold text-lg px-10 py-5 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/50"
            >
              Explore Our Horses
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-8"
          >
            <div className="flex justify-center gap-4 text-sm text-gray-400 font-montserrat">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                Premium Bloodlines
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                Global Delivery
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                Expert Support
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
