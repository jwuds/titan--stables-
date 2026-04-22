import React from 'react';
import RegionalPageTemplate from '@/components/RegionalPageTemplate';

const AustraliaRegionalPage = () => {
  return (
    <RegionalPageTemplate 
      regionId="australia"
      regionName="Australia"
      heroImage="https://images.unsplash.com/photo-1563773157-d78e37794bd4"
      description="Navigating Australia's strict biosecurity laws with specialized pre-export isolation facilities in Europe and safe transport to Mickleham."
      contactInfo={{
        address: "Titan Stables Australia Desk\nSydney, NSW\n(Virtual Hub)",
        phone: "+61 2 8000 0000 (Forwarded)",
        email: "aus@titanstables.org",
        hours: "Mon-Fri: 9am - 5pm AEST"
      }}
      timeline={{
        prep: "21 Days PEI (Pre-Export Isolation)",
        transit: "3-5 Days",
        quarantine: "14 Days (Post-Arrival at Mickleham)",
        total: "6-8 Weeks"
      }}
      pricing={{
        flight: "$15,000 - $18,000 AUD",
        quarantine: "$8,000 - $12,000 AUD (PEI + Arrival)",
        total: "$23,000 - $30,000 AUD"
      }}
    />
  );
};

export default AustraliaRegionalPage;