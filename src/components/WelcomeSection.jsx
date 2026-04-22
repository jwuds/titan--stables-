import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editable from '@/components/Editable';

const WelcomeSection = () => {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1682896547367-484bbad90765?q=80&w=2000&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <div className="mb-4">
             <Editable
              name="welcome_pretitle"
              defaultValue="ESTABLISHED 2004"
              className="text-primary font-bold tracking-[0.2em] text-sm md:text-base uppercase"
            />
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-xl">
            <Editable
              name="welcome_title"
              defaultValue="Experience the Majesty of Friesian Heritage"
              type="textarea"
              className="bg-transparent border-none text-white placeholder:text-white/50 w-full"
            />
          </h2>
          
          <div className="text-lg md:text-2xl text-slate-200 font-light leading-relaxed mb-10 max-w-2xl drop-shadow-md">
            <Editable
              name="welcome_description"
              defaultValue="Titan Stables serves as the premier destination for exceptional Friesian and sport horses. We connect discerning riders with partners of unparalleled elegance, spirit, and capability."
              type="textarea"
              className="bg-transparent border-none text-slate-200 w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/horses">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Editable name="welcome_cta_primary" defaultValue="Explore Our Horses" />
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-slate-900 rounded-full px-8 py-6 text-lg backdrop-blur-sm transition-all hover:scale-105">
                <Editable name="welcome_cta_secondary" defaultValue="Our Story" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
      </motion.div>
    </section>
  );
};

export default WelcomeSection;