import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';

const GlobalDestinationsCarousel = lazy(() => import('@/components/GlobalDestinationsCarousel.jsx'));

const ServicesOverview = () => {
  return (
    <section className="section-container bg-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      <div className="section-content flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2">
              <div className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold mb-4">Global Export Experts</div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 md:mb-8">International Friesian Importation Services</h2>
              <p className="text-lg text-slate-300 mb-4 leading-relaxed">
                  Securing a premium KFPS registered Friesian horse from overseas should be a seamless experience. Our dedicated logistics team specializes in international importation, expertly handling USDA/CFIA health certificates, global quarantine logistics, and customized flight bookings.
              </p>
              <ul className="space-y-4 mb-6 md:mb-8 lg:mb-12">
                  {['Export Documentation', 'Veterinary Health Certificates', 'Door-to-Door Transport', 'Multi-Language Support'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">✓</span>
                          <span className="text-slate-200">{item}</span>
                      </li>
                  ))}
              </ul>
              <Link to="/contact">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8">Get an Importation Quote</Button>
              </Link>
          </div>
          <div className="w-full lg:w-1/2">
              <Suspense fallback={<div className="h-64 bg-white/5 animate-pulse rounded-xl"></div>}>
                  <GlobalDestinationsCarousel />
              </Suspense>
          </div>
      </div>
    </section>
  );
};

export default ServicesOverview;