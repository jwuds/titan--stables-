import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSeo } from '@/hooks/useSeo.js';

const SeoHead = ({ pageKey, customTitle, customDescription }) => {
  const seoData = useSeo(pageKey);

  const title = customTitle || seoData.title;
  const description = customDescription || seoData.description;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={seoData.ogTitle || title} />
      <meta property="og:description" content={seoData.ogDescription || description} />
      {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
      <meta property="og:type" content={seoData.ogType} />
      <meta property="og:url" content={seoData.ogUrl} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.ogTitle || title} />
      <meta name="twitter:description" content={seoData.ogDescription || description} />
      {seoData.ogImage && <meta name="twitter:image" content={seoData.ogImage} />}

      {/* Canonical Link */}
      {seoData.canonicalUrl && <link rel="canonical" href={seoData.canonicalUrl} />}
    </Helmet>
  );
};

export default SeoHead;