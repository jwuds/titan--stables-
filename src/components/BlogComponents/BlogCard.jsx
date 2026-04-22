import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { generateReadTime } from '@/lib/horseFactsGenerator';

export default function BlogCard({ article, blocks = [] }) {
  const readTime = generateReadTime(blocks);
  return (
    <Link to={`/blog/${article.slug}`} className="group flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
      <div className="relative h-48 overflow-hidden">
        {article.hero_image_url ? (
          <img src={article.hero_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
        )}
        {article.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-2 py-1 rounded">
            {article.category}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
          <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {readTime} min read</span>
        </div>
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{article.excerpt}</p>
        <span className="text-blue-600 font-medium text-sm inline-flex items-center mt-auto">Read Article →</span>
      </div>
    </Link>
  );
}