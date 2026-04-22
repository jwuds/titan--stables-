import React from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead.jsx';
import { generateLocalBusinessSchema, LocalBusinessSchema } from '@/components/SchemaMarkup.jsx';
import LazyImage from '@/components/LazyImage.jsx';
import { MapPin, Phone, Star, ShieldCheck, CheckCircle } from 'lucide-react';

const LocationPage = ({ locationData }) => {
  const { slug } = useParams();
  
  // Mock data if not provided via props (in real app, fetch based on slug)
  const defaultLocation = {
    city: "Richmond",
    state: "VA",
    region: "Mid-Atlantic",
    address: "13486 Cedar View Rd",
    zip: "23844",
    phone: "+1-515-705-4429",
    slug: slug || "richmond-va",
    nearbyCity: "Virginia Beach",
    landmark1: "James River",
    landmark2: "Blue Ridge Mountains",
    landmark3: "Washington D.C. Metropolitan Area"
  };

  const loc = locationData || defaultLocation;
  const localSchema = generateLocalBusinessSchema(loc);
  
  const pageTitle = `Premium Friesian Horses in ${loc.city}, ${loc.state} | Titan Stables`;
  const pageDesc = `Discover exceptional KFPS registered Friesian horses near ${loc.city}, ${loc.state}. Titan Stables provides elite importation, training, and care in the ${loc.region} region.`;
  const canonicalUrl = `https://titanstables.org/locations/${loc.slug}`;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={pageTitle}
        description={pageDesc}
        url={canonicalUrl}
        schema={localSchema}
      />
      <LocalBusinessSchema location={loc} />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <LazyImage 
          src="https://images.unsplash.com/photo-1598974357801-bca105b4ee68?q=80&w=2000&auto=format&fit=crop"
          alt={`Friesian horses near ${loc.city}`}
          className="absolute inset-0 w-full h-full object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/90 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            <MapPin className="w-4 h-4" /> Serving {loc.region}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Elite Friesian Horses<br />Available Near {loc.city}, {loc.state}
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Providing premium KFPS registration expertise and unparalleled equestrian services to residents of {loc.city} and the surrounding {loc.nearbyCity} area.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
                Why Choose Titan Stables in {loc.state}?
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Finding the perfect Friesian horse requires trust, expertise, and a partner who understands the local equestrian landscape. While our headquarters sets the global standard, our dedication reaches clients throughout {loc.city} and the broader {loc.region} region. 
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you're located near the {loc.landmark1}, closer to the {loc.landmark2}, or driving from the {loc.landmark3}, our logistics team ensures a seamless experience from selection to delivery.
              </p>
              
              <ul className="space-y-4">
                {[
                  `Direct delivery coordination to ${loc.city}`,
                  'Expert USDA/CFIA import logistics',
                  'Dedicated regional support team',
                  'Comprehensive health guarantees'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">
                Local Service Area Details
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Primary Region Focus</h4>
                    <p className="text-slate-600">Proudly serving {loc.city}, {loc.nearbyCity}, and the entire {loc.state} equestrian community.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Regional Support Contact</h4>
                    <p className="text-slate-600">Direct Line: <a href={`tel:${loc.phone}`} className="text-primary hover:underline">{loc.phone}</a></p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Verified Logistics</h4>
                    <p className="text-slate-600">Trusted transport routes established across {loc.landmark1} and {loc.landmark2}.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationPage;