import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Lock, UserCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editable from '@/components/Editable';

const TitanGuaranteeSection = () => {
  const guarantees = [
    {
      icon: Shield,
      key: "health",
      defaultTitle: "Health Assurance",
      defaultDesc: "All horses undergo rigorous veterinary exams. We stand behind the health of every horse we sell."
    },
    {
      icon: CheckCircle,
      key: "authentic",
      defaultTitle: "Authentic Representation",
      defaultDesc: "We guarantee that the horse you see in photos and videos is exactly the horse you will receive."
    },
    {
      icon: Lock,
      key: "secure",
      defaultTitle: "Secure Purchase",
      defaultDesc: "Transparent contracts and secure payment methods ensure your transaction is safe and protected."
    },
    {
      icon: UserCheck,
      key: "support",
      defaultTitle: "Ongoing Support",
      defaultDesc: "Our team remains available for advice and guidance long after your horse arrives home."
    },
    {
      icon: Heart,
      key: "satisfaction",
      defaultTitle: "Satisfaction Commitment",
      defaultDesc: "We are dedicated to matching the right horse with the right rider for a successful partnership."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold uppercase tracking-wider text-sm">Our Promise To You</span>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mt-3 mb-6">
            <Editable name="guarantee_main_title" defaultValue="The Titan Guarantee" />
          </h2>
          <div className="text-lg text-slate-600">
            <Editable 
              name="guarantee_main_desc" 
              defaultValue="Peace of mind is standard with every purchase. We build our reputation on the success and happiness of our clients."
              type="textarea"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {guarantees.map((item, idx) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-slate-50 border border-slate-100 rounded-xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-md mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">
                <Editable name={`guarantee_title_${item.key}`} defaultValue={item.defaultTitle} />
              </h3>
              <div className="text-slate-600 text-sm leading-relaxed">
                <Editable 
                  name={`guarantee_desc_${item.key}`} 
                  defaultValue={item.defaultDesc} 
                  type="textarea"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/contact">
            <Button className="bg-slate-900 text-white hover:bg-primary rounded-full px-10 py-6 text-lg shadow-lg">
              Contact Our Team
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TitanGuaranteeSection;