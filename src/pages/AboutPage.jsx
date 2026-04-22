import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import LazyImage from '@/components/LazyImage';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { safeQuery } from '@/lib/supabaseErrorHandler';

const AboutPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const query = supabase
          .from('about_content')
          .select('*')
          .order('created_at');

        const { data, error: queryError } = await safeQuery(query, []);

        if (queryError) {
          console.error('Error fetching about content:', queryError);
          setError('Failed to load content. Please try again later.');
        }

        setSections(data || []);
      } catch (err) {
        console.error('Unexpected error fetching about content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  const formatSectionName = (sectionName) => {
    const nameMap = {
      'heritage_mission': 'Our Heritage & Mission',
      'welfare_standards': 'Uncompromising Welfare Standards',
      'global_logistics': 'Global Logistics & Importation'
    };
    return nameMap[sectionName] || sectionName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Oops! Something went wrong</h2>
          <p className="text-white text-lg mb-6">{error}</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#B8860B] transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>About Titan Stables - Legacy of Excellence in Friesian Breeding</title>
        <meta 
          name="description" 
          content="Discover Titan Stables' heritage in Friesian horse breeding, our commitment to welfare standards, and our global logistics expertise. A legacy of excellence since inception." 
        />
        <meta property="og:title" content="About Titan Stables - Legacy of Excellence" />
        <meta property="og:description" content="Learn about our mission, welfare standards, and global reach in Friesian horse breeding and distribution." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&h=630&fit=crop" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://titanstables.com/about" />
      </Helmet>

      <div className="bg-black min-h-screen">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
          <LazyImage
            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1920&h=1080&fit=crop&q=80"
            alt="Majestic Friesian horses at Titan Stables"
            className="absolute inset-0 w-full h-full object-cover"
            priority={true}
          />
          <div className="relative z-20 text-center px-4">
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 font-playfair"
            >
              About <span className="text-[#D4AF37]">Titan Stables</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-montserrat"
            >
              A Legacy of Excellence in Friesian Breeding
            </motion.p>
          </div>
        </motion.section>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          {sections.length === 0 ? (
            <div className="text-center text-white/70 py-20">
              <p className="text-xl">Content is being updated. Please check back soon.</p>
            </div>
          ) : (
            sections.map((section, index) => {
              const isEven = index % 2 === 1;
              const isImageLeft = isEven;

              return (
                <React.Fragment key={section.id}>
                  <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-20"
                  >
                    <div className={`grid md:grid-cols-2 gap-12 items-center ${isImageLeft ? 'md:flex-row-reverse' : ''}`}>
                      {/* Text Content */}
                      <div className={`space-y-6 ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#D4AF37] font-playfair">
                          {formatSectionName(section.section_name)}
                        </h2>
                        <p className="text-white text-lg md:text-xl leading-relaxed font-montserrat" style={{ lineHeight: '1.8' }}>
                          {section.text_content}
                        </p>
                      </div>

                      {/* Image */}
                      <div className={`${isImageLeft ? 'md:order-1' : 'md:order-2'}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          className="relative overflow-hidden rounded-2xl shadow-2xl"
                        >
                          <LazyImage
                            src={section.image_url}
                            alt={formatSectionName(section.section_name)}
                            className="w-full h-[400px] md:h-[500px] object-cover"
                            wrapperClassName="relative overflow-hidden rounded-2xl"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Section Divider */}
                  {index < sections.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-20"
                    />
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-3xl p-12 border border-[#D4AF37]/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-playfair">
              Ready to Find Your Perfect <span className="text-[#D4AF37]">Friesian?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 font-montserrat">
              Explore our collection of world-class horses and discover the Titan difference
            </p>
            <Link
              to="/store"
              className="inline-flex items-center gap-3 bg-[#D4AF37] text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-[#B8860B] transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
            >
              Explore Our Horses
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default AboutPage;