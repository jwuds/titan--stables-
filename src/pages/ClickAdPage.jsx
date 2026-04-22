import React from 'react';
import { Helmet } from 'react-helmet';
import SEOHead from '@/components/SEOHead.jsx';
import OwnATitanClickAd from '@/components/OwnATitanClickAd.jsx';

const ClickAdPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Own a Titan - Premium Friesian Horses | Titan Stables"
        description="Own a Titan - Premium Friesian horses for sale. Limited stock available. Health tested, trained, and certified."
        url="/own-a-titan"
      />
      <Helmet>
        <title>Own a Titan - Premium Friesian Horses | Titan Stables</title>
        <meta name="description" content="Own a Titan - Premium Friesian horses for sale. Limited stock available. Health tested, trained, and certified." />
      </Helmet>

      <main className="flex-grow pt-20">
        <OwnATitanClickAd />
      </main>
    </div>
  );
};

export default ClickAdPage;