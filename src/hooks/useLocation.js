import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchLocation = async () => {
      try {
        const { data, error: primaryError } = await supabase
          .from('locations')
          .select('*')
          .eq('is_primary', true)
          .limit(1);

        if (primaryError) {
           const { error: handledError } = handleSupabaseError(primaryError);
           if (handledError) throw handledError;
        }

        const primaryLocation = data?.[0];

        // If no primary location found, try to fetch any location
        if (!primaryLocation) {
           const { data: anyLocationData, error: anyError } = await supabase
            .from('locations')
            .select('*')
            .limit(1);
            
            if (anyError) {
                const { error: handledAnyError } = handleSupabaseError(anyError);
                if (handledAnyError) throw handledAnyError;
            }
            
            if (mounted) {
                setLocation(anyLocationData?.[0] || null);
            }
        } else {
            if (mounted) {
                setLocation(primaryLocation);
            }
        }

      } catch (err) {
        if (mounted) {
          console.error('Error fetching location:', err);
          setError(err);
          setLocation(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return { location, loading, error };
};