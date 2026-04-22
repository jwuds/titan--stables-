import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient.js';
import { Camera, Video, FileText, CheckCircle, ShieldCheck, Globe, Activity, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import LazyImage from '@/components/LazyImage.jsx';

const TrustBadge = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center text-center p-4 group">
    <div className="w-12 h-12 rounded-full bg-white/5 border border-[#D4AF37]/30 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
      <Icon className="w-6 h-6 text-slate-300 group-hover:text-[#D4AF37] transition-colors duration-300" />
    </div>
    <span className="text-xs font-montserrat text-slate-300 max-w-[120px]">{text}</span>
  </div>
);

const OwnATitanClickAd = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedHorses = async () => {
      try {
        const { data, error } = await supabase
          .from('horses')
          .select('id, name, status, images, is_featured, featured')
          .or('is_featured.eq.true,featured.eq.true')
          .limit(5);

        if (error) throw error;
        
        // If not enough featured horses, fill with regular ones
        if (!data || data.length < 5) {
          const limit = 5 - (data ? data.length : 0);
          const { data: moreData } = await supabase
            .from('horses')
            .select('id, name, status, images')
            .limit(limit);
            
          setHorses([...(data || []), ...(moreData || [])]);
        } else {
          setHorses(data);
        }
      } catch (error) {
        console.error('Error fetching horses for ad:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHorses();
  }, []);

  return (
    <section className="bg-[#0A1128] py-16 relative overflow-hidden border-y-4 border-[#D4AF37]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-[#0A1128] to-[#0A1128] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 tracking-tight">
            Own a <span className="text-[#D4AF37]">Titan</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-montserrat max-w-2xl mx-auto font-light">
            Exclusive access to our finest KFPS registered Friesian horses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-80 bg-white/5 rounded-xl animate-pulse border border-white/10"></div>
            ))
          ) : (
            horses.map((horse) => (
              <Link 
                to={`/horses/${horse.id}`} 
                key={horse.id}
                className="group relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent z-10 opacity-80"></div>
                
                <div className="h-64 md:h-72 lg:h-80 w-full overflow-hidden">
                  <LazyImage 
                    src={horse.images?.[0] || 'https://images.unsplash.com/photo-1598974357801-bca105b4ee68?q=80&w=600&auto=format&fit=crop'} 
                    alt={horse.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-montserrat tracking-wider uppercase shadow-lg backdrop-blur-md ${
                    horse.status === 'sold' 
                      ? 'bg-[#8B3A3A]/90 text-white border border-[#8B3A3A]' 
                      : 'bg-[#D4AF37]/90 text-[#0A1128] border border-[#D4AF37]'
                  }`}>
                    {horse.status === 'sold' ? 'Sold' : 'Available'}
                  </span>
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-playfair font-bold text-white mb-2">{horse.name}</h3>
                  
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <div className="flex items-center text-xs text-slate-300 font-montserrat" title="Full Profile">
                      <FileText className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Profile
                    </div>
                    <div className="flex items-center text-xs text-slate-300 font-montserrat" title="Photo Gallery">
                      <Camera className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Photos
                    </div>
                    <div className="flex items-center text-xs text-slate-300 font-montserrat" title="Video Available">
                      <Video className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Video
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="flex justify-center mb-16">
          <Link to="/horses">
            <Button size="lg" className="bg-[#D4AF37] hover:bg-[#b8952b] text-[#0A1128] font-montserrat font-bold text-lg px-10 py-6 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300 uppercase tracking-widest">
              View Horses Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border-t border-white/10 pt-8">
          <TrustBadge icon={ShieldCheck} text="Premium from Trusted Breeders" />
          <TrustBadge icon={Activity} text="Health Tested & Trained" />
          <TrustBadge icon={Globe} text="Worldwide Shipping Available" />
          <TrustBadge icon={Camera} text="Detailed Profiles with Media" />
          <TrustBadge icon={CheckCircle} text="Safe & Secure Purchasing" />
        </div>
      </div>
    </section>
  );
};

export default OwnATitanClickAd;