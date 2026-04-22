import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, Phone, ArrowRight, ShieldCheck, Truck, Sun, Snowflake } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import LazyImage from '@/components/LazyImage';
import { Button } from '@/components/ui/button';
import { useHorses } from '@/hooks/usePageData';

const regionDetails = {
  'northeast': {
    name: 'Northeast Hub',
    title: 'Premium Friesians in the Northeast',
    description: 'Serving the premier equestrian estates of the American Northeast. Our dedicated cold-climate transport and acclimatization programs ensure your Friesian arrives in peak condition, ready for the changing seasons.',
    cities: 'New York, Boston, Philadelphia, Washington D.C.',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2000&auto=format&fit=crop',
    icon: Snowflake,
    perk: 'Heated Transport Logistics'
  },
  'southeast': {
    name: 'Southeast Hub',
    title: 'Elite Dressage Prospects for the Southeast',
    description: 'Leveraging direct import routes through major southern ports. We specialize in warm-climate acclimatization, carefully managing diet and turnout to ensure your horse thrives in the southeastern humidity and heat.',
    cities: 'Miami, Atlanta, Charlotte, Charleston',
    image: 'https://images.unsplash.com/photo-1598974357801-bca105b4ee68?q=80&w=2000&auto=format&fit=crop',
    icon: Sun,
    perk: 'Warm-Climate Acclimatization'
  },
  'midwest': {
    name: 'Midwest Hub',
    title: 'Centralized Equestrian Excellence',
    description: 'Our Midwest logistics center acts as a crucial waypoint for cross-country distribution. Offering expansive pastures and robust, four-season facilities to prepare imported Friesians for any North American environment.',
    cities: 'Chicago, Columbus, Indianapolis, Detroit',
    image: 'https://images.unsplash.com/photo-1553344607-ad01fbb0ebed?q=80&w=2000&auto=format&fit=crop',
    icon: MapPin,
    perk: 'Centralized Cross-Country Routing'
  },
  'southwest': {
    name: 'Southwest Hub',
    title: 'Arid Climate Friesian Care',
    description: 'Specialized arid-climate facilities catering to the unique needs of heavy-coated Friesians in the Southwest. We provide expert guidance on coat management, hydration, and safe exercise regimens in extreme heat.',
    cities: 'Dallas, Houston, Phoenix, Santa Fe',
    image: 'https://images.unsplash.com/photo-1611174987019-3ee7149a4fba?q=80&w=2000&auto=format&fit=crop',
    icon: Sun,
    perk: 'Arid-Environment Conditioning'
  },
  'west-coast': {
    name: 'West Coast Hub',
    title: 'Pacific Coast Import Specialists',
    description: 'Dedicated Pacific import logistics serving California\'s elite dressage and driving communities. Seamlessly connecting European breeding programs to the finest equestrian centers along the West Coast.',
    cities: 'Los Angeles, San Francisco, Seattle, Portland',
    image: 'https://images.unsplash.com/photo-1566139103561-12eb7607a726?q=80&w=2000&auto=format&fit=crop',
    icon: ShieldCheck,
    perk: 'Direct Pacific Air Routes'
  },
  'mountain-region': {
    name: 'Mountain Region Hub',
    title: 'High-Altitude Equestrian Performance',
    description: 'Focused on high-altitude acclimatization and rugged terrain training. Our Mountain Region team ensures that imported Friesians safely adapt to thinner air, building exceptional cardiovascular stamina.',
    cities: 'Denver, Salt Lake City, Boise, Cheyenne',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop',
    icon: ShieldCheck,
    perk: 'High-Altitude Conditioning'
  }
};

