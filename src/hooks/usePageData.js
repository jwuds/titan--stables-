import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useHorses(limit = null) {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHorses() {
      try {
        let query = supabase.from('horses').select('*').order('created_at', { ascending: false });
        if (limit) query = query.limit(limit);
        
        const { data, error: err } = await query;
        if (err) throw err;
        setHorses(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHorses();
  }, [limit]);

  return { horses, loading, error };
}

export function useBlogArticles(limit = null) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        let query = supabase.from('blog_articles').select('*').eq('status', 'published').order('published_at', { ascending: false });
        if (limit) query = query.limit(limit);

        const { data, error: err } = await query;
        if (err) throw err;
        setArticles(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [limit]);

  return { articles, loading, error };
}

export function useFeaturedArticles(limit = 3) {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error: err } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('status', 'published')
          .eq('featured', true)
          .order('published_at', { ascending: false })
          .limit(limit);

        if (err) throw err;
        setFeaturedArticles(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, [limit]);

  return { featuredArticles, loading, error };
}

export function useTestimonials(limit = 3) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        // Querying reviews as testimonials
        const { data, error: err } = await supabase
          .from('reviews')
          .select('*, customers(first_name, last_name, country)')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (err) throw err;
        setTestimonials(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, [limit]);

  return { testimonials, loading, error };
}