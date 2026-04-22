import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import BlogPostCard from '@/components/BlogPostCard';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import { Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { safeQuery } from '@/lib/supabaseErrorHandler';

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'friesian-care', 'importation', 'breeding', 'regional', 'success-story'];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const query = supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        const { data, error } = await safeQuery(query, []);

        if (error) {
          console.error('Error fetching blog posts:', error);
        }
        
        setPosts(data || []);
      } catch (err) {
        console.error('Unexpected error fetching blog posts:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.length > 0 ? filteredPosts.slice(1) : [];

  const formatCategory = (cat) => {
    if (cat === 'all') return 'All Categories';
    return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <>
      <SEO 
        title="Journal & Blog | Titan Stables"
        description="Read the latest insights on Friesian horse care, breeding, and international importation from Titan Stables experts."
        url="/blog"
      />
      
      <PageHeader 
        title="Journal & Blog"
        subtitle="Insights on Friesian care, breeding, and international importation"
        images={['https://images.unsplash.com/photo-1598556776374-0c9f8f060955']}
      />

      <div className="bg-slate-50 min-h-screen py-16">
        <div className="container mx-auto px-4">
          
          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
               {categories.map(cat => (
                 <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="rounded-full"
                 >
                    {formatCategory(cat)}
                 </Button>
               ))}
            </div>
            
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Search articles..." 
                className="pl-10 rounded-full bg-slate-100 border-transparent focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500 flex flex-col items-center">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
              <p>Loading articles...</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && selectedCategory === 'all' && !searchQuery && (
                <div className="mb-16">
                  <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                     <span className="w-8 h-1 bg-[#D4AF37] inline-block"></span> Featured Article
                  </h2>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row group">
                     <div className="md:w-1/2 relative overflow-hidden">
                        <img src={featuredPost.featured_image_url || 'https://placehold.co/600x400'} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 min-h-[300px]" />
                     </div>
                     <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <span className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs mb-4 block">
                           {formatCategory(featuredPost.category || 'general')}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 hover:text-primary transition-colors">
                           <a href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</a>
                        </h3>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                          {featuredPost.excerpt || 'Read this featured article to learn more...'}
                        </p>
                        <Button className="w-max rounded-full bg-primary hover:bg-slate-800 px-8" asChild>
                           <a href={`/blog/${featuredPost.slug}`}>Read More</a>
                        </Button>
                     </div>
                  </div>
                </div>
              )}

              {/* Post Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>

              {filteredPosts.length === 0 && (
                 <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                    <p className="text-xl text-slate-500 font-heading">No articles found matching your criteria.</p>
                 </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default BlogListPage;