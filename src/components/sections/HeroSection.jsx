import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Parallax, Pagination, Navigation } from 'swiper/modules';
import { Button } from '@/components/ui/button.jsx';
import LazyImage from '@/components/LazyImage.jsx';
import { useImagePreloader } from '@/hooks/useImagePreloader.js';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSection = () => {
  const heroImages = useMemo(() => [
    "https://images.unsplash.com/photo-1613437190836-d59585104264?q=80&w=2000&auto=format&fit=crop", 
    "https://i.postimg.cc/k462kC2x/IMG-20231010-172018-198.webp"
  ], []);

  useImagePreloader(heroImages);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-950">
      <Swiper 
        modules={[Autoplay, EffectFade, Parallax, Pagination, Navigation]} 
        effect="fade" 
        speed={1500} 
        autoplay={{ delay: 6000, disableOnInteraction: false }} 
        parallax={true} 
        pagination={{ clickable: true }} 
        loop={true} 
        className="h-full w-full"
      >
        {heroImages.map((img, idx) => (
          <SwiperSlide key={idx} className="relative h-full w-full">
            <div className="absolute inset-0 bg-slate-900">
              <LazyImage 
                src={img}
                alt="Premium KFPS registered black Friesian stallion"
                priority={idx === 0} 
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full absolute inset-0"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </SwiperSlide>
        ))}
        <div className="absolute inset-0 z-10 flex items-center px-4 md:px-12">
           <div className="max-w-4xl pt-20">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-block bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                    Equestrian Excellence
                </div>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white font-serif tracking-tight drop-shadow-2xl mb-6 md:mb-8 leading-tight">
                  Premium KFPS Friesian Horse<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">Importation & Breeding Services</span>
                </h1>
                <p className="text-xl sm:text-2xl text-slate-200 font-light max-w-2xl mb-6 md:mb-8 lg:mb-12 leading-relaxed">
                   Trusted by international buyers. Discover the elegance of the Baroque horse silhouette, dynamic dressage movement, and the gentle spirit of our KFPS registered Friesian horses. 
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/horses">
                      <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                          Browse Our KFPS Friesians <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                  </Link>
                  <Link to="/contact">
                      <Button variant="outline" size="lg" className="rounded-full px-8 py-7 text-lg border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm">
                          Contact Our Experts
                      </Button>
                  </Link>
                </div>
              </motion.div>
           </div>
        </div>
      </Swiper>
    </section>
  );
};

export default HeroSection;