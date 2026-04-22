import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Globe } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LazyImage from '@/components/LazyImage';
import { Button } from '@/components/ui/button';

const regionsData = [
  {
    id: 'northeast',
    name: 'Northeast Hub',
    description: 'Serving the premier equestrian estates of the American Northeast with dedicated cold-climate transport.',
    cities: 'New York, Boston, Philadelphia, Washington D.C.',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'southeast',
    name: 'Southeast Hub',
    description: 'Expertise in warm-climate acclimatization and direct import routes through major southern ports.',
    cities: 'Miami, Atlanta, Charlotte, Charleston',
    image: 'https://images.unsplash.com/photo-1598974357801-bca105b4ee68?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'midwest',
    name: 'Midwest Hub',
    description: 'Centralized logistics providing efficient cross-country distribution and world-class boarding.',
    cities: 'Chicago, Columbus, Indianapolis, Detroit',
    image: 'https://images.unsplash.com/photo-1553344607-ad01fbb0ebed?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'southwest',
    name: 'Southwest Hub',
    description: 'Specialized arid-climate facilities catering to the unique needs of Friesians in the Southwest.',
    cities: 'Dallas, Houston, Phoenix, Santa Fe',
    image: 'https://images.unsplash.com/photo-1611174987019-3ee7149a4fba?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'west-coast',
    name: 'West Coast Hub',
    description: 'Premium Pacific import logistics, serving California\'s elite dressage and driving communities.',
    cities: 'Los Angeles, San Francisco, Seattle, Portland',
    image: 'https://images.unsplash.com/photo-1566139103561-12eb7607a726?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'mountain-region',
    name: 'Mountain Region Hub',
    description: 'High-altitude acclimatization and rugged terrain training programs for exceptional stamina.',
    cities: 'Denver, Salt Lake City, Boise, Cheyenne',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop'
  }
];

const LocationsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title="Our Regional Hubs | Titan Stables"
        description="Explore Titan Stables' regional equestrian hubs across North America. We provide dedicated Friesian importation, transport, and care tailored to every region."
        url="https://titanstables.org/locations"
      />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <LazyImage 
          src="https://images.unsplash.com/photo-1553344607-ad01fbb0ebed?q=80&w=2000&auto=format&fit=crop"
          alt="Titan Stables Global Locations"
          className="absolute inset-0 w-full h-full object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/90 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            <Globe className="w-4 h-4" /> Global Reach, Local Expertise
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Regional Hubs
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Titan Stables operates strategically located hubs to ensure seamless importation, optimal acclimatization, and unparalleled support for your Friesian, wherever you are.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regionsData.map((region) => (
              <Link 
                key={region.id} 
                to={`/locations/${region.id}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 translate-y-0 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <LazyImage 
                    src={region.image} 
                    alt={region.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> Active Hub
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {region.name}
                  </h2>
                  <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                    {region.description}
                  </p>
                  
                  <div className="border-t border-slate-100 pt-4 mb-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Cities Served</p>
                    <p className="text-sm font-medium text-slate-700">{region.cities}</p>
                  </div>

                  <div className="flex items-center text-primary font-semibold text-sm mt-auto">
                    Explore Region Details <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Don't See Your Location?</h2>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed">
            Our logistics network spans the entire continent and beyond. Contact our dedicated transport team to discuss custom door-to-door delivery routes tailored to your specific location.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg">
                Contact Logistics Team
              </Button>
            </Link>
            <Link to="/horses">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white hover:text-slate-900 text-white rounded-full px-8 py-6 text-lg">
                Browse Horses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationsPage;