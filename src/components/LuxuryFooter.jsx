
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

const LuxuryFooter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/titanstables', icon: Facebook, hoverColor: 'hover:text-blue-600' },
    { name: 'Instagram', url: 'https://instagram.com/titanstables', icon: Instagram, hoverColor: 'hover:text-pink-600' },
    { name: 'Twitter', url: 'https://twitter.com/titanstables', icon: Twitter, hoverColor: 'hover:text-blue-400' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/titanstables', icon: Linkedin, hoverColor: 'hover:text-blue-700' },
    { name: 'YouTube', url: 'https://youtube.com/@titanstables', icon: Youtube, hoverColor: 'hover:text-red-600' }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setTimeout(() => {
      setSubscribed(true);
      toast({
        title: "Welcome to the Inner Circle",
        description: "You have successfully subscribed to our newsletter.",
      });
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }, 500);
  };

  return (
    <footer className="bg-[#0A1128] text-white relative overflow-hidden mt-auto border-t-[3px] border-[#D4AF37]">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 absolute top-0 left-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="flex flex-col items-start space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-[#D4AF37] text-3xl font-playfair font-bold tracking-widest uppercase hover:text-white transition-colors duration-300">
                Titan Stables
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed font-montserrat font-light max-w-sm">
              Premium KFPS Friesian Importation & Care. Dedicated to excellence, connecting passionate equestrians with the world's most majestic horses.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className={`text-gray-300 transition-all duration-300 hover:scale-125 ${social.hoverColor}`} aria-label={social.name}>
                  <social.icon size={20} />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 mt-4">
              <span className="text-xl">🇺🇸</span>
              <span className="text-xs font-montserrat font-medium text-gray-200 tracking-wider">PROUDLY BASED IN THE USA</span>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-[#D4AF37] text-xl font-playfair font-semibold mb-6 uppercase tracking-wider">Quick Links</h3>
            <nav className="flex flex-col w-full space-y-4 font-montserrat">
              <Link to="/horses" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 min-h-[44px]">
                <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                <span>View All Horses</span>
              </Link>
              <Link to="/faqs" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 min-h-[44px]">
                <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                <span>Frequently Asked Questions</span>
              </Link>
              <Link to="/gallery" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 min-h-[44px]">
                <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                <span>Our Facility</span>
              </Link>
              <Link to="/testimonials" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 min-h-[44px]">
                <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                <span>Client Testimonials</span>
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-[#D4AF37] text-xl font-playfair font-semibold mb-6 uppercase tracking-wider">Services</h3>
            <nav className="flex flex-col w-full space-y-4 font-montserrat">
              <Link to="/services/training" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 min-h-[44px]">
                <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                <span>Equestrian Training</span>
              </Link>
              <Link to="/services/boarding" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 min-h-[44px]">
                <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                <span>Premium Boarding</span>
              </Link>
              <Link to="/blog/care" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 min-h-[44px]">
                <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                <span>Friesian Care Guide</span>
              </Link>
              <Link to="/locations" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 min-h-[44px]">
                <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                <span>Global Locations</span>
              </Link>
            </nav>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-[#D4AF37] text-xl font-playfair font-semibold mb-6 uppercase tracking-wider">Contact Info</h3>
            <Link to="/contact" className="group flex items-center text-gray-300 hover:text-white transition-colors text-sm font-light py-1 mb-8 font-montserrat min-h-[44px]">
              <ChevronRight size={14} className="text-[#D4AF37] mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              <span>Get in Touch</span>
            </Link>

            <div className="w-full">
              <h4 className="text-white font-montserrat font-medium mb-3 text-sm tracking-widest uppercase">Join the Inner Circle</h4>
              <p className="text-gray-400 text-xs font-montserrat mb-4 font-light">Exclusive access to new arrivals and insights.</p>
              
              {subscribed ? (
                <div className="flex items-center space-x-3 bg-white/5 border border-[#D4AF37]/50 rounded-md p-4 animate-in fade-in zoom-in pulse-success">
                  <CheckCircle2 className="text-[#D4AF37] w-5 h-5" />
                  <span className="text-white text-sm font-montserrat font-medium">Subscription Confirmed</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    required
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm font-montserrat font-light py-3 px-4 rounded-md focus:outline-none focus:border-[#D4AF37] transition-all min-h-[44px]"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#D4AF37] hover:bg-[#b8952b] text-[#0A1128] px-4 rounded transition-all font-montserrat font-semibold text-xs uppercase tracking-wider"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 font-montserrat">
          <p className="text-gray-400 text-xs text-center md:text-left font-light tracking-wide">
            © {new Date().getFullYear()} TITAN STABLES. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-light tracking-wide uppercase">
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center">About Us</Link>
            <Link to="/policies" className="hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center">Privacy Policy</Link>
            <Link to="/policies" className="hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-success {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
        .pulse-success { animation: pulse-success 2s infinite; }
      `}} />
    </footer>
  );
};

export default LuxuryFooter;
