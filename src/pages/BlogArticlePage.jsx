
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient.js';
import BlogHero from '@/components/BlogComponents/BlogHero.jsx';
import QuickFactsTable from '@/components/BlogComponents/QuickFactsTable.jsx';
import RelatedArticles from '@/components/BlogComponents/RelatedArticles.jsx';
import BlockEditor from '@/components/AdminBlogComponents/BlockEditor.jsx';
import SEO from '@/components/SEO.jsx';
import { ArticleSchema } from '@/components/SchemaMarkup.jsx';
import { Loader2, ArrowLeft } from 'lucide-react';
import { getOptimizedBlogImageData } from '@/lib/blogImageOptimization';
import { setupImageErrorHandling } from '@/lib/blogImageErrorHandler';

export default function BlogArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroImgRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data: aData } = await supabase.from('blog_articles').select('*').eq('slug', slug).single();
      if (aData) {
        setArticle(aData);
        // increment view count
        supabase.from('blog_articles').update({ view_count: (aData.view_count || 0) + 1 }).eq('id', aData.id).then();
        const { data: bData } = await supabase.from('blog_blocks').select('*').eq('article_id', aData.id).order('block_order');
        setBlocks(bData || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  // Setup hero image error handling
  useEffect(() => {
    if (heroImgRef.current && article) {
      const imageUrl = article.featured_image_url || article.hero_image_url || article.image_url;
      if (imageUrl) {
        setupImageErrorHandling(heroImgRef.current, imageUrl);
      }
    }
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32 text-center bg-slate-50">
        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-4">Article Not Found</h1>
        <p className="text-slate-600 mb-6">The article you're looking for doesn't exist.</p>
        <Link to="/blog" className="inline-flex items-center text-[#D4AF37] hover:text-[#B8860B] font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
      </div>
    );
  }

  // Get optimized hero image data
  const heroImageData = getOptimizedBlogImageData(
    article.featured_image_url || article.hero_image_url || article.image_url,
    article.title,
    true // isHero
  );

  return (
    <>
      <SEO 
        title={`${article.title} - Titan Stables Blog`} 
        description={article.excerpt || article.meta_description} 
        url={`/blog/${slug}`}
        image={heroImageData.src}
      />
      <ArticleSchema article={article} />
      
      <article className="bg-white min-h-screen">
        {/* Hero Image Section */}
        <div className="relative w-full aspect-[21/9] md:aspect-[21/7] bg-slate-900 overflow-hidden">
          <div className="blog-image-container relative w-full h-full">
            {/* Blur placeholder */}
            <img 
              src={heroImageData.placeholder}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-50"
              aria-hidden="true"
            />
            
            {/* Main hero image */}
            <img 
              ref={heroImgRef}
              src={heroImageData.src}
              srcSet={heroImageData.srcSet}
              sizes={heroImageData.sizes}
              alt={heroImageData.alt}
              loading="eager"
              className="blog-image image-loading absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Article title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="container mx-auto max-w-4xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 drop-shadow-lg">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-lg md:text-xl text-white/90 max-w-3xl drop-shadow-md">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 mt-12 max-w-4xl pb-20">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          
          <QuickFactsTable article={article} blocks={blocks} />
          
          <div className="prose prose-lg max-w-none prose-slate prose-headings:font-heading prose-headings:text-slate-900 prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline">
            {blocks.map(b => (
              <BlockEditor key={b.id} block={b} isEdit={false} />
            ))}
          </div>

          <RelatedArticles category={article.category} currentId={article.id} />
        </div>
      </article>
    </>
  );
}
