import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function FAQSeoManager({ faqs }) {
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
      <title>FAQs About Friesian Horses | Import, Care & Dressage | Titan Stables</title>
      <meta name="description" content="Find answers to common questions about Friesian horse breeding, care, dressage training, and international import. Expert guidance from Titan Stables." />
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}