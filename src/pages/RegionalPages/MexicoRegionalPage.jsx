import React from 'react';
import RegionalPageTemplate from '@/components/RegionalPageTemplate';

const MexicoRegionalPage = () => {
  return (
    <RegionalPageTemplate 
      regionId="mexico"
      regionName="Mexico"
      heroImage="https://images.unsplash.com/photo-1613437190836-d59585104264"
      description="Dedicated support for SENASICA regulations, offering safe overland transport from USA hubs or direct flights to Mexico City."
      contactInfo={{
        address: "Titan Stables LatAm Support\n(Virtual Hub)",
        phone: "+1 (434) 253-5844 (Main)",
        email: "mexico@titanstables.org",
        hours: "Mon-Fri: 9am - 5pm CST"
      }}
      timeline={{
        prep: "14-21 Days",
        transit: "2-4 Days",
        quarantine: "Varies",
        total: "4-6 Weeks"
      }}
      pricing={{
        flight: "$8,000 - $12,000 USD",
        quarantine: "Varies by import method",
        total: "$10,000 - $15,000 USD"
      }}
    />
  );
};

export default MexicoRegionalPage;