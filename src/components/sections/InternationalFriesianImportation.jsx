import React from 'react';
import { Plane, FileText, Activity, Shield } from 'lucide-react';

const InternationalFriesianImportation = () => {
  const steps = [
    {
      icon: FileText,
      title: "Export Documentation",
      description: "We handle all complex paperwork, including USDA/CFIA and European health certificates required for international travel."
    },
    {
      icon: Activity,
      title: "Veterinary Clearance",
      description: "Comprehensive CEM, EVA, and general health testing coordinated with approved government veterinarians."
    },
    {
      icon: Shield,
      title: "Global Quarantine",
      description: "Seamless management of mandatory pre-export and post-arrival quarantine periods in premium facilities."
    },
    {
      icon: Plane,
      title: "Flight Logistics",
      description: "First-class equine air travel arrangements with experienced grooms and climate-controlled environments."
    }
  ];

  return (
    <section className="section-container bg-[#0A1128] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none"></div>

      <div className="section-content relative z-10">
        <div className="section-header">
          <div className="inline-block bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
            Worldwide Expertise
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            International Friesian Importation
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-sans max-w-3xl mx-auto font-light leading-relaxed">
            Securing a premium KFPS registered Friesian horse from overseas should be a seamless experience. Our dedicated logistics team specializes in international importation, managing every detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-slate-900 border border-white/10 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-colors duration-300 group">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                <step.icon className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">{step.title}</h3>
              <p className="text-slate-400 font-sans text-base leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternationalFriesianImportation;