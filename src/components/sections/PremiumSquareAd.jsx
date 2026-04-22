import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { supabase } from '@/lib/customSupabaseClient.js';
import LazyImage from '@/components/LazyImage.jsx';

const PremiumSquareAd = () => {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    breedStandard: 98
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: totalCount, error: totalError } = await supabase
          .from('horses')
          .select('*', { count: 'exact', head: true });
          
        if (totalError) throw totalError;

        const { count: availableCount, error: availError } = await supabase
          .from('horses')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'available');

        if (availError) throw availError;

        setStats(prev => ({
          ...prev,
          total: totalCount || 0,
          available: availableCount || 0
        }));
      } catch (err) {
        console.error('Error fetching horse stats for Premium Ad:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="section-container bg-[#0A1128] border-y-4 border-[#D4AF37] font-montserrat">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#D4AF37]/10 to-transparent pointer-events-none"></div>
      
      <div className="section-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> 
              Titan Stables Excellence
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold leading-tight">
              The Global Standard in <span className="text-[#D4AF37]">Friesian</span> Breeding
            </h2>
            
            <p className="text-lg text-slate-300 font-light max-w-xl leading-relaxed">
              We meticulously select and train premium KFPS registered Friesians, ensuring exceptional dressage movement, Baroque silhouettes, and perfect temperaments for discerning equestrians worldwide.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center backdrop-blur-sm transform hover:-translate-y-1 transition-transform">
                <p className="text-3xl font-bold text-[#D4AF37] mb-1 font-playfair">
                  {stats.breedStandard}%
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Breed Standard</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center backdrop-blur-sm transform hover:-translate-y-1 transition-transform">
                <p className="text-3xl font-bold text-white mb-1 font-playfair">
                  {loading ? '...' : stats.total}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Global Roster</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center backdrop-blur-sm transform hover:-translate-y-1 transition-transform sm:col-span-1 col-span-2">
                <p className="text-3xl font-bold text-white mb-1 font-playfair">
                  {loading ? '...' : stats.available}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Available Now</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> KFPS Certified
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                <Globe className="w-5 h-5 text-[#D4AF37]" /> Worldwide Export
              </div>
            </div>

            <div className="pt-4">
              <Link to="/horses">
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#b8952b] text-[#0A1128] font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all uppercase tracking-widest group">
                  View Our Horses <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <LazyImage 
              src="https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1000&auto=format&fit=crop"
              alt="Premium KFPS Friesian Horse standing proud"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent opacity-80"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
                <h3 className="text-2xl font-playfair font-bold text-white mb-2">Majestic Presence</h3>
                <p className="text-sm text-slate-300">Experience the unparalleled beauty and gentle nature of our strictly vetted Friesian bloodlines.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumSquareAd;