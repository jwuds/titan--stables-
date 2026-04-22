import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Warehouse, Trophy, Sun, Stethoscope, Heart, Thermometer, X } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useLocation } from '@/hooks/useLocation';
import { supabase } from '@/lib/customSupabaseClient';
import EditableGallerySlider from '@/components/EditableGallerySlider';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">{title}</h3>
        <p className="text-slate-600">{description}</p>
    </div>
);

const FacilityPage = () => {
  const { location, loading: locationLoading } = useLocation();
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1551865108-4c172026b02d?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438097545-a28bc317500d?q=80&w=2000&auto=format&fit=crop"
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
          const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .eq('section_id', 'facility')
            .order('display_order', { ascending: true });
          
          if (error) {
              const { error: handledError } = handleSupabaseError(error);
              if (handledError) console.error("Gallery fetch error:", handledError);
          }
          if (data) setGalleryImages(data);
      } catch (err) {
          console.error("Failed to fetch facility gallery:", err);
      }
    };
    fetchGallery();
  }, []);

  const heroOverlay = (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl pointer-events-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">Titan Stables Equestrian Facility</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8">
              Professional horse farm services designed for the comfort, training, and conditioning of elite Friesian horses.
          </p>
        </motion.div>
    </div>
  );

  const displayAddress = location?.address || '123 Equine Lane';
  const displayCity = location?.city || 'Middleburg';
  const displayState = location?.state || 'VA';
  const displayZip = location?.zip || '20117';

  return (
    <>
      <SEO 
        title="Titan Stables Equestrian Facility - Professional Horse Farm Services"
        description="Explore our world-class Friesian horse facility in Virginia. Impeccable horse welfare standards, premium stabling, and professional horse farm services."
        keywords="horse farm services, equestrian business standards, horse welfare standards, Friesian horse conditioning, professional facility, Titan Stables"
        url="/facility"
      />

      <div className="bg-slate-50 min-h-screen font-sans">
        <section className="relative h-[70vh] w-full overflow-hidden bg-slate-950">
            <EditableGallerySlider 
                storageKey="facility_hero_slider"
                defaultImages={heroImages}
                overlayContent={heroOverlay}
                className="h-full w-full"
                showControls={true}
            />
        </section>
        
        <Breadcrumbs items={[{ name: 'Our Facility', path: '/facility' }]} />

        {/* Location Info */}
        <section className="py-12 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-slate-900">World-Class Friesian Horse Facility</h2>
                    <p className="text-lg text-slate-600">Located in the heart of Virginia horse country, our facility embodies elite equestrian business standards and is dedicated strictly to Friesian horse conditioning.</p>
                    <div className="space-y-2 text-slate-700">
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="text-primary w-5 h-5 flex-shrink-0" /> 
                            {locationLoading ? 'Loading address...' : `${displayAddress}, ${displayCity}, ${displayState} ${displayZip}`}
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 w-full h-64 bg-slate-100 rounded-xl overflow-hidden shadow-inner relative flex items-center justify-center text-slate-500">
                {location?.map_url || location?.map_code ? (
                    <div dangerouslySetInnerHTML={{ __html: location.map_code || `<iframe src="${location.map_url}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" title="Map of Titan Stables equestrian facility"></iframe>` }} className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full" />
                ) : (
                    <div className="text-center p-6">
                        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
                        <p>Interactive map unavailable.</p>
                    </div>
                )}
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                   <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Horse Welfare Standards & Care Protocols</h2>
                   <p className="text-slate-600 max-w-2xl mx-auto">Every aspect of our professional horse farm services has been thoughtfully designed to prioritize the safety, health, and advanced training of our Friesian horses.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard icon={Warehouse} title="Premium Stabling" description="Spacious 12x12 matted stalls reflecting top horse welfare standards with automatic waterers and high-velocity fans." />
                    <FeatureCard icon={Trophy} title="Training Arenas" description="A 20x60m indoor arena with GGT footing specifically designed for Friesian horse conditioning." />
                    <FeatureCard icon={Sun} title="Turnout Pastures" description="Lush, rolling pastures ensuring natural behavior and exceeding standard care protocols." />
                    <FeatureCard icon={Stethoscope} title="Veterinary Care" description="Dedicated exam room and farrier bay ensuring uncompromising equestrian business standards." />
                    <FeatureCard icon={Thermometer} title="Climate Control" description="Heated barns in winter and advanced ventilation systems for maximum comfort year-round." />
                    <FeatureCard icon={Heart} title="Rehabilitation" description="On-site rehabilitation amenities providing the ultimate professional horse farm services." />
                </div>
            </div>
        </section>
        
        {/* Gallery */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold text-center mb-12">Tour Our Training & Conditioning Programs</h2>
                
                {galleryImages.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {galleryImages.map((img) => (
                         <motion.div 
                            key={img.id} 
                            whileHover={{ y: -5 }}
                            className="cursor-pointer overflow-hidden rounded-xl shadow-md group relative bg-slate-100"
                            onClick={() => setSelectedImage(img)}
                         >
                            <div className="aspect-square overflow-hidden">
                                <img 
                                src={img.image_url} 
                                alt={`${img.description || img.title || 'Professional horse farm services'} - Titan Stables equestrian facility`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                loading="lazy" 
                                />
                            </div>
                            {(img.description || img.title) && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <p className="text-white text-sm font-medium">{img.description || img.title}</p>
                                </div>
                            )}
                         </motion.div>
                      ))}
                   </div>
                ) : (
                   <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                       <p>Gallery images illustrating our horse welfare standards are being updated. Check back soon.</p>
                   </div>
                )}
            </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
           {selectedImage && (
              <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                 onClick={() => setSelectedImage(null)}
              >
                 <button aria-label="Close image" className="absolute top-4 right-4 text-white hover:text-primary transition-colors bg-white/10 rounded-full p-2"><X className="w-6 h-6" /></button>
                 <div className="max-w-6xl max-h-[90vh] relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
                    <img src={selectedImage.image_url} alt={`${selectedImage.description || selectedImage.title || 'Facility detail'} - Titan Stables equestrian facility`} className="max-w-full max-h-[80vh] rounded shadow-2xl object-contain" />
                    {(selectedImage.description || selectedImage.title) && (
                        <div className="mt-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full border border-white/20">
                            <p className="text-white text-center text-lg">{selectedImage.description || selectedImage.title}</p>
                        </div>
                    )}
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

        {/* CTA */}
        <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">International Buyer Support Services</h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                    We invite serious buyers to visit our facility, witness our horse welfare standards firsthand, and experience our professional horse farm services.
                </p>
                <Link to="/contact">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full">
                        Schedule a Private Facility Tour
                    </Button>
                </Link>
            </div>
        </section>
      </div>
    </>
  );
};

export default FacilityPage;