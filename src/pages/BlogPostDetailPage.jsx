import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import SEO from '@/components/SEO';
import { Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogPostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) throw error;
        setPost(data);

        // Fetch related
        if (data) {
           const { data: relData } = await supabase
             .from('blog_posts')
             .select('id, title, slug, featured_image, category, published_at')
             .eq('category', data.category)
             .neq('id', data.id)
             .limit(3);
           setRelated(relData || []);
        }

      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-xl font-heading">Loading article...</div>;
  if (!post) return <div className="min-h-screen pt-32 text-center text-xl font-heading">Article not found.</div>;

  const formatCategory = (cat) => {
    return cat ? cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Article';
  };

  return (
    <>
      <SEO 
        title={`${post.seo_title || post.title} | Titan Stables Blog`}
        description={post.seo_description || post.excerpt}
        url={`/blog/${post.slug}`}
        image={post.featured_image}
        type="article"
      />

      <article className="bg-slate-50 min-h-screen pb-24">
         {/* Hero Image Section */}
         <div className="relative h-[50vh] md:h-[60vh] w-full">
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full">
               <div className="container mx-auto px-4 pb-12">
                  <Link to="/blog" className="inline-flex items-center text-white/70 hover:text-white mb-6 text-sm font-medium transition-colors">
                     <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
                  </Link>
                  <div className="mb-4">
                     <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {formatCategory(post.category)}
                     </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 max-w-4xl leading-tight">
                     {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                           <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white">{post.author || 'Titan Stables'}</span>
                     </div>
                     <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                     <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 5 Min Read</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="container mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 blog-content-prose">
                  {/* Since content is simple text in seed, rendering directly. In production, use a markdown parser or HTML dangerouslySetInnerHTML safely */}
                  <p className="lead text-xl text-slate-700 font-medium mb-8">{post.excerpt}</p>
                  
                  {/* Mock complex content for visual representation based on seed data text */}
                  <p>{post.content}</p>
                  <p>At Titan Stables, we ensure that every KFPS registered Friesian meets the highest international standards. Whether you are seeking a dressage champion or a loyal companion, understanding the intricacies of the breed is essential.</p>
                  
                  <h2>The Golden Standard of KFPS</h2>
                  <p>The Royal Friesian Studbook (KFPS) maintains rigorous criteria. Only horses that pass stringent health, conformation, and movement evaluations receive their premium predicaats. This ensures the longevity and quality of the breed globally.</p>
                  
                  <blockquote>
                     "A true Friesian is not just distinguished by its black coat, but by its noble character, expressive movement, and powerful baroque silhouette."
                  </blockquote>

                  <p>Our international hubs facilitate the smooth transition of these magnificent animals from the Netherlands to their new homes worldwide.</p>
               </div>

               {/* Share Section */}
               <div className="mt-8 flex items-center gap-4 py-6 border-y border-slate-200">
                  <span className="font-bold font-heading text-lg">Share Article:</span>
                  <div className="flex gap-2">
                     <Button variant="outline" size="icon" className="rounded-full text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/10"><Facebook className="w-4 h-4" /></Button>
                     <Button variant="outline" size="icon" className="rounded-full text-[#1DA1F2] border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/10"><Twitter className="w-4 h-4" /></Button>
                     <Button variant="outline" size="icon" className="rounded-full text-[#0A66C2] border-[#0A66C2]/20 hover:bg-[#0A66C2]/10"><Linkedin className="w-4 h-4" /></Button>
                  </div>
               </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/3 space-y-8">
               {/* Newsletter */}
               <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
                  <h3 className="text-2xl font-heading font-bold mb-4 relative z-10">Join Our Journal</h3>
                  <p className="text-slate-300 mb-6 text-sm relative z-10">Get the latest insights on Friesian breeding, care, and exclusive importation opportunities delivered to your inbox.</p>
                  <form className="space-y-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
                     <input type="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#D4AF37]" required />
                     <Button className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-white font-bold rounded-xl py-6">Subscribe</Button>
                  </form>
               </div>

               {/* Related Posts */}
               {related.length > 0 && (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                     <h3 className="text-2xl font-heading font-bold mb-6 border-b pb-4">Related Articles</h3>
                     <div className="space-y-6">
                        {related.map(rel => (
                           <Link to={`/blog/${rel.slug}`} key={rel.id} className="group flex gap-4 items-start">
                              <img src={rel.featured_image} alt={rel.title} className="w-20 h-20 rounded-lg object-cover group-hover:opacity-80 transition-opacity shrink-0" />
                              <div>
                                 <h4 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">{rel.title}</h4>
                                 <span className="text-xs text-slate-500 mt-2 block">{new Date(rel.published_at).toLocaleDateString()}</span>
                              </div>
                           </Link>
                        ))}
                     </div>
                  </div>
               )}
            </aside>
         </div>
      </article>
    </>
  );
};

export default BlogPostDetailPage;