const RegionalHubPage = () => {
  const { region } = useParams();
  const currentRegion = regionDetails[region];
  const { horses, loading } = useHorses(3); // Fetch 3 featured horses

  if (!currentRegion) {
    return <Navigate to="/locations" replace />;
  }

  const RegionIcon = currentRegion.icon;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={`${currentRegion.title} | Titan Stables`}
        description={currentRegion.description}
        url={`https://titanstables.org/locations/${region}`}
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <LazyImage 
          src={currentRegion.image}
          alt={currentRegion.name}
          className="absolute inset-0 w-full h-full object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
              <MapPin className="w-4 h-4" /> {currentRegion.name}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              {currentRegion.title}
            </h1>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed max-w-2xl">
              Delivering KFPS registered excellence and dedicated support to clients across {currentRegion.cities}.
            </p>
          </div>
        </div>
      </section>

      {/* Region Overview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">
                Local Expertise, Global Standards
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                {currentRegion.description}
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                Our logistics network guarantees a smooth transition from Europe directly to your stable. We handle all USDA/CFIA health certificates, quarantine coordination, and localized road transport.
              </p>
              
              <ul className="space-y-5">
                {[
                  `Serving major hubs: ${currentRegion.cities}`,
                  'Expert veterinary partnerships in the region',
                  'Customized dietary planning for local forage',
                  currentRegion.perk
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-800 font-medium">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {i === 0 ? <MapPin className="w-5 h-5 text-primary" /> : 
                       i === 3 ? <RegionIcon className="w-5 h-5 text-primary" /> :
                       <ShieldCheck className="w-5 h-5 text-primary" />}
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-full bg-primary/5 absolute -top-8 -right-8 w-full h-full -z-10 blur-3xl"></div>
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl relative z-10">
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
                  Logistics & Transport
                </h3>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                      <Truck className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Door-to-Door Delivery</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">Fully insured, climate-controlled transport directly to your boarding facility within the {currentRegion.name} area.</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                      <Phone className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">Dedicated Regional Support</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">Our regional liaisons are available 24/7 during transit to provide updates and ensure total peace of mind.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <Link to="/contact">
                    <Button className="w-full rounded-xl h-14 text-base font-bold shadow-lg shadow-primary/20">
                      Request Transport Quote
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Regional Horses */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Available for Import to {currentRegion.name}</h2>
              <p className="text-slate-600 max-w-xl">Browse a selection of premium KFPS Friesians ready for immediate export and delivery to your region.</p>
            </div>
            <Link to="/horses" className="hidden md:flex items-center text-primary font-semibold hover:text-[#b5952f] transition-colors">
              View All Horses <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-[400px] bg-slate-100 animate-pulse rounded-2xl"></div>)}
             </div>
          ) : horses.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {horses.map(horse => (
                  <Link to={`/horses/${horse.id}`} key={horse.id} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 translate-y-0 hover:-translate-y-1">
                      <div className="aspect-[4/3] relative">
                          <LazyImage src={horse.image_url || horse.images?.[0]} alt={horse.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                            {horse.age} Years • {horse.gender || 'Stallion'}
                          </div>
                      </div>
                      <div className="p-6">
                          <h3 className="font-serif font-bold text-xl text-slate-900 mb-2 group-hover:text-primary transition-colors">{horse.name}</h3>
                          <p className="text-slate-500 text-sm mb-4 line-clamp-2">{horse.bio || horse.description || 'Premium KFPS Friesian available for import.'}</p>
                          <div className="flex items-center text-primary font-semibold text-sm">
                            View Profile <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </div>
                      </div>
                  </Link>
               ))}
             </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-600">Our latest selection is being updated. Contact us for private inventory access.</p>
            </div>
          )}
          
          <div className="md:hidden mt-8 text-center">
              <Link to="/horses">
                  <Button variant="outline" className="w-full rounded-full border-slate-200">View All Horses</Button>
              </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Ready to Welcome Your Friesian?</h2>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Our {currentRegion.name} logistics team is standing by to coordinate your dream horse's journey. From European selection to doorstep delivery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 text-lg">
                Contact Regional Specialist
              </Button>
            </Link>
            <Link to="/locations">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white hover:text-slate-900 text-white rounded-full px-10 py-6 text-lg">
                View All Regions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegionalHubPage;