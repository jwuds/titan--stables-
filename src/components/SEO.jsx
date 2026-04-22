import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { getCanonicalUrl } from '@/lib/canonicalUrl';
import { validatePageCanonicals } from '@/lib/validateCanonicals';

const SEO = ({ 
  pageId, 
  title, 
  description, 
  keywords, 
  image, 
  url, // Optional override
  type = 'website', 
  schema,
  noindex = false,
  status = 200,
  pagination // { currentPage, totalPages }
}) => {
  const location = useLocation();
  const { getContent } = useContent();
  const siteUrl = 'https://titanstables.org';
  
  // Dynamic SEO data from DB (Admin controlled)
  const dynamicTitle = pageId ? getContent(`seo_${pageId}_title`) : null;
  const dynamicDesc = pageId ? getContent(`seo_${pageId}_desc`) : null;
  const dynamicKeywords = pageId ? getContent(`seo_${pageId}_keywords`) : null;
  const dynamicImage = pageId ? getContent(`seo_${pageId}_image`) : null;

  const metaTitle = dynamicTitle || title || 'Titan Stables - Premium Friesian Horses & Boarding Facility';
  const metaDescription = dynamicDesc || description || 'Titan Stables is a premier equestrian facility in Virginia specializing in the breeding, training, and sale of elite Friesian horses.';
  const metaKeywords = dynamicKeywords || keywords || 'Friesian horses for sale, horse boarding Virginia, horse training';
  const metaImage = dynamicImage || image || 'https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/6f8c70d2e367901817b1fc0b00615122.jpg';
  
  // Canonical URL Generation
  // Uses the current pathname if 'url' prop is not provided
  const currentPath = url || location.pathname;
  // Always generates the .org URL for metadata tags
  const canonicalUrl = getCanonicalUrl(currentPath, location.search);

  // Noindex Logic for Thin/Archive Pages
  const isArchive = 
    location.pathname.includes('/tag/') || 
    location.pathname.includes('/category/') || 
    location.pathname.includes('/author/') || 
    location.pathname.includes('/archive/');
    
  // Force noindex if prop passed OR if it's an archive page
  const shouldNoIndex = noindex || isArchive || status === 404;

  // Pagination Rel Tags
  const renderPaginationTags = () => {
    if (!pagination) return null;
    
    const { currentPage, totalPages } = pagination;
    const tags = [];
    
    // rel="prev"
    if (currentPage > 1) {
      // Logic assumes query param '?page=' for pagination
      // We construct a clean canonical URL for the previous page
      const prevSearchParams = new URLSearchParams(location.search);
      prevSearchParams.set('page', currentPage - 1);
      const prevUrl = getCanonicalUrl(location.pathname, prevSearchParams.toString());
      tags.push(<link key="prev" rel="prev" href={prevUrl} />);
    }

    // rel="next"
    if (currentPage < totalPages) {
      const nextSearchParams = new URLSearchParams(location.search);
      nextSearchParams.set('page', currentPage + 1);
      const nextUrl = getCanonicalUrl(location.pathname, nextSearchParams.toString());
      tags.push(<link key="next" rel="next" href={nextUrl} />);
    }

    return tags;
  };

  // Run validation on mount (client-side check only)
  useEffect(() => {
    validatePageCanonicals();
  }, [location.pathname]);

  // Fetch Social Media Links for Schema
  let socialLinks = [];
  try {
    const storedLinks = getContent('social_media_links');
    if (storedLinks) {
      socialLinks = typeof storedLinks === 'string' ? JSON.parse(storedLinks) : storedLinks;
    } else {
       socialLinks = [
        { platform: 'Facebook', url: 'https://www.facebook.com/share/1AtuzRi5oB/', active: true },
        { platform: 'Instagram', url: 'https://www.instagram.com/titanstables?igsh=eHF6OGduaTI5Z2Ri', active: true }
      ];
    }
  } catch (e) {
    console.error("SEO: Error parsing social links", e);
  }

  const socialUrls = socialLinks.filter(l => l.active).map(l => l.url);

  const defaultOrgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Titan Stables",
    "url": siteUrl,
    "logo": "https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/6f8c70d2e367901817b1fc0b00615122.jpg",
    "sameAs": socialUrls,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": getContent('contact_mobile') || "+1-515-705-4429",
      "contactType": "sales",
      "areaServed": "Worldwide",
      "availableLanguage": "English"
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Crawler Status Codes */}
      {status === 404 && <meta name="prerender-status-code" content="404" />}
      
      {/* Robots Meta */}
      {shouldNoIndex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="Titan Stables" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Pagination Tags */}
      {renderPaginationTags()}

      {/* Security & Headers */}
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      <script type="application/ld+json">
        {JSON.stringify(defaultOrgSchema)}
      </script>

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;