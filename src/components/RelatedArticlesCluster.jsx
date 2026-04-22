import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

const RelatedArticlesCluster = ({ cluster }) => {
  if (!cluster || !cluster.relatedArticles || cluster.relatedArticles.length === 0) return null;

  return (
    <section className="py-12 border-t border-border mt-16">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider text-sm mb-2">
            <BookOpen className="w-4 h-4" /> Topic Cluster
          </div>
          <h2 className="text-2xl font-serif font-bold text-foreground m-0">
            Explore More in <span className="text-primary">{cluster.name}</span>
          </h2>
        </div>
        
        {cluster.hubUrl && (
          <Link 
            to={cluster.hubUrl}
            className="inline-flex items-center text-sm font-semibold text-primary hover:text-[#D4AF37] transition-colors"
          >
            View Full {cluster.hubTitle} <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cluster.relatedArticles.slice(0, 3).map((article, idx) => (
          <Link 
            key={idx} 
            to={article.url}
            className="group block bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="aspect-video relative overflow-hidden bg-muted">
              <LazyImage 
                src={article.image || "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=800"} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="font-serif font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {article.excerpt || `Read our comprehensive guide on ${article.anchorText} and expand your equestrian knowledge.`}
              </p>
              <span className="text-[#D4AF37] text-sm font-semibold inline-flex items-center">
                Read Article <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticlesCluster;