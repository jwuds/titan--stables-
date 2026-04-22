import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ChevronRight } from 'lucide-react';

export default function SitemapPage() {
  const location = useLocation();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Home",
        "url": "https://titanstables.org/"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "About",
        "url": "https://titanstables.org/about"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Horse Sales",
        "url": "https://titanstables.org/horses"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Gallery",
        "url": "https://titanstables.org/facility"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Contact",
        "url": "https://titanstables.org/contact"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Blog",
        "url": "https://titanstables.org/blog"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 7,
        "name": "Policies",
        "url": "https://titanstables.org/policies"
      }
    ]
  };

  const sitemapStructure = [
    {
      title: "Home",
      path: "/",
      description: "Titan Stables Homepage",
      children: []
    },
    {
      title: "About",
      path: "/about",
      description: "Learn about Titan Stables and our breeding program",
      children: []
    },
    {
      title: "Horse Sales",
      path: "/horses",
      description: "View our available KFPS Friesian horses",
      children: [
        { title: "Horse Listings", path: "/horses", description: "Browse all available Friesians" },
        { title: "Horse Details (Dynamic)", path: "/horses", description: "View individual horse profiles" },
        { title: "Reservation", path: "/reserve", description: "Reserve a Friesian horse" }
      ]
    },
    {
      title: "Services",
      path: "/services",
      description: "Equestrian business services",
      children: []
    },
    {
      title: "Gallery & Facility",
      path: "/facility",
      description: "View our professional horse farm facility",
      children: []
    },
    {
      title: "Blog",
      path: "/blog",
      description: "Read our Friesian horse care blog",
      children: [
        { title: "Blog Posts", path: "/blog", description: "Browse all articles" },
        { title: "Blog Details (Dynamic)", path: "/blog", description: "Read individual blog posts" }
      ]
    },
    {
      title: "Contact",
      path: "/contact",
      description: "Contact our international buyer support",
      children: []
    },
    {
      title: "Policies",
      path: "/policies",
      description: "Read our business policies and terms",
      children: [
        { title: "Privacy Policy", path: "/policies#privacy", description: "Privacy and data protection policy" },
        { title: "Terms of Service", path: "/policies#terms", description: "Website and service terms" },
        { title: "Shipping Policy", path: "/policies#shipping", description: "International shipping guidelines" }
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Sitemap - Titan Stables"
        description="Complete site map of Titan Stables showing all pages and navigation structure"
        url={location.pathname}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs items={[{ name: 'Sitemap', path: '/sitemap' }]} />
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 mt-8">
            <header className="mb-10 border-b border-slate-100 pb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Site Map</h1>
              <p className="text-lg text-slate-600">
                A complete overview of the Titan Stables website architecture and navigation structure.
              </p>
            </header>

            <div className="space-y-8">
              <ul className="space-y-6">
                {sitemapStructure.map((item, index) => (
                  <li key={index} className="flex flex-col">
                    <div className="flex items-center">
                      <Link 
                        to={item.path}
                        title={item.description}
                        className="text-xl font-serif font-semibold text-slate-900 hover:text-primary transition-colors inline-block"
                      >
                        {item.title}
                      </Link>
                    </div>
                    
                    {item.children && item.children.length > 0 && (
                      <ul className="mt-3 ml-6 border-l-2 border-slate-200 pl-6 space-y-3">
                        {item.children.map((child, childIndex) => (
                          <li key={childIndex} className="flex items-center text-slate-600 relative">
                            <span className="absolute -left-6 top-1/2 w-4 h-[2px] bg-slate-200"></span>
                            <Link 
                              to={child.path}
                              title={child.description}
                              className="text-base hover:text-primary transition-colors flex items-center group"
                            >
                              <ChevronRight className="w-4 h-4 mr-1 text-slate-400 group-hover:text-primary transition-colors" />
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}