import React from 'react';
import { Helmet } from 'react-helmet';

const AuthorBio = ({ author }) => {
  if (!author) return null;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "jobTitle": author.title,
    "description": author.bio,
    "image": author.image,
    "url": author.website,
    "sameAs": author.social?.map(s => s.url) || []
  };

  return (
    <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 my-8 shadow-sm">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {author.image && (
          <img 
            src={author.image} 
            alt={author.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
          />
        )}
        
        <div className="flex-1">
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">{author.name}</h3>
          <p className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wide mb-3">
            {author.title} • {author.yearsExperience} Years Experience
          </p>
          
          <p className="text-slate-600 mb-4 leading-relaxed">{author.bio}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {author.expertise?.map((exp, idx) => (
              <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                {exp}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
             {author.social?.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary transition-colors text-sm font-medium"
                >
                  {link.platform}
                </a>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;