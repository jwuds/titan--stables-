import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import BlogCard from './BlogCard';

export default function RelatedArticles({ category, currentId }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!category) return;
    const fetchRelated = async () => {
      const { data } = await supabase.from('blog_articles')
        .select('*')
        .eq('status', 'published')
        .eq('category', category)
        .neq('id', currentId)
        .limit(3);
      setArticles(data || []);
    };
    fetchRelated();
  }, [category, currentId]);

  if (!articles.length) return null;

  return (
    <div className="mt-16 pt-12 border-t border-slate-200">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(a => <BlogCard key={a.id} article={a} blocks={[]} />)}
      </div>
    </div>
  );
}