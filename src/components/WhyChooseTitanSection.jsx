import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, GraduationCap, Plane, HeartHandshake, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editable from '@/components/Editable';

const WhyChooseTitanSection = () => {
  const features = [
    {
      icon: Award,
      key: "bloodlines",
      defaultTitle: "Premium Bloodlines",
      defaultDesc: "Direct access to elite KFPS pedigrees, selected for conformation, movement, and gentle temperament."
    },
    {
      icon: ShieldCheck,
      key: "veterinary",
      defaultTitle: "Veterinary Standards",
      defaultDesc: "Comprehensive health screenings, X-rays, and clinical exams included with every horse for your peace of mind."
    },
    {
      icon: GraduationCap,
      key: "training",
      defaultTitle: "Professional Training",
      defaultDesc: "Horses are professionally started and schooled, ensuring a solid foundation and willing partnership."
    },
    {
      icon: Plane,
      key: "export",
      defaultTitle: "Global Logistics",
      defaultDesc: "Complete handling of quarantine, export documentation, and air transport to your nearest major airport."
    },
    {
      icon: HeartHandshake,
      key: "support",
      defaultTitle: "Lifetime Guidance",
      defaultDesc: "Our relationship doesn't end at delivery. We offer ongoing consultation for nutrition, training, and care."
    },
    {
      icon: Eye,
      key: "transparency",
      defaultTitle: "Total Transparency",
      defaultDesc: "Honest representation of each horse's ability and character, with no hidden fees or surprises."
    }
  ];

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-amber-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
            <Editable name="why_main_title" defaultValue="The Titan Standard" />
          </h2>
          <div className="text-lg text-slate-400">
            <Editable 
              name="why_main_desc" 
              defaultValue="We don't just sell horses; we curate lifelong partnerships founded on quality, trust, and expertise." 
              type="textarea"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-primary/50 shadow-inner">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-white group-hover:text-primary transition-colors">
                <Editable name={`why_title_${feature.key}`} defaultValue={feature.defaultTitle} />
              </h3>
              <div className="text-slate-400 leading-relaxed">
                <Editable 
                  name={`why_desc_${feature.key}`} 
                  defaultValue={feature.defaultDesc} 
                  type="textarea"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-6">
          <Link to="/about">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-white rounded-full px-8 py-6">
              Learn Our Philosophy
            </Button>
          </Link>
          <Link to="/facility">
            <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5 rounded-full px-8 py-6">
              View Our Facility
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTitanSection;