import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const ExploreMore = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          Ready to Find Your Dream <span className="text-accent">Friesian?</span>
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Whether you are looking for a competition prospect or a gentle companion, our experts are here to guide you every step of the way. Let's begin the conversation.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/horses">
            <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-10 py-7 rounded-full text-lg shadow-xl transition-transform hover:-translate-y-1">
              Browse Available Horses <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 bg-white/10 hover:bg-white hover:text-primary text-white font-bold px-10 py-7 rounded-full text-lg backdrop-blur-sm transition-transform hover:-translate-y-1">
              Contact Our Experts
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/10 pt-12">
          <div className="flex flex-col items-center">
            <Mail className="w-6 h-6 text-accent mb-3" />
            <span className="text-sm font-semibold">Email Us</span>
            <span className="text-xs text-slate-300 mt-1">info@titanstables.org</span>
          </div>
          <div className="flex flex-col items-center">
            <PhoneCall className="w-6 h-6 text-accent mb-3" />
            <span className="text-sm font-semibold">Call Support</span>
            <span className="text-xs text-slate-300 mt-1">24/7 Global Assistance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif font-bold text-2xl text-accent mb-2">20+</span>
            <span className="text-sm font-semibold">Years Experience</span>
            <span className="text-xs text-slate-300 mt-1">In Friesian Breeding</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-serif font-bold text-2xl text-accent mb-2">100%</span>
            <span className="text-sm font-semibold">Health Guarantee</span>
            <span className="text-xs text-slate-300 mt-1">On All Horses</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreMore;