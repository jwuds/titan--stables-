import React from 'react';
import RegionalPageTemplate from '@/components/RegionalPageTemplate';

const NetherlandsRegionalPage = () => {
  return (
    <RegionalPageTemplate 
      regionId="netherlands"
      regionName="Netherlands"
      heroImage="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a"
      description="The heart of our operations. Sourcing, training, and veterinary preparation directly in Friesland before global export."
      contactInfo={{
        address: "Titan Sourcing Facility\nLeeuwarden, Friesland\nNetherlands",
        phone: "+31 6 1234 5678",
        email: "nl@titanstables.org",
        hours: "Mon-Sat: 8am - 6pm CET"
      }}
      timeline={{
        prep: "Immediate Availability",
        transit: "N/A (Origin)",
        quarantine: "N/A",
        total: "Available for viewing"
      }}
      pricing={{
        flight: "N/A",
        quarantine: "N/A",
        total: "Base Horse Price Only"
      }}
    />
  );
};

export default NetherlandsRegionalPage;