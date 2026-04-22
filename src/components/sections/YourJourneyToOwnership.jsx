import React from 'react';
import { Search, MessagesSquare, FileSignature, Truck, HeartHandshake } from 'lucide-react';

const YourJourneyToOwnership = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Browse & Select",
      desc: "Explore our curated collection of KFPS registered Friesians to find your perfect match."
    },
    {
      icon: MessagesSquare,
      title: "2. Consultation",
      desc: "Speak with our experts to discuss the horse's suitability, temperament, and your goals."
    },
    {
      icon: FileSignature,
      title: "3. Agreement & Vetting",
      desc: "Review comprehensive veterinary records and finalize the purchase agreement securely."
    },
    {
      icon: Truck,
      title: "4. Logistics & Delivery",
      desc: "We coordinate all quarantine, flight, and domestic transport to your stable's door."
    },
    {
      icon: HeartHandshake,
      title: "5. Ownership & Support",
      desc: "Welcome your Titan home. Enjoy ongoing support and guidance from our dedicated team."
    }
  ];

  return (
    <section className="section-container bg-white">
      <div className="section-content">
        <div className="section-header">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
            Your Journey to <span className="text-primary">Ownership</span>
          </h2>
          <p className="text-lg text-slate-600 font-sans max-w-3xl mx-auto">
            Acquiring a Titan Stables Friesian is a transparent, secure, and fully guided process.
          </p>
        </div>

        <div className="relative mt-16 max-w-5xl mx-auto">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white border-4 border-slate-50 shadow-xl rounded-full flex items-center justify-center mb-6 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif">{step.title}</h3>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default YourJourneyToOwnership;