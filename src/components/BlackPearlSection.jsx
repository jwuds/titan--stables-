import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editable from '@/components/Editable';

const BlackPearlSection = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1601726429844-acd8b1385972?q=80&w=2000&auto=format&fit=crop" 
          alt="Friesian Horse" 
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              <span>The Royal Friesian</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
              <Editable name="bp_title" defaultValue="The Black Pearl of Friesland" />
            </h2>
            
            <div className="text-lg text-slate-200 mb-8 leading-relaxed space-y-6">
              <div>
                <Editable 
                  name="bp_desc_1" 
                  defaultValue="Originating from the province of Friesland in the Netherlands, the Friesian horse is renowned for its majestic presence, high-stepping gait, and luxurious black coat. Known as the 'Black Pearl,' this breed combines powerful draft heritage with refined baroque elegance."
                  type="textarea"
                />
              </div>
              <div>
                <Editable 
                  name="bp_desc_2" 
                  defaultValue="Beyond their stunning appearance, Friesians are celebrated for their willing temperament and intelligence. Whether for dressage, carriage driving, or recreational riding, they form deep, lasting bonds with their owners."
                  type="textarea"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/horses">
                <Button className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 py-6 font-semibold shadow-lg">
                  Find Your Friesian
                </Button>
              </Link>
              <Link to="/blog">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 rounded-full px-8 py-6 font-semibold">
                  Read Journal
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 hidden lg:block"
          >
             {/* Decorative element or secondary image could go here, but keeping it clean to focus on background */}
             <div className="p-8 border border-white/20 bg-white/5 backdrop-blur-md rounded-2xl max-w-md ml-auto">
               <h3 className="text-primary font-serif text-2xl mb-4 font-bold">Breed Standards</h3>
               <ul className="space-y-4 text-slate-200">
                 <li className="flex gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"/>
                   <span>Solid black coat, no white markings permitted</span>
                 </li>
                 <li className="flex gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"/>
                   <span>Powerful, high-stepping trot with suspension</span>
                 </li>
                 <li className="flex gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"/>
                   <span>Luxurious, thick mane, tail, and feathers</span>
                 </li>
                 <li className="flex gap-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"/>
                   <span>Kind, docile, and willing temperament</span>
                 </li>
               </ul>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlackPearlSection;