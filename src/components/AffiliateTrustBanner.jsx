import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import AffiliateSlider from './AffiliateSlider';
import { Loader2 } from 'lucide-react';

const AffiliateTrustBanner = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const { data, error } = await supabase
          .from('affiliates')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setAffiliates(data || []);
      } catch (err) {
        console.error('Error fetching affiliates:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16 bg-slate-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error || affiliates.length === 0) {
    return null; // Silently fail or hide if no data
  }

  return (
    <section className="w-full py-16 md:py-24 bg-slate-50 border-y border-slate-200 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
            Our Global Network: Trusted Affiliates & Partners
          </h2>
          <p className="text-lg text-slate-600">
            Collaborating with legitimate industry leaders to ensure the highest standards of KFPS excellence.
          </p>
        </div>
        
        <AffiliateSlider affiliates={affiliates} />
      </div>
    </section>
  );
};

export default AffiliateTrustBanner;