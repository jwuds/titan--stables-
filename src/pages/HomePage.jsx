import React from 'react';
import { useLocation } from '@/hooks/useLocation.js';
import { useCanonical } from '@/hooks/useCanonical.js';

import SeoHead from '@/components/SeoHead.jsx';
import LocalBusinessSchema from '@/components/LocalBusinessSchema.jsx';
import GeoMetaTags from '@/components/GeoMetaTags.jsx';

// ═════════════════════════════════════════════════════════════════════════════
// SECTION IMPORTS: MODULAR HOMEPAGE ARCHITECTURE (8 SECTIONS)
// ═════════════════════════════════════════════════════════════════════════════

// 1. Hero
import HeroSection from '@/components/sections/HeroSection.jsx';

// 2. Global Standard in Friesian Building
import GlobalStandardFriesianBuilding from '@/components/sections/GlobalStandardFriesianBuilding.jsx';

// 3. Featured Collection
import EnhancedOwnATitan from '@/components/sections/EnhancedOwnATitan.jsx';

// 4. Meet The Experts
import MeetTheExperts from '@/components/sections/MeetTheExperts.jsx';

// 5. Global Delivery Excellence
import GlobalDeliveryExcellence from '@/components/sections/GlobalDeliveryExcellence.jsx';

// 6. International Friesian Importation
import InternationalFriesianImportation from '@/components/sections/InternationalFriesianImportation.jsx';

// 7. Delivery Reach Nationwide
import DeliveryReachNationwide from '@/components/sections/DeliveryReachNationwide.jsx';

// 8. Your Journey To Ownership
import YourJourneyToOwnership from '@/components/sections/YourJourneyToOwnership.jsx';

// 9. Explore More (Final CTA)
import ExploreMore from '@/components/sections/ExploreMore.jsx';

// ═════════════════════════════════════════════════════════════════════════════

const HomePage = () => {
  useCanonical('https://titanstables.org/');
  const { location } = useLocation();

  return (
    <>
      <SeoHead pageKey="home" />
      <LocalBusinessSchema />
      <GeoMetaTags />

      <main className="w-full flex flex-col min-h-screen overflow-x-hidden">
        {/* SECTION 1: HERO */}
        <HeroSection />

        {/* SECTION 2: GLOBAL STANDARD IN FRIESIAN BUILDING */}
        <GlobalStandardFriesianBuilding />
        
        {/* SECTION 3: FEATURED COLLECTION */}
        <EnhancedOwnATitan />
        
        {/* SECTION 4: MEET THE EXPERTS */}
        <MeetTheExperts />

        {/* SECTION 5: GLOBAL DELIVERY EXCELLENCE */}
        <GlobalDeliveryExcellence />

        {/* SECTION 6: INTERNATIONAL FRIESIAN IMPORTATION */}
        <InternationalFriesianImportation />
        
        {/* SECTION 7: DELIVERY REACH NATIONWIDE */}
        <DeliveryReachNationwide />

        {/* SECTION 8: YOUR JOURNEY TO OWNERSHIP */}
        <YourJourneyToOwnership />

        {/* SECTION 9: EXPLORE MORE (FINAL CTA) */}
        <ExploreMore />
      </main>
    </>
  );
};

export default React.memo(HomePage);