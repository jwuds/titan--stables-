import React from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';

const ReserveHorsePage = () => {
  return (
    <>
      <SEO 
        title="Reserve Your Premium Friesian Horse - Secure Your Selection"
        description="Start the process of reserving your dream Friesian horse. Learn about our reservation requirements and timeline."
        keywords="reserve Friesian horse, horse reservation, buy Friesian horses"
        url="/reserve"
      />

      <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
        <PageHeader
            pageName="reserve"
            defaultTitle="Reserve Your Premium Friesian Horse"
            defaultSubtitle="Secure Your Selection Today"
            defaultBgImage="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1920"
        />
        {/* Reservation form content remains */}
      </div>
    </>
  );
};

export default ReserveHorsePage;