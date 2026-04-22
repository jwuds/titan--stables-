
import React from 'react';
import { Link } from 'react-router-dom';
import SocialMediaIcons from './SocialMediaIcons';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { formatPhoneNumber } from '@/lib/phoneFormatter';

const Footer = () => {
  const { getSettingByKey, loading } = useGlobalSettings();

  const companyName = getSettingByKey('company_name') || 'TITAN STABLES';
  const whatsappNumber = getSettingByKey('primary_whatsapp') || '+1 (434) 253-5844';
  const emailAddress = getSettingByKey('primary_email') || 'support@titanstables.org';

  return (
    <footer className="bg-[#0A1128] pt-16 pb-6 w-full border-t-4 border-[#D4AF37] mt-auto text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-16">
          
          {/* Column 1: Company Info */}
          <div className="flex flex-col items-start">
            <Link to="/" className="inline-block mb-4">
              <span className="text-[#D4AF37] text-2xl font-serif font-bold tracking-widest block uppercase hover:text-white transition-colors duration-300">
                {companyName}
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light max-w-xs">
              Premium KFPS Friesian Importation & Care. Dedicated to excellence, connecting passionate equestrians with the world's most majestic horses.
            </p>
            <SocialMediaIcons />
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start">
            <h3 className="text-[#D4AF37] text-lg font-serif font-bold mb-4 uppercase tracking-wider">Quick Links</h3>
            <nav className="flex flex-col w-full space-y-3">
              <Link to="/" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">About Us</Link>
              <Link to="/horses" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Our Horses</Link>
              <Link to="/blog" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Journal & News</Link>
              <Link to="/contact" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Contact</Link>
              <Link to="/locations" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Global Locations</Link>
            </nav>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col items-start">
            <h3 className="text-[#D4AF37] text-lg font-serif font-bold mb-4 uppercase tracking-wider">Services</h3>
            <nav className="flex flex-col w-full space-y-3">
              <Link to="/services" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Horse Breeding</Link>
              <Link to="/services" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Training Programs</Link>
              <Link to="/facility" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Horse Boarding</Link>
              <Link to="/services" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Veterinary Services</Link>
              <Link to="/gallery" className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light">Our Facility</Link>
              <Link to="/admin-login" className="text-gray-500 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-light mt-2">Admin Portal</Link>
            </nav>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col items-start">
            <h3 className="text-[#D4AF37] text-lg font-serif font-bold mb-4 uppercase tracking-wider">Contact Us</h3>
            <div className="flex flex-col space-y-3 text-sm font-light text-gray-300">
              <p className="flex flex-col">
                <span className="text-[#D4AF37] font-semibold mb-1">Address:</span>
                13486 Cedar View Rd<br />
                Drewryville, VA 23844, USA
              </p>
              <p className="flex flex-col">
                <span className="text-[#D4AF37] font-semibold mb-1">Phone / WhatsApp:</span>
                {!loading ? formatPhoneNumber(whatsappNumber) : 'Loading...'}
              </p>
              <p className="flex flex-col">
                <span className="text-[#D4AF37] font-semibold mb-1">Email:</span>
                {emailAddress}
              </p>
              <p className="flex flex-col">
                <span className="text-[#D4AF37] font-semibold mb-1">Hours:</span>
                Mon - Sat: 8:00 AM - 6:00 PM<br />
                Sun: Closed
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left font-light">
            © {new Date().getFullYear()} {companyName}. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 font-light">
            <Link to="/policies" className="hover:text-[#D4AF37] transition-colors duration-300">Privacy Policy</Link>
            <span className="text-gray-700 hidden md:inline">|</span>
            <Link to="/policies" className="hover:text-[#D4AF37] transition-colors duration-300">Terms of Service</Link>
            <span className="text-gray-700 hidden md:inline">|</span>
            <Link to="/sitemap" className="hover:text-[#D4AF37] transition-colors duration-300">Sitemap</Link>
            <span className="text-gray-700 hidden md:inline">|</span>
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors duration-300">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
