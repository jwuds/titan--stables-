import React from 'react';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { ArticleSchema, BreadcrumbSchema, FAQSchema, AuthorSchema } from '@/components/SchemaMarkup';
import RelatedArticlesCluster from '@/components/RelatedArticlesCluster';
import AuthorBio from '@/components/AuthorBio';
import LazyImage from '@/components/LazyImage';

const AIOptimizedBlogTemplate = ({ 
  article, 
  author,
  faqs = [], 
  cluster,
  breadcrumbs = []
}) => {
  if (!article) return null;

  const readingTime = article.content ? Math.ceil(article.content.split(' ').length / 200) : 5;

  return (
    <article className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>{article.meta_title || article.title} | Titan Stables</title>
        <meta name="description" content={article.meta_description || article.excerpt} />
        <meta name="keywords" content={article.focus_keyword || article.tags?.join(', ')} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.hero_image_url || article.featured_image_url} />
        <meta property="og:type" content="article" />
        {article.canonical_url && <link rel="canonical" href={article.canonical_url} />}
      </Helmet>

      <ArticleSchema article={article} />
      <BreadcrumbSchema items={breadcrumbs} />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
      {author && <AuthorSchema author={author} />}

      {/* Hero Section */}
      <header className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center pt-20">
        <div className="absolute inset-0">
          <LazyImage 
            src={article.hero_image_url || article.featured_image_url || "https://images.unsplash.com/photo-1598556776374-0c9f8f060955?q=80&w=2000"} 
            alt={article.title} 
            className="w-full h-full object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center mt-auto pb-10">
          <div className="inline-flex gap-2 mb-4 justify-center flex-wrap">
            {article.category && (
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {article.category}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-foreground/80 font-medium">
            <span className="flex items-center"><User className="w-4 h-4 mr-2" /> {author?.name || article.author || 'Titan Stables'}</span>
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {readingTime} min read</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-4xl pt-8">
        
        {/* TL;DR Section for AI Overviews */}
        {article.tldr && (
          <div className="ai-tldr-box">
            <strong>TL;DR (Quick Answer)</strong>
            <p className="text-foreground/90 m-0 font-medium">{article.tldr}</p>
          </div>
        )}

        {/* Key Facts Table for structured data parsing */}
        {article.key_facts && article.key_facts.length > 0 && (
          <div className="ai-key-facts">
            <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-primary w-5 h-5" /> Key Facts Overview
            </h3>
            <table className="w-full border-collapse">
              <tbody>
                {article.key_facts.map((fact, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-semibold text-foreground/90 w-1/3 align-top">{fact.label}</td>
                    <td className="py-3 text-foreground/80 align-top">{fact.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Main Content */}
        <div 
          className="prose prose-lg prose-slate max-w-none text-foreground/80
            prose-headings:font-serif prose-headings:text-foreground
            prose-a:text-primary prose-a:font-semibold hover:prose-a:text-[#D4AF37]
            prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Executive Summary */}
        {article.summary && (
          <div className="ai-summary-box mt-12">
            <h3 className="text-2xl font-serif font-bold mb-4 text-primary-foreground">Summary & Takeaways</h3>
            <ul className="space-y-3">
              {article.summary.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQ Section (<50 words answers) */}
        {faqs && faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-serif font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6">
                  <h4 className="text-lg font-bold mb-2 text-foreground">{faq.question}</h4>
                  <p className="text-foreground/80 m-0">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sources & References */}
        {article.sources && article.sources.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border text-sm text-foreground/60">
            <h3 className="font-bold text-foreground/80 mb-3">Sources & References:</h3>
            <ol className="list-decimal pl-4 space-y-1">
              {article.sources.map((source, idx) => (
                <li key={idx}>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{source.name}</a>
                  ) : (
                    source.name
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Author Bio */}
        {author && (
          <div className="mt-12">
             <AuthorBio author={author} />
          </div>
        )}

        {/* Topic Cluster linking */}
        {cluster && (
          <RelatedArticlesCluster cluster={cluster} />
        )}
      </div>
    </article>
  );
};

export default AIOptimizedBlogTemplate;