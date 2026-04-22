import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getFeaturedHorses } from '@/data/horses';
import HorseCard from '@/components/HorseCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQueryCache } from '@/hooks/useQueryCache';

const FeaturedHorses = () => {
  const { data: featuredHorses, loading } = useQueryCache(
    'featured_horses_home',
    () => getFeaturedHorses(3),
    { ttl: 10 * 60 * 1000 } // Cache for 10 minutes
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Featured Horses</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Meet some of the exceptional Friesians currently available at Titan Stables, ready to become your next champion or companion.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl h-[450px] w-full border border-slate-100 shadow-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredHorses?.map((horse, i) => (
              <motion.div
                key={horse.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
              >
                <HorseCard horse={horse} />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center"
        >
          <Link to="/horses">
            <Button size="lg" className="group">
              View All Horses <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(FeaturedHorses);