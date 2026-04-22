import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { PlayCircle, Clock, Calendar } from 'lucide-react';
import LazyImage from '@/components/LazyImage.jsx';

const DeliveryDemonstrations = () => {
  const [demos, setDemonstrations] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const { data, error } = await supabase
          .from('delivery_demonstrations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setDemonstrations(data);
          setActiveVideo(data[0]);
        }
      } catch (error) {
        console.error('Error fetching delivery demonstrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemos();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-[#0A1128] text-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Global <span className="text-[#D4AF37]">Delivery</span> Excellence
          </h2>
          <p className="text-lg text-slate-300 font-montserrat leading-relaxed font-light">
            Watch our seamless end-to-door transportation process. From European quarantine to first-class flights and climate-controlled domestic transport, your Titan's safety is our priority.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="aspect-video w-full bg-white/5 rounded-2xl mb-8 border border-white/10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-video bg-white/5 rounded-xl border border-white/10"></div>
              ))}
            </div>
          </div>
        ) : (
          demos.length > 0 && (
            <div className="flex flex-col gap-12">
              {/* Main Video Player */}
              <div className="bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-4 md:p-6 lg:p-8">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black mb-6 border border-white/5 shadow-inner">
                  {activeVideo && (
                    <iframe
                      src={activeVideo.video_url}
                      title={activeVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                
                {activeVideo && (
                  <div className="max-w-4xl">
                    <h3 className="text-3xl font-playfair font-bold text-white mb-3">{activeVideo.title}</h3>
                    <div className="flex items-center gap-6 mb-4 text-sm font-montserrat text-[#D4AF37]">
                      {activeVideo.duration && (
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {activeVideo.duration}</span>
                      )}
                      {activeVideo.date && (
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(activeVideo.date).toLocaleDateString()}</span>
                      )}
                    </div>
                    <p className="text-slate-300 font-montserrat font-light text-lg leading-relaxed">
                      {activeVideo.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnails Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => setActiveVideo(demo)}
                    className={`group relative rounded-xl overflow-hidden aspect-video border-2 transition-all duration-300 text-left ${
                      activeVideo?.id === demo.id 
                        ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                        : 'border-white/10 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <LazyImage 
                      src={demo.thumbnail_url || 'https://images.unsplash.com/photo-1598974357801-bca105b4ee68?q=80&w=600&auto=format&fit=crop'} 
                      alt={demo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#0A1128]/60 group-hover:bg-[#0A1128]/40 transition-colors duration-300"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className={`w-12 h-12 transition-all duration-300 ${
                        activeVideo?.id === demo.id ? 'text-[#D4AF37]' : 'text-white/80 group-hover:text-white group-hover:scale-110'
                      }`} />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <h4 className="font-playfair font-bold text-white text-lg truncate group-hover:text-[#D4AF37] transition-colors">{demo.title}</h4>
                      <p className="text-xs text-slate-300 font-montserrat mt-1 line-clamp-1">{demo.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default DeliveryDemonstrations;