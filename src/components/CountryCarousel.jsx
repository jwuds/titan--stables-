import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Plane, MapPin, Settings } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';

const CountryCarousel = () => {
  const [destinations, setDestinations] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('destinations')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (fetchError) {
          const { error: handledError } = handleSupabaseError(fetchError);
          if (handledError) throw handledError;
      }

      if (data && data.length > 0) {
        setDestinations(data);
      } else {
        setDestinations([]);
      }
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destinations.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % destinations.length);
    }, 6000); // Slightly longer for video
    return () => clearInterval(timer);
  }, [destinations.length]);

  if (loading) {
    return (
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-100 flex items-center justify-center animate-pulse">
        <Globe className="w-12 h-12 text-slate-300" />
      </div>
    );
  }

  // Graceful fallback when no destinations exist
  if (destinations.length === 0) {
      if (user) {
         return (
            <div className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-500">
                <Globe className="w-8 h-8 mb-2 opacity-50" />
                <p className="mb-4 text-sm">No destinations available.</p>
                <Link to="/admin/destinations">
                    <Button size="sm" variant="outline">Add Destinations</Button>
                </Link>
            </div>
         );
      }
      return null;
  }

  const current = destinations[index];
  if (!current) return null;

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 group bg-slate-900">
      <AnimatePresence mode='wait'>
        <motion.div
          key={current.id || index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {current.media_type === 'video' ? (
            <video
              src={current.media_url}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              controls
              playsInline
            />
          ) : (
            <img 
              src={current.media_url || 'https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=2000&auto=format&fit=crop'} 
              alt={current.name || 'Global Destination'} 
              className="w-full h-full object-cover animate-in fade-in duration-1000"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10 pointer-events-none">
        <motion.div
          key={`text-${current.id || index}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2 text-primary font-bold tracking-wider text-sm uppercase">
            <Globe className="w-4 h-4" /> Global Destination
          </div>
          <h3 className="text-4xl font-bold mb-3 flex items-center gap-3">
            {current.name || 'Worldwide Delivery'}
          </h3>
          <p className="text-slate-200 text-lg max-w-md border-l-4 border-primary pl-4">
            {current.description || 'We deliver our magnificent Friesian horses securely around the globe.'}
          </p>
        </motion.div>
      </div>

      {/* Admin Controls */}
      {user && (
        <div className="absolute top-4 right-16 z-50">
          <Link to="/admin/destinations">
            <Button size="sm" variant="secondary" className="gap-2 bg-white/90 hover:bg-white shadow-lg">
              <Settings className="w-4 h-4" /> Manage
            </Button>
          </Link>
        </div>
      )}

      {/* Progress Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-20">
        {destinations.map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-primary' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
      
      <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg pointer-events-none">
        <Plane className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default CountryCarousel;