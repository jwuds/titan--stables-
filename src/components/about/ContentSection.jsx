
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import ImageOptimizer from './ImageOptimizer';

const ContentSection = ({ sectionName, layout = 'left-text' }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .eq('section_name', sectionName)
          .single();

        if (error) throw error;
        setContent(data);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [sectionName]);

  if (loading) {
    return (
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="flex-1 h-96 bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!content) return null;

  const isLeftText = layout === 'left-text';

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 0.05, x: 0 } : {}}
        transition={{ duration: 2 }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#D4AF37]/10 to-transparent pointer-events-none"
      ></motion.div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className={`flex flex-col ${isLeftText ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center`}>
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isLeftText ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 space-y-6"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '80px' } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-1 bg-[#D4AF37]"
            ></motion.div>

            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {content.section_name === 'heritage_mission' && 'Our Heritage & Mission'}
              {content.section_name === 'welfare_standards' && 'Welfare Standards'}
              {content.section_name === 'global_logistics' && 'Global Logistics Excellence'}
            </h2>

            <p className="font-montserrat text-lg md:text-xl text-gray-300 leading-relaxed">
              {content.text_content}
            </p>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 relative group"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <ImageOptimizer
                  src={content.image_url}
                  alt={`Titan Stables - ${content.section_name}`}
                  className="w-full h-[500px] object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>

              <div className="absolute inset-0 border-2 border-[#D4AF37] rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
