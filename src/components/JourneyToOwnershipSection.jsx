import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Stethoscope, FileSignature, Truck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editable from '@/components/Editable';

const JourneyToOwnershipSection = () => {
  const steps = [
    {
      icon: Search,
      key: "browse",
      defaultTitle: "Browse & Select",
      defaultDesc: "Explore our curated collection of premium Friesians online."
    },
    {
      icon: MessageCircle,
      key: "consult",
      defaultTitle: "Consultation",
      defaultDesc: "Discuss your goals with our experts to find your perfect match."
    },
    {
      icon: Stethoscope,
      key: "vet",
      defaultTitle: "Vet Review",
      defaultDesc: "Complete veterinary examination and review of health records."
    },
    {
      icon: FileSignature,
      key: "purchase",
      defaultTitle: "Documentation",
      defaultDesc: "Secure purchase agreement and export paperwork processing."
    },
    {
      icon: Truck,
      key: "transport",
      defaultTitle: "Transport",
      defaultDesc: "Professional door-to-door delivery coordination worldwide."
    },
    {
      icon: Home,
      key: "welcome",
      defaultTitle: "Welcome Home",
      defaultDesc: "Arrival of your new partner and start of your journey together."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
            <Editable name="journey_title" defaultValue="Your Journey to Ownership" />
          </h2>
          <div className="text-lg text-slate-600 max-w-2xl mx-auto">
            <Editable 
              name="journey_desc" 
              defaultValue="We've streamlined the process of importing your dream horse into a simple, stress-free experience." 
              type="textarea"
            />
          </div>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:flex justify-between items-start relative max-w-6xl mx-auto">
          {/* Connector Line */}
          <div className="absolute top-8 left-0 w-full h-0.5 bg-slate-200 -z-10" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center w-40 group"
            >
              <div className="w-16 h-16 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-primary group-hover:border-primary/30 transition-all duration-300 shadow-sm z-10 mb-6">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">
                <Editable name={`journey_step_title_${step.key}`} defaultValue={step.defaultTitle} />
              </h3>
              <div className="text-sm text-slate-500 leading-snug">
                <Editable 
                  name={`journey_step_desc_${step.key}`} 
                  defaultValue={step.defaultDesc} 
                  type="textarea"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-8 max-w-md mx-auto relative">
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-200 -z-10" />
          {steps.map((step, idx) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="w-16 h-16 shrink-0 bg-white rounded-full border-4 border-slate-100 flex items-center justify-center text-slate-400 shadow-sm z-10">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="pt-2">
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  <Editable name={`journey_step_title_${step.key}`} defaultValue={step.defaultTitle} />
                </h3>
                <div className="text-slate-600 text-sm">
                  <Editable 
                    name={`journey_step_desc_${step.key}`} 
                    defaultValue={step.defaultDesc} 
                    type="textarea"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/horses">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-6 text-lg font-semibold shadow-lg shadow-primary/20">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JourneyToOwnershipSection;