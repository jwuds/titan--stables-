import React from 'react';
import RegionalPageTemplate from '@/components/RegionalPageTemplate';

const USARegionalPage = () => {
  return (
    <RegionalPageTemplate 
      regionId="usa"
      regionName="United States"
      heroImage="https://images.unsplash.com/photo-1598556776374-0c9f8f060955"
      description="Our primary headquarters handling all USDA import regulations, CEM quarantine, and domestic logistics across all 50 states."
      contactInfo={{
        address: "Titan Stables USA HQ\n13486 Cedar View Rd\nDrewryville, VA 23844",
        phone: "+1 (434) 253-5844",
        email: "usa@titanstables.org",
        hours: "Mon-Sat: 9am - 5pm EST"
      }}
      timeline={{
        prep: "14-21 Days",
        transit: "1-2 Days (Amsterdam to JFK/MIA/LAX)",
        quarantine: "3 Days (Geldings), 14-30 Days (Mares/Stallions for CEM)",
        total: "3-6 Weeks"
      }}
      pricing={{
        flight: "$8,500 - $10,000 USD",
        quarantine: "$2,500 - $4,500 USD (Depends on gender/CEM)",
        total: "$11,000 - $14,500 USD"
      }}
    />
  );
};

export default USARegionalPage;