import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * Generates an Organization Schema
 * @returns {JSX.Element} Helmet wrapper with schema script
 */
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Titan Stables",
    "url": "https://titanstables.org",
    "logo": "https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/6f8c70d2e367901817b1fc0b00615122.jpg",
    "foundingDate": "2004",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-434-253-5844",
      "contactType": "customer service",
      "areaServed": "Global",
      "availableLanguage": ["English", "Spanish", "French"]
    },
    "sameAs": [
      "https://www.facebook.com/share/1AtuzRi5oB/",
      "https://www.instagram.com/titanstables"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Generates an Article Schema for blog posts
 * @param {Object} props.article - Article data
 * @returns {JSX.Element|null} Helmet wrapper with schema script
 */
export const ArticleSchema = ({ article }) => {
  if (!article) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://titanstables.org/blog/${article.slug}`
    },
    "headline": article.title,
    "description": article.meta_description || article.excerpt,
    "image": article.hero_image_url || article.featured_image_url || "https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/6f8c70d2e367901817b1fc0b00615122.jpg",  
    "author": {
      "@type": "Person",
      "name": article.author || "Titan Stables Expert"
    },  
    "publisher": {
      "@type": "Organization",
      "name": "Titan Stables",
      "logo": {
        "@type": "ImageObject",
        "url": "https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/6f8c70d2e367901817b1fc0b00615122.jpg"
      }
    },
    "datePublished": article.published_at || article.created_at || new Date().toISOString(),
    "dateModified": article.updated_at || new Date().toISOString()
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Generates FAQ Schema
 * @param {Array} props.faqs - Array of FAQ objects with question and answer
 * @returns {JSX.Element|null} Helmet wrapper with schema script
 */
export const FAQSchema = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Generates Breadcrumb Schema
 * @param {Array} props.items - Array of breadcrumb items
 * @returns {JSX.Element|null} Helmet wrapper with schema script
 */
export const BreadcrumbSchema = ({ items }) => {
  if (!items || items.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://titanstables.org${item.path}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Generates Author Schema
 * @param {Object} props.author - Author details
 * @returns {JSX.Element|null} Helmet wrapper with schema script
 */
export const AuthorSchema = ({ author }) => {
  if (!author) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "jobTitle": author.title || "Equestrian Expert",
    "description": author.bio,
    "url": author.website || "https://titanstables.org/about",
    "sameAs": author.social || []
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Generates Product Schema for horses
 * @param {Object} props.horse - Horse details
 * @returns {JSX.Element|null} Helmet wrapper with schema script
 */
export const HorseProductSchema = ({ horse }) => {
  if (!horse) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": horse.name,
    "image": horse.image_url || (horse.images && horse.images[0]) || "",
    "description": horse.description || horse.bio,
    "sku": horse.id,
    "brand": {
      "@type": "Brand",
      "name": "Titan Stables"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://titanstables.org/horses/${horse.id}`,
      "priceCurrency": "USD",
      "price": horse.price || "Contact for price",
      "availability": horse.status === 'sold' ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "12"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Utility function to generate Local Business Schema object.
 * Returns the raw JSON-LD object.
 * @param {Object} location - Location details
 * @returns {Object|null} The schema object
 */
export const generateLocalBusinessSchema = (location) => {
  if (!location) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Titan Stables - ${location.name || location.city || 'Location'}`,
    "image": "https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/6f8c70d2e367901817b1fc0b00615122.jpg",
    "@id": `https://titanstables.org/locations/${location.slug || ''}`,
    "url": `https://titanstables.org/locations/${location.slug || ''}`,
    "telephone": location.phone || "+1-434-253-5844",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.address || "13486 Cedar View Rd",
      "addressLocality": location.city || "Drewryville",
      "addressRegion": location.state || "VA",
      "postalCode": location.zip || "23844",
      "addressCountry": "US"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  };
};

/**
 * Generates Local Business Schema component
 * @param {Object} props.location - Location details
 * @returns {JSX.Element|null} Helmet wrapper with schema script
 */
export const LocalBusinessSchema = ({ location }) => {
  const schema = generateLocalBusinessSchema(location);
  if (!schema) return null;
  
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default {
  OrganizationSchema,
  ArticleSchema,
  FAQSchema,
  BreadcrumbSchema,
  AuthorSchema,
  HorseProductSchema,
  LocalBusinessSchema,
  generateLocalBusinessSchema
};