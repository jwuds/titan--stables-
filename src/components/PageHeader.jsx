import React from 'react';
import { motion } from 'framer-motion';
import Editable from '@/components/Editable';
import EditableGallerySlider from '@/components/EditableGallerySlider';
import { cn } from '@/lib/utils';
import { ChevronDown, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PageHeader = ({ 
  pageName = 'default_page', 
  defaultTitle = '', 
  defaultSubtitle = '', 
  defaultBgImage = '',
  heightClass = "h-[60vh] md:h-[70vh]", 
  children 
}) => {
  // Sanitize pageName for content keys, adding fallback for safety
  const safePageName = (pageName || 'default_page').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const sliderKey = `${safePageName}_header_slider`;
  
  const defaultImages = [defaultBgImage || "https://images.unsplash.com/photo-1534251653287-2108ed96e285?q=80&w=1920&auto=format&fit=crop"];

  const contentOverlay = (
    <div className="h-full w-full flex flex-col items-center justify-center text-center px-4 pointer-events-none">
       <div className="pointer-events-auto max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Optional Top Content (Badges, Icons) */}
            {children && <div className="mb-6 flex justify-center">{children}</div>}
            
            <div className="relative inline-block mb-6">
                <Editable 
                  name={`${safePageName}_header_title`} 
                  defaultValue={defaultTitle} 
                  as="h1"
                  className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight drop-shadow-2xl"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            </div>
            
            <div className="mt-8 mb-10">
                <Editable 
                  name={`${safePageName}_header_subtitle`} 
                  defaultValue={defaultSubtitle || " "} 
                  className="text-lg md:text-2xl text-slate-200 font-light max-w-3xl mx-auto drop-shadow-md leading-relaxed min-h-[2rem]"
                />
            </div>

            {/* High Visibility Navigation Buttons */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
                <Link to="/facility">
                   <Button variant="outline" size="sm" className="rounded-full px-6 py-5 text-base border-white/30 bg-black/20 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm transition-all duration-300">
                      <Home className="mr-2 h-4 w-4" /> View Our Facility
                   </Button>
                </Link>
            </div>

          </motion.div>
       </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/40 flex flex-col items-center gap-2 pointer-events-none"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
    </div>
  );

  return (
    <section className={cn("relative w-full bg-slate-950", heightClass)}>
       <EditableGallerySlider 
         storageKey={sliderKey}
         defaultImages={defaultImages}
         overlayContent={contentOverlay}
         className="h-full w-full"
       />
    </section>
  );
};

export default PageHeader;