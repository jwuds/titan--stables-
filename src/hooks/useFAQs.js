import { useState, useEffect, useCallback } from 'react';
import { faqService } from '@/services/faqService';

export function useFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFAQs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await faqService.getFAQs();
      setFaqs(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  return { faqs, loading, error, refetch: fetchFAQs };
}