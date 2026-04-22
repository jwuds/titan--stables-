
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOptimizedBlogImageData } from '@/lib/blogImageOptimization';
import { setupImageErrorHandling } from '@/lib/blogImageErrorHandler';

/**
 * BlogPostCard Component
 * 
 * DEFENSIVE PROGRAMMING IMPLEMENTATION:
 * - Validates article prop exists before rendering
 * - Uses optional chaining (?.) for all property access
 * - Provides fallback values for all missing properties
 * - Logs warnings for debugging when properties are missing
 * - Never crashes due to undefined data
 * 
 * Required article structure:
 * {
 *   id: string|number,
 *   title: string,
 *   slug: string,
 *   excerpt: string,
 *   featured_image_url: string,
 *   image_url: string,
 *   category: string,
 *   published_at: string (ISO date),
 *   created_at: string (ISO date),
 *   author: string,
 *   view_count: number
 * }
 */

const BlogPostCard = ({ post, article }) => {
  // CRITICAL: ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const imgRef = useRef(null);

  // CRITICAL: Support both 'post' and 'article' prop names for backward compatibility
  const articleData = post || article;

  // Prepare safe article data (do this before any early returns)
  const safeArticle = articleData ? {
    id: articleData?.id || `fallback-${Date.now()}`,
    title: articleData?.title || 'Untitled Article',
    slug: articleData?.slug || '',
    excerpt: articleData?.excerpt || 'No description available for this article.',
    featured_image_url: articleData?.featured_image_url || articleData?.image_url || null,
    image_url: articleData?.image_url || articleData?.featured_image_url || null,
    category: articleData?.category || 'general',
    published_at: articleData?.published_at || articleData?.created_at || new Date().toISOString(),
    created_at: articleData?.created_at || new Date().toISOString(),
    author: articleData?.author || 'Titan Stables',
    view_count: articleData?.view_count || 0,
  } : null;

  // Get optimized image data with safe fallback
  let imageData;
  try {
    imageData = safeArticle ? getOptimizedBlogImageData(
      safeArticle.featured_image_url || safeArticle.image_url,
      safeArticle.title,
      false
    ) : {
      src: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=800',
      srcSet: '',
      sizes: '',
      placeholder: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=20',
      alt: 'Article image',
      loading: 'lazy',
    };
  } catch (error) {
    console.error('BlogPostCard: Error getting optimized image data', error);
    imageData = {
      src: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=800',
      srcSet: '',
      sizes: '',
      placeholder: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=20',
      alt: safeArticle?.title || 'Article image',
      loading: 'lazy',
    };
  }

  // HOOK #1: Setup image error handling - CONDITIONAL LOGIC INSIDE useEffect
  useEffect(() => {
    // Conditional logic is INSIDE the effect, not wrapping it
    if (imgRef.current && imageData?.src && safeArticle) {
      try {
        setupImageErrorHandling(imgRef.current, imageData.src);
      } catch (error) {
        console.warn('BlogPostCard: Error setting up image error handling', error);
      }
    }
  }, [imageData?.src, safeArticle]); // Safe dependencies

  // HOOK #2: Log warnings for missing data - CONDITIONAL LOGIC INSIDE useEffect
  useEffect(() => {
    // All conditional logic is INSIDE the effect
    if (!articleData) {
      console.warn('BlogPostCard: Received undefined or null article data');
      return;
    }

    if (!articleData.title) {
      console.warn(`BlogPostCard: Missing title for article ID ${safeArticle?.id}`);
    }
    if (!articleData.slug) {
      console.warn(`BlogPostCard: Missing slug for article "${safeArticle?.title}" - link will not work`);
    }
    if (!articleData.category) {
      console.warn(`BlogPostCard: Missing category for article "${safeArticle?.title}"`);
    }
    if (!articleData.featured_image_url && !articleData.image_url) {
      console.warn(`BlogPostCard: Missing image URL for article "${safeArticle?.title}"`);
    }
  }, [articleData, safeArticle?.id, safeArticle?.title]); // Proper dependencies

  // NOW we can do conditional rendering AFTER all hooks are declared
  if (!articleData) {
    return (
      <div className="article-unavailable p-6 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-center">
        <p className="text-slate-600 font-medium">Article data unavailable</p>
      </div>
    );
  }

  // Category styling map
  const categoryColors = {
    'friesian-care': 'bg-blue-100 text-blue-800 border-blue-200',
    'importation': 'bg-amber-100 text-amber-800 border-amber-200',
    'breeding': 'bg-green-100 text-green-800 border-green-200',
    'regional': 'bg-purple-100 text-purple-800 border-purple-200',
    'success-story': 'bg-red-100 text-red-800 border-red-200',
    'care': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'training': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'general': 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const badgeClass = categoryColors[safeArticle.category] || categoryColors['general'];

  const formatCategory = (cat) => {
    if (!cat) return 'General';
    try {
      return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } catch (error) {
      console.warn('BlogPostCard: Error formatting category', error);
      return 'General';
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      console.warn('BlogPostCard: Error formatting date', error);
      return 'Recent';
    }
  };

  // DEFENSIVE CHECK #4: Don't render link if slug is missing
  const renderLink = (children, className = '') => {
    if (!safeArticle.slug) {
      return <div className={className}>{children}</div>;
    }
    return (
      <Link to={`/blog/${safeArticle.slug}`} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <article className="blog-card group flex flex-col h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {renderLink(
        <div className="relative aspect-[16/9] overflow-hidden block shrink-0 bg-slate-100">
          <div className="blog-image-container relative w-full h-full">
            {/* Blur placeholder */}
            <img 
              src={imageData.placeholder}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-sm opacity-50"
              aria-hidden="true"
            />
            
            {/* Main image with lazy loading */}
            <img 
              ref={imgRef}
              src={imageData.src}
              srcSet={imageData.srcSet}
              sizes={imageData.sizes}
              alt={imageData.alt}
              loading="lazy"
              className="blog-image image-loading absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
          </div>
          
          <div className="absolute top-4 left-4 z-10">
            <span className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm backdrop-blur-md", badgeClass)}>
              {formatCategory(safeArticle.category)}
            </span>
          </div>
        </div>,
        "relative aspect-[16/9] overflow-hidden block shrink-0 bg-slate-100"
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> 
            {formatDate(safeArticle.published_at || safeArticle.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> 5 Min Read
          </span>
        </div>
        
        {renderLink(
          <h3 className="text-xl font-heading font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
            {safeArticle.title}
          </h3>
        )}
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
          {safeArticle.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {safeArticle.author}
            </span>
          </div>
          
          {safeArticle.slug ? (
            <Link 
              to={`/blog/${safeArticle.slug}`} 
              className="inline-flex items-center text-sm font-bold text-primary hover:text-[#D4AF37] transition-colors"
            >
              Read More <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <span className="text-sm text-slate-400">Link unavailable</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
