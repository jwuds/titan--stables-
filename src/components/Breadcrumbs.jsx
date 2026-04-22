import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { generateBreadcrumbSchema } from '@/lib/schema';

const Breadcrumbs = ({ items }) => {
  const location = useLocation();
  
  // Default home breadcrumb
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    ...(items || [])
  ];

  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200 py-3 px-4 md:px-8">
       {/* Schema.org Structured Data */}
       <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbItems))}
        </script>
      </Helmet>

      <ol className="flex flex-wrap items-center space-x-2 text-sm text-slate-500 container mx-auto">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />}
              {isLast ? (
                <span className="font-semibold text-primary" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.path} 
                  className="hover:text-primary transition-colors flex items-center"
                >
                  {index === 0 && <Home className="w-4 h-4 mr-1" />}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;