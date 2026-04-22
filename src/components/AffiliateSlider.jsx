import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ShieldCheck } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const AffiliateSlider = ({ affiliates }) => {
  if (!affiliates || affiliates.length === 0) return null;

  return (
    <div className="w-full relative">
      {/* Mobile/Tablet Carousel */}
      <div className="block lg:hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 }
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-12"
        >
          {affiliates.map((affiliate) => (
            <SwiperSlide key={affiliate.id}>
              <AffiliateCard affiliate={affiliate} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-8">
        {affiliates.map((affiliate) => (
          <AffiliateCard key={affiliate.id} affiliate={affiliate} />
        ))}
      </div>
    </div>
  );
};

const AffiliateCard = ({ affiliate }) => {
  return (
    <a 
      href={affiliate.website_url || '#'} 
      target="_blank" 
      rel="noopener noreferrer sponsored"
      className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-[140px]"
    >
      {affiliate.logo_url ? (
        <img 
          src={affiliate.logo_url} 
          alt={affiliate.name} 
          className="max-h-[80px] max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
          loading="lazy"
        />
      ) : (
        <span className="text-slate-400 font-serif text-lg text-center filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-500">
          {affiliate.name}
        </span>
      )}
      
      {affiliate.is_verified && (
        <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-950 text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
          <ShieldCheck className="w-3 h-3" />
          Verified
        </div>
      )}
    </a>
  );
};

export default AffiliateSlider;