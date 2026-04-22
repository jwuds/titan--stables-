import React from 'react';
import RegionalPageTemplate from '@/components/RegionalPageTemplate';

const CanadaRegionalPage = () => {
  return (
    <RegionalPageTemplate 
      regionId="canada"
      regionName="Canada"
      heroImage="https://images.unsplash.com/photo-1534078362425-387ae9668c17"
      description="Expert management of CFIA regulations, cross-border transport from USA quarantine hubs, and direct flights to major Canadian airports."
      contactInfo={{
        address: "Titan Stables Canada Support\nToronto, ON\n(Virtual Hub)",
        phone: "+1 (434) 253-5844 (Main)",
        email: "canada@titanstables.org",
        hours: "Mon-Fri: 9am - 5pm EST"
      }}
      timeline={{
        prep: "14-21 Days",
        transit: "1-2 Days",
        quarantine: "Varies (often handled via US border)",
        total: "4-6 Weeks"
      }}
      pricing={{
        flight: "$9,000 - $11,000 CAD",
        quarantine: "$3,000 - $5,000 CAD",
        total: "$12,000 - $16,000 CAD"
      }}
    />
  );
};

export default CanadaRegionalPage;