import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Star, CheckCircle, Edit } from 'lucide-react';
import LazyImage from '@/components/LazyImage.jsx';
import { useAdmin } from '@/contexts/AdminContext';
import { Link } from 'react-router-dom';
import { useAdminSections } from '@/hooks/useAdminSections';
import { Button } from '@/components/ui/button';

const GlobalStandardFriesianBuilding = () => {
  const { isAdmin } = useAdmin();
  const { getGlobalStandardImages } = useAdminSections();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const data = await getGlobalStandardImages();
      if (data && data.length > 0) {
        setImages(data);
      } else {
        // Fallback default
        setImages([{ image_url: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1000&auto=format&fit=crop" }]);
      }
    };
    fetchImages();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="section-container bg-slate-50 border-b border-slate-200 relative group">
      {isAdmin && (
        <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to="/admin/global-standard">
            <Button variant="secondary" size="sm" className="gap-2 shadow-lg">
              <Edit className="w-4 h-4" /> Edit Section
            </Button>
          </Link>
        </div>
      )}
      <div className="section-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="space-y-8">
            <div>
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-4 h-4" /> Breeding Excellence
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight mb-6">
                Global Standard in <span className="text-[#D4AF37]">Friesian</span> Breeding
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-slate-600 font-sans leading-relaxed">
                We meticulously select and develop premium KFPS registered Friesians, ensuring exceptional dressage movement, classic Baroque silhouettes, and the perfect temperament for discerning equestrians worldwide.
              </motion.p>
            </div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { icon: Star, title: "KFPS Certified", desc: "Strict adherence to Dutch studbook standards." },
                { icon: Award, title: "Elite Bloodlines", desc: "Proven genetics for performance and health." },
                { icon: CheckCircle, title: "Health Verified", desc: "Comprehensive veterinary and genetic testing." },
                { icon: ShieldCheck, title: "Temperament", desc: "Selected for willingness and gentle nature." }
              ].map((item, idx) => (
                <motion.div key={idx} variants={itemVariants} className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            {images[0] && (
              <LazyImage src={images[0].image_url} alt="Premium KFPS Friesian Horse" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                <p className="text-white font-serif text-2xl md:text-3xl font-bold mb-2">Welcome To Titan Stables.</p>
                <p className="text-slate-200 text-sm md:text-base">Every Titan horse represents the pinnacle of the Friesian breed standard.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default GlobalStandardFriesianBuilding;