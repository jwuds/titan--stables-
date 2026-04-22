
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { supabase } from '@/lib/customSupabaseClient';
import { safeQuery } from '@/lib/supabaseErrorHandler';
import { ChevronLeft, ChevronRight, Calendar, User, Home, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const MatchSkeleton = () => (
  <div className="relative w-full h-[600px] bg-slate-900 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-4">
      <div className="h-8 bg-slate-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-700 rounded w-1/2 mb-6" />
      <div className="h-20 bg-slate-700 rounded w-full" />
    </div>
  </div>
);

const ErrorDisplay = ({ onRetry }) => (
  <div className="relative w-full h-[600px] bg-slate-950 flex items-center justify-center">
    <div className="text-center max-w-md px-4">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Failed to Load Success Stories</h3>
      <p className="text-slate-400 mb-6">We couldn't load our recent matches. Please try again.</p>
      <button 
        onClick={onRetry}
        className="bg-[#D4AF37] text-black px-8 py-3 rounded-full font-bold hover:bg-[#B8860B] transition-all duration-300"
      >
        Retry
      </button>
    </div>
  </div>
);

const RecentMatchesCarousel = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    setError(false);
    
    try {
      const query = supabase
        .from('recent_matches')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('match_date', { ascending: false });

      const { data, error: queryError } = await safeQuery(query, []);

      if (queryError) {
        console.error('Error fetching recent matches:', queryError);
        throw queryError;
      }

      if (data && data.length > 0) {
        setMatches(data);
      } else {
        setMatches([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching matches:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-black py-0">
        <MatchSkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-black py-0">
        <ErrorDisplay onRetry={fetchMatches} />
      </section>
    );
  }

  if (matches.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={matches.length > 1}
        className="w-full h-[600px] md:h-[700px]"
      >
        {matches.map((match) => (
          <SwiperSlide key={match.id}>
            <div className="relative w-full h-full">
              <div className="absolute inset-0">
                <img 
                  src={match.image_url || 'https://images.unsplash.com/photo-1598556776374-0c9f8f060955?q=80&w=2000'} 
                  alt={`${match.horse_name} - ${match.new_owner_name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16"
              >
                <div className="max-w-4xl">
                  <div className="inline-block bg-[#D4AF37]/20 border border-[#D4AF37] px-4 py-2 rounded-full mb-4">
                    <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider">Recent Success Story</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 leading-tight">
                    {match.horse_name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-montserrat font-medium">{match.new_owner_name}</span>
                    </div>
                    {match.location && (
                      <div className="flex items-center gap-2">
                        <Home className="w-5 h-5 text-[#D4AF37]" />
                        <span className="font-montserrat font-medium">{match.location}</span>
                      </div>
                    )}
                    {match.match_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#D4AF37]" />
                        <span className="font-montserrat font-medium">{formatDate(match.match_date)}</span>
                      </div>
                    )}
                  </div>

                  {match.story_description && (
                    <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-montserrat font-light max-w-3xl">
                      {match.story_description}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}

        {matches.length > 1 && (
          <>
            <button className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group">
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </button>
            <button className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group">
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>
            <div className="swiper-pagination-custom absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10" />
          </>
        )}
      </Swiper>

      <style>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background-color: rgba(255, 255, 255, 0.3);
          border: 2px solid #D4AF37;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          background-color: #D4AF37;
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
};

export default RecentMatchesCarousel;
