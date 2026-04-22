import React from 'react';
import { motion } from 'framer-motion';

const ProcessCard = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-card border border-border rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 p-8 flex flex-col items-start"
  >
    <div className="text-4xl font-serif font-bold text-secondary mb-4">{number}</div>
    <h3 className="text-xl font-serif font-bold text-primary mb-3">{title}</h3>
    <p className="text-foreground leading-relaxed font-light">{description}</p>
  </motion.div>
);

const ReservationProcess = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            How the Reservation Works
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProcessCard 
            number="01"
            title="Selection & Consultation"
            description="Begin your journey by selecting a premium KFPS registered Friesian. Our experts provide a personalized consultation and a comprehensive Pre-Purchase Evaluation to ensure the perfect match for your equestrian goals."
            delay={0.1}
          />
          <ProcessCard 
            number="02"
            title="Secure Deposit"
            description="Reserve your chosen horse with a secure deposit. We provide fully transparent documentation, secure payment gateways, and flexible terms to guarantee your peace of mind and protect your investment."
            delay={0.2}
          />
          <ProcessCard 
            number="03"
            title="Finalizing Import & Transport"
            description="We seamlessly manage all international logistics, strictly handling KFPS documentation, veterinary certificates, and safe, welfare-focused transport straight to your facility."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};

export default ReservationProcess;