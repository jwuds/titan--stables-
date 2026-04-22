
import React, { useEffect, useState } from 'react';
import { useBlogArticles } from '@/hooks/useBlogArticles';
import BlogPostCard from '@/components/BlogPostCard';
import SEO from '@/components/SEO';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * BlogPage Component
 * 
 * DEFENSIVE PROGRAMMING IMPLEMENTATION:
 * - Validates articles array before rendering
 * - Filters out invalid articles
 * - Provides fallback UI for empty/error states
 * - Never crashes on undefined data
 * - Handles loading and error states gracefully
 */

export default function BlogPage({ category: initialCategory = null }) {
  const { fetchArticles, loading, error } = useBlogArticles();
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState(initialCategory || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const filters = { 
          status: 'published', 
          sort: 'newest',
        };
        
        if (filter !== 'all') {
          filters.category = filter;
        }

        const result = await fetchArticles(filters);
        
        // DEFENSIVE CHECK #1: Validate result structure
        if (!result || typeof result !== 'object') {
          console.error('BlogPage: Invalid result from fetchArticles', result);
          setArticles([]);
          return;
        }

        // DEFENSIVE CHECK #2: Validate articles is an array
        if (!Array.isArray(result.articles)) {
          console.error('BlogPage: result.articles is not an array', result.articles);
          setArticles([]);
          return;
        }

        // DEFENSIVE CHECK #3: Filter out any invalid articles
        const validArticles = result.articles.filter(article => {
          if (!article) return false;
          if (!article.title || !article.slug) {
            console.warn('BlogPage: Filtering out invalid article', article);
            return false;
          }
          return true;
        });

        setArticles(validArticles);
      } catch (err) {
        console.error('BlogPage: Error loading articles', err);
        setArticles([]);
      }
    };
    
    loadArticles();
  }, [fetchArticles, filter]);

  const categories = [
    { value: 'all', label: 'All Articles' },
    { value: 'care', label: 'Horse Care' },
    { value: 'training', label: 'Training' },
    { value: 'breeding', label: 'Breeding' },
    { value: 'importation', label: 'Importation' },
    { value: 'regional', label: 'Regional Guides' },
  ];

  // DEFENSIVE CHECK #4: Safely filter articles by search term
  const filteredArticles = (Array.isArray(articles) ? articles : []).filter(article => {
    if (!article) return false;
    
    const title = article.title || '';
    const excerpt = article.excerpt || '';
    const searchLower = (searchTerm || '').toLowerCase();
    
    return title.toLowerCase().includes(searchLower) ||
           excerpt.toLowerCase().includes(searchLower);
  });

  const featured = filteredArticles.filter(a => a && a.featured);
  const regular = filteredArticles.filter(a => a && !a.featured);

  return (
    <>
      <SEO 
        title="Blog - Titan Stables | Equestrian Insights & Expert Advice" 
        description="Latest news, expert guides, and insights about Friesian horses, training, care, and breeding from Titan Stables." 
        url="/blog" 
      />
      
      <div className="bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-heading font-bold mb-4"
            >
              Equestrian Insights & Expertise
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto"
            >
              Expert knowledge, news, and comprehensive guides for horse enthusiasts and owners.
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Filters and Search */}
          <div className="mb-12 space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    filter === cat.value
                      ? 'bg-[#D4AF37] text-black shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
                <p className="text-slate-600">Loading articles...</p>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="articles-error flex items-center justify-center py-20">
              <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Articles</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : !Array.isArray(filteredArticles) || filteredArticles.length === 0 ? (
            /* Empty State */
            <div className="articles-empty text-center py-20">
              <div className="bg-white rounded-xl border border-slate-200 p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Found</h3>
                <p className="text-slate-600">
                  {searchTerm 
                    ? 'No articles match your search criteria. Try different keywords.' 
                    : 'No articles have been published yet. Check back soon!'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-[#D4AF37] hover:text-[#B8860B] font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Featured Articles */}
              {featured.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-heading font-bold text-slate-900">Featured Articles</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featured.map((article, index) => (
                      <motion.div
                        key={article?.id || `featured-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <BlogPostCard article={article} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Regular Articles */}
              {regular.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: featured.length > 0 ? 0.3 : 0 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-heading font-bold text-slate-900">Latest Posts</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regular.map((article, index) => (
                      <motion.div
                        key={article?.id || `regular-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <BlogPostCard article={article} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
