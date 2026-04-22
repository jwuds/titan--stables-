import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Info, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Editable from '@/components/Editable';
import EditableGallerySlider from '@/components/EditableGallerySlider';
import { cn } from '@/lib/utils';

const EditableHero = ({ 
  pageName, 
  defaultTitle, 
  defaultSubtitle, 
  defaultCtaText, 
  defaultCtaLink,
  defaultBadgeText 
}) => {
  // Sanitize pageName for content keys
  const safePageName = pageName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const sliderKey = `${safePageName}_hero_slider`;

  const heroOverlay = (
    <>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <div className="pointer-events-auto max-w-5xl w-full">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <div className="mb-6 flex justify-center">
                   <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20">
                      <span className="text-white text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                        {defaultBadgeText || "Premium Collection"}
                      </span>
                   </div>
                </div>

                <div className="relative inline-block mb-6">
                    <Editable 
                        name={`${safePageName}_hero_title`} 
                        defaultValue={defaultTitle} 
                        as="h1"
                        className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight drop-shadow-2xl"
                    />
                </div>
                
                <p className="text-xl md:text-2xl text-slate-200 font-light max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
                     <Editable name={`${safePageName}_hero_subtitle`} defaultValue={defaultSubtitle} />
                </p>

                {/* Primary Actions & Consistent Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {defaultCtaText && defaultCtaLink && (
                        <Link to={defaultCtaLink}>
                            <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 w-full sm:w-auto">
                                {defaultCtaText}
                            </Button>
                        </Link>
                    )}
                    
                    {/* View Facility Only - Learn About Us removed */}
                    <Link to="/facility">
                       <Button variant="outline" size="lg" className="rounded-full px-8 py-7 text-lg border-white/30 bg-black/20 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm w-full sm:w-auto">
                          <Home className="mr-2 h-5 w-5" /> View Our Facility
                       </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/40 flex flex-col items-center gap-2 pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </>
  );

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-slate-950">
        <EditableGallerySlider 
            storageKey={sliderKey}
            defaultImages={["https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2000&auto=format&fit=crop"]}
            overlayContent={heroOverlay}
            className="h-full w-full"
            showControls={true}
        />
    </section>
  );
};

export default EditableHero;