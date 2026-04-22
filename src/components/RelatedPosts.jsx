import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent } from '@/components/ui/card';

const RelatedPosts = ({ currentPostId, category, tags }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        let query = supabase.from('blog_posts').select('*').eq('status', 'published').neq('id', currentPostId);
        
        if (category) {
          query = query.eq('category', category);
        }

        const { data } = await query.limit(3);
        if (data) setRelated(data);
      } catch (err) {
        console.error('Error fetching related posts:', err);
      }
    };

    if (currentPostId) fetchRelated();
  }, [currentPostId, category, tags]);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map(post => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group border-slate-100">
              <div className="h-48 overflow-hidden bg-slate-100">
                {(post.featured_image || post.image_url) && (
                  <img 
                    src={post.featured_image || post.image_url} 
                    alt={post.featured_image_alt || post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{post.category}</div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">{post.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;