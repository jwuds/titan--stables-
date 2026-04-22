import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MapPin, Play, Video } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useQueryCache } from '@/hooks/useQueryCache';
import ImageOptimizer from '@/components/ImageOptimizer';

const fetchDestinations = async () => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('display_order', { ascending: true })
    .limit(10);
  if (error) throw error;
  return data || [];
};

const GlobalDestinationsCarousel = () => {
  const { data: destinations, loading } = useQueryCache(
    'global_destinations',
    fetchDestinations,
    { ttl: 30 * 60 * 1000 } // 30 min cache
  );

  if (loading) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center bg-slate-100 animate-pulse rounded-2xl border border-slate-100"></div>
    );
  }

  if (!destinations || destinations.length === 0) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-slate-800 opacity-50 blur-sm"></div>
        <div className="relative z-10 text-center p-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 backdrop-blur-sm">
                <Video className="w-8 h-8 text-slate-500 opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delivery Demonstrations</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm">Videos of our safe transport and global delivery process are coming soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl group border border-white/10 bg-slate-900">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={800}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={destinations.length > 1}
        navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {destinations.map((dest) => (
          <SwiperSlide key={dest.id} className="relative w-full h-full bg-slate-900">
            <div className="absolute inset-0 w-full h-full">
              {dest.media_type === 'video' ? (
                <video
                  src={dest.media_url}
                  autoPlay loop muted playsInline
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <ImageOptimizer
                  src={dest.media_url}
                  alt={dest.name}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-105"
                  wrapperClassName="w-full h-full absolute inset-0"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 pointer-events-none">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-primary text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-lg shadow-primary/20">
                            <MapPin className="w-3 h-3" /> Global Delivery
                        </div>
                        {dest.media_type === 'video' && (
                             <div className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
                                <Play className="w-3 h-3 fill-white" /> Live Route
                             </div>
                        )}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-md">{dest.name}</h3>
                    {dest.description && (
                        <p className="text-base md:text-lg text-slate-200 max-w-lg leading-relaxed shadow-sm drop-shadow-md">
                            {dest.description}
                        </p>
                    )}
                </motion.div>
            </div>
          </SwiperSlide>
        ))}
        
        <div className="swiper-button-prev !text-white !w-10 !h-10 !bg-black/30 !backdrop-blur-sm !rounded-full !hidden md:!flex after:!text-lg hover:!bg-primary hover:!text-slate-900 transition-colors border border-white/10"></div>
        <div className="swiper-button-next !text-white !w-10 !h-10 !bg-black/30 !backdrop-blur-sm !rounded-full !hidden md:!flex after:!text-lg hover:!bg-primary hover:!text-slate-900 transition-colors border border-white/10"></div>
      </Swiper>
    </div>
  );
};

export default React.memo(GlobalDestinationsCarousel);