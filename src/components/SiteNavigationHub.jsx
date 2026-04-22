import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Home, Star, BookOpen, Mail, ArrowRight, User } from 'lucide-react';
import Editable from '@/components/Editable';

const SiteNavigationHub = () => {
  const hubs = [
    {
      title: "Our Horses",
      path: "/horses",
      icon: Sparkles,
      key: "horses",
      defaultDesc: "Browse our current collection of premium Friesian horses available for purchase."
    },
    {
      title: "Tack Shop",
      path: "/store",
      icon: ShoppingBag,
      key: "shop",
      defaultDesc: "Premium tack, equipment, and care products for your equine partner."
    },
    {
      title: "Facility",
      path: "/facility",
      icon: Home,
      key: "facility",
      defaultDesc: "Explore our world-class stables, training arenas, and pastures in Virginia."
    },
    {
      title: "Services",
      path: "/services",
      icon: Star,
      key: "services",
      defaultDesc: "Training, breeding, and consultation services tailored to your needs."
    },
    {
      title: "Journal",
      path: "/blog",
      icon: BookOpen,
      key: "journal",
      defaultDesc: "Read the latest news, educational articles, and stories from the stables."
    },
    {
      title: "About Us",
      path: "/about",
      icon: User,
      key: "about",
      defaultDesc: "Learn about our history, our team, and our philosophy of excellence."
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4">Explore More</h2>
          <p className="text-slate-400">Everything you need for your Friesian journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {hubs.map((item, idx) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Link 
                to={item.path}
                className="block h-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-primary/50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-900 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <div className="text-sm text-slate-400 leading-relaxed">
                  <Editable 
                    name={`hub_desc_${item.key}`} 
                    defaultValue={item.defaultDesc} 
                    type="textarea"
                    className="bg-transparent border-none text-slate-400 w-full p-0"
                    onClick={(e) => e.preventDefault()} // prevent link click when editing
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SiteNavigationHub;