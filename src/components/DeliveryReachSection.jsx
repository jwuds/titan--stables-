import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, MapPin, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editable from '@/components/Editable';

const DeliveryReachSection = () => {
  const deliveryFeatures = [
    {
      icon: Truck,
      key: "nationwide",
      defaultTitle: "Nationwide Coverage",
      defaultDesc: "From coast to coast, we coordinate professional transport to any state or province."
    },
    {
      icon: ShieldCheck,
      key: "safety",
      defaultTitle: "Safe & Secure",
      defaultDesc: "Our transport partners use air-ride suspension trailers with video monitoring."
    },
    {
      icon: Calendar,
      key: "scheduling",
      defaultTitle: "Flexible Scheduling",
      defaultDesc: "Weekly routes available to major equestrian hubs across North America."
    }
  ];

  return (
    <section className="relative py-24 bg-slate-950 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-slate-900 to-transparent opacity-60 z-0 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-bold uppercase tracking-wider mb-6">
              <MapPin className="w-3 h-3" />
              <span>Logistics Experts</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              <Editable 
                name="delivery_title" 
                defaultValue="Our Delivery Reach — Nationwide Horse Transport" 
              />
            </h2>
            
            <div className="text-lg text-slate-300 mb-8 leading-relaxed">
              <Editable 
                name="delivery_subtitle" 
                defaultValue="We deliver premium Friesian and sport horses across the entire United States and Canada. Distance is never an obstacle to finding your dream horse."
                type="textarea"
              />
            </div>

            <div className="space-y-6 mb-10">
              {deliveryFeatures.map((feature, idx) => (
                <div key={feature.key} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1 text-lg">
                      <Editable name={`delivery_feat_title_${feature.key}`} defaultValue={feature.defaultTitle} />
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      <Editable 
                        name={`delivery_feat_desc_${feature.key}`} 
                        defaultValue={feature.defaultDesc} 
                        type="textarea"
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/contact">
              <Button size="lg" className="bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/20 border-0">
                <Editable name="delivery_cta" defaultValue="Plan Your Delivery" />
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Map Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-900 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
              <img 
                src="https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/2c99c8e60052189dd591a2b3aa3b2cec.jpg" 
                alt="Titan Stables Delivery Map" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              
              {/* Overlay Card on Image */}
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-6 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Service Area</p>
                    <p className="text-white font-serif font-bold text-xl">USA & Canada</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Weekly Trips</p>
                    <p className="text-primary font-bold text-xl">20+ Routes</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative dots/elements behind map */}
            <div className="absolute -z-10 top-10 -right-10 w-24 h-24 bg-dots-pattern opacity-20" />
            <div className="absolute -z-10 -bottom-10 -left-6 w-24 h-24 bg-dots-pattern opacity-20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryReachSection;