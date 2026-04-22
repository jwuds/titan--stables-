export const generateOrganizationSchema = (location) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Titan Stables",
  "image": "https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/6f8c70d2e367901817b1fc0b00615122.jpg",
  "url": "https://titanstables.com",
  "telephone": location?.phone || "+15157054429",
  "priceRange": "$$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": location?.address || "13486 Cedar View Rd",
    "addressLocality": location?.city || "Drewryville",
    "addressRegion": location?.state || "VA",
    "postalCode": location?.zip || "23844",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": location?.latitude || 36.6964,
    "longitude": location?.longitude || -77.2782
  },
  "openingHoursSpecification": location?.hours ? Object.entries(location.hours).map(([day, hours]) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
      "opens": hours === 'Closed' ? '00:00' : hours.split('-')[0].trim(),
      "closes": hours === 'Closed' ? '00:00' : hours.split('-')[1]?.trim() || '23:59'
  })) : [],
  "sameAs": [
    "https://facebook.com/titanstables",
    "https://instagram.com/titanstables",
    "https://twitter.com/titanstables"
  ]
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Titan Stables",
  "url": "https://titanstables.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://titanstables.com/horses?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateProductSchema = (product, isHorse = false) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.title || product.name,
  "image": product.images?.[0] || product.image,
  "description": product.description,
  "sku": product.id,
  "brand": {
    "@type": "Brand",
    "name": "Titan Stables"
  },
  "offers": {
    "@type": "Offer",
    "url": `https://titanstables.com/${isHorse ? 'horses' : 'product'}/${product.id}`,
    "priceCurrency": "USD",
    "price": product.price || product.variants?.[0]?.price,
    "itemCondition": "https://schema.org/NewCondition",
    "availability": product.status === 'sold' ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
  }
});

export const generateBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://titanstables.com${item.path}`
  }))
});