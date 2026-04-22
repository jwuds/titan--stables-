import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteSeoConfig } from '@/config/seoConfig.js';

const GeoMetaTags = () => {
  const { geo } = siteSeoConfig;

  return (
    <Helmet>
      <meta name="geo.position" content={`${geo.latitude};${geo.longitude}`} />
      <meta name="geo.region" content={geo.region} />
      <meta name="geo.placename" content={geo.placename} />
      <meta name="ICBM" content={`${geo.latitude}, ${geo.longitude}`} />
    </Helmet>
  );
};

export default GeoMetaTags;