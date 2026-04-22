import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Heart, Award, Gem, Clock } from 'lucide-react';
import Editable from '@/components/Editable';

const PremiumBadgesSection = () => {
  const badges = [
    {
      icon: Shield,
      key: "ktpa",
      defaultTitle: "KTPA Registered",
      defaultSub: "Certified Member"
    },
    {
      icon: Star,
      key: "rhana",
      defaultTitle: "RHANA Member",
      defaultSub: "Active Standing"
    },
    {
      icon: Heart,
      key: "health",
      defaultTitle: "Health Guarantee",
      defaultSub: "1-Year Coverage"
    },
    {
      icon: Award,
      key: "expert",
      defaultTitle: "Expert Breeder",
      defaultSub: "Award Winning"
    },
    {
      icon: Gem, // Using Gem as abstract for "Tribal"/Bloodline quality
      key: "tribal",
      defaultTitle: "Tribal Breeding",
      defaultSub: "Elite Bloodlines"
    },
    {
      icon: Clock,
      key: "years",
      defaultTitle: "30+ Years",
      defaultSub: "Legacy of Trust"
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-100 relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, idx) => (
            <motion.div
              key={badge.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center hover:bg-white hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="mb-3 p-2 bg-white rounded-full shadow-sm text-primary/80 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                <badge.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-sm font-bold text-slate-900 mb-1 leading-tight">
                <Editable name={`badge_title_${badge.key}`} defaultValue={badge.defaultTitle} />
              </h3>
              
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                <Editable name={`badge_sub_${badge.key}`} defaultValue={badge.defaultSub} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumBadgesSection;