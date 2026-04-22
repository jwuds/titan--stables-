import React, { useEffect, useState } from 'react';
import { Truck, Globe, MapPin, PackageCheck, Edit } from 'lucide-react';
import LazyImage from '@/components/LazyImage.jsx';
import { useAdmin } from '@/contexts/AdminContext';
import { Link } from 'react-router-dom';
import { useAdminSections } from '@/hooks/useAdminSections';
import { Button } from '@/components/ui/button';

const GlobalDeliveryExcellence = () => {
  const { isAdmin } = useAdmin();
  const { getGlobalDeliveryImages } = useAdminSections();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const data = await getGlobalDeliveryImages();
      if (data && data.length > 0) {
        setImages(data);
      } else {
        setImages([{ image_url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1000&auto=format&fit=crop" }]);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="section-container bg-white relative group">
      {isAdmin && (
        <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to="/admin/global-delivery">
            <Button variant="secondary" size="sm" className="gap-2 shadow-lg">
              <Edit className="w-4 h-4" /> Edit Section
            </Button>
          </Link>
        </div>
      )}
      <div className="section-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden aspect-square lg:aspect-auto lg:h-[700px] shadow-2xl">
            {images[0] && (
              <LazyImage 
                src={images[0].image_url}
                alt="Professional horse transport and delivery"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-slate-900/20"></div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
              <Truck className="w-4 h-4" /> Seamless Transport
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Global Delivery <span className="text-[#D4AF37]">Excellence</span>
            </h2>
            
            <p className="text-lg text-slate-600 font-sans leading-relaxed">
              We provide white-glove transportation services for your Friesian. From our stables to your hands, our network of specialized equine transporters ensures maximum comfort, safety, and reduced stress for your new partner.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              {[
                { icon: Globe, title: "International Logistics", desc: "Expert handling of flights, quarantine, and customs." },
                { icon: Truck, title: "Climate Controlled", desc: "State-of-the-art domestic trailers for maximum comfort." },
                { icon: PackageCheck, title: "Door-to-Door", desc: "Comprehensive end-to-end delivery service." },
                { icon: MapPin, title: "Real-Time Tracking", desc: "Stay updated on your horse's journey 24/7." }
              ].map((feature, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">{feature.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalDeliveryExcellence;