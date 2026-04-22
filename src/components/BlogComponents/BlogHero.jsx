import React from 'react';

export default function BlogHero({ article }) {
  return (
    <div className="relative w-full h-[50vh] min-h-[400px] flex items-end pb-12 pt-32">
      {article.hero_image_url && (
        <div className="absolute inset-0 z-0">
          <img src={article.hero_image_url} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {article.category && (
             <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
               {article.category}
             </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center text-slate-300 text-sm gap-4">
            <span>Published {new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
            {article.view_count > 0 && <span>• {article.view_count} views</span>}
          </div>
        </div>
      </div>
    </div>
  );
}