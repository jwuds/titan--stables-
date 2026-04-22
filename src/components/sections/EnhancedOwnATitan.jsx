import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient.js';
import { Camera, Video, FileText, ArrowRight, ShieldCheck, Activity, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import LazyImage from '@/components/LazyImage.jsx';

const TrustBadge = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center text-center p-4 group">
    <div className="w-14 h-14 rounded-full bg-white/5 border border-[#D4AF37]/30 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
      <Icon className="w-7 h-7 text-slate-300 group-hover:text-[#D4AF37] transition-colors duration-300" />
    </div>
    <span className="text-sm font-montserrat text-slate-300 max-w-[140px] font-medium">{text}</span>
  </div>
);

const EnhancedOwnATitan = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedHorses = async () => {
      try {
        const { data, error } = await supabase
          .from('horses')
          .select('id, name, breed, age, bio, status, images, is_featured, featured')
          .or('is_featured.eq.true,featured.eq.true')
          .limit(6);

        if (error) throw error;
        
        if (!data || data.length < 3) {
          const limit = 6 - (data ? data.length : 0);
          const { data: moreData } = await supabase
            .from('horses')
            .select('id, name, breed, age, bio, status, images')
            .limit(limit);
            
          setHorses([...(data || []), ...(moreData || [])]);
        } else {
          setHorses(data);
        }
      } catch (error) {
        console.error('Error fetching horses for Enhanced Ad:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHorses();
  }, []);

  return (
    <section className="section-container bg-[#0A1128] border-y-4 border-[#D4AF37]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-[#0A1128] to-[#0A1128] pointer-events-none"></div>
      
      <div className="section-content">
        <div className="section-header">
          <div className="inline-block bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
            Exclusive Collection
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6 tracking-tight">
            Own a <span className="text-[#D4AF37]">Titan</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-montserrat max-w-3xl mx-auto font-light leading-relaxed">
            Discover our hand-selected showcase of KFPS registered Friesians. Each magnificent horse has been thoroughly vetted for conformation, dressage potential, and exquisite temperament.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-white/10">
                <div className="h-80 bg-white/5 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-8 w-3/4 bg-white/5 animate-pulse rounded"></div>
                  <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded"></div>
                  <div className="h-16 w-full bg-white/5 animate-pulse rounded mt-4"></div>
                  <div className="h-12 w-full bg-white/5 animate-pulse rounded-full mt-4"></div>
                </div>
              </div>
            ))
          ) : (
            horses.map((horse) => (
              <div key={horse.id} className="group flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl hover:shadow-[#D4AF37]/20 hover:-translate-y-2 transition-all duration-500">
                <div className="relative h-80 w-full overflow-hidden">
                  <LazyImage 
                    src={horse.images?.[0] || 'https://images.unsplash.com/photo-1598974357801-bca105b4ee68?q=80&w=800&auto=format&fit=crop'} 
                    alt={horse.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
                  
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold font-montserrat tracking-widest uppercase shadow-lg backdrop-blur-md ${
                      horse.status === 'sold' 
                        ? 'bg-[#8B3A3A]/90 text-white border border-[#8B3A3A]' 
                        : 'bg-[#D4AF37]/90 text-[#0A1128] border border-[#D4AF37]'
                    }`}>
                      {horse.status === 'sold' ? 'Sold' : 'Available'}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                    <div className="bg-black/50 backdrop-blur border border-white/20 p-2 rounded-full text-white" title="Detailed Profile">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="bg-black/50 backdrop-blur border border-white/20 p-2 rounded-full text-white" title="Professional Photos">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="bg-black/50 backdrop-blur border border-white/20 p-2 rounded-full text-white" title="Training Videos">
                      <Video className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{horse.name}</h3>
                  <p className="text-sm font-montserrat text-[#D4AF37] font-semibold uppercase tracking-wider mb-4">
                    {horse.breed || 'KFPS Friesian'} • {horse.age ? `${horse.age} Years` : 'Age TBD'}
                  </p>
                  <p className="text-slate-300 font-montserrat font-light text-sm line-clamp-3 mb-8 flex-grow">
                    {horse.bio || horse.description || 'An exceptional horse with majestic presence, strictly vetted for our premium collection.'}
                  </p>
                  
                  <Link to={`/horses/${horse.id}`} className="mt-auto">
                    <Button variant="outline" className="w-full border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1128] rounded-full py-6 font-montserrat font-semibold tracking-wider transition-all duration-300">
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mb-16">
          <Link to="/horses">
            <Button size="lg" className="bg-[#D4AF37] hover:bg-[#b8952b] text-[#0A1128] font-montserrat font-bold text-lg px-10 py-6 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300 uppercase tracking-widest">
              View All Horses <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 border-t border-white/10 pt-12">
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

export default EnhancedOwnATitan;