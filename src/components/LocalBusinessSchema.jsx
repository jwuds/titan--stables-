import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteSeoConfig } from '@/config/seoConfig.js';

const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteSeoConfig.name,
    "description": siteSeoConfig.description,
    "url": siteSeoConfig.domain,
    "telephone": siteSeoConfig.contactInfo.phone,
    "email": siteSeoConfig.contactInfo.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteSeoConfig.address.streetAddress,
      "addressLocality": siteSeoConfig.address.addressLocality,
      "addressRegion": siteSeoConfig.address.addressRegion,
      "postalCode": siteSeoConfig.address.postalCode,
      "addressCountry": siteSeoConfig.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": siteSeoConfig.geo.latitude,
      "longitude": siteSeoConfig.geo.longitude
    },
    "sameAs": siteSeoConfig.socialMedia
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;