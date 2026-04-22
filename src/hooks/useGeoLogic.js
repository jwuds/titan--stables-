import { useState, useEffect } from 'react';

export function useGeoLogic() {
  const [region, setRegion] = useState('International');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setRegion('International');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Simple bounding box logic for demo purposes
        // Virginia approx: lat 36.5 to 39.5, lon -83.7 to -75.2
        if (latitude >= 36.5 && latitude <= 39.5 && longitude >= -83.7 && longitude <= -75.2) {
          setRegion('Virginia');
        } 
        // USA approx: lat 24 to 49, lon -125 to -66
        else if (latitude >= 24 && latitude <= 49 && longitude >= -125 && longitude <= -66) {
          setRegion('USA');
        }
        // Europe approx: lat 35 to 70, lon -10 to 40
        else if (latitude >= 35 && latitude <= 70 && longitude >= -10 && longitude <= 40) {
          setRegion('Europe');
        } else {
          setRegion('International');
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setError(err.message);
        setRegion('International');
        setLoading(false);
      },
      { timeout: 5000 }
    );
  }, []);

  const overrideRegion = (newRegion) => {
    setRegion(newRegion);
  };

  return { region, overrideRegion, loading, error };
}