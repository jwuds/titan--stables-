import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';

const FloatingWhatsApp = () => {
  const { getContent } = useContent();
  const whatsapp = getContent('contact_whatsapp', '+1 (276) 329 8032');
  const cleanNumber = whatsapp.replace(/[^0-9]/g, '');

  return (
    <motion.a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noreferrer noopener"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap ml-0 group-hover:ml-2 text-sm font-bold">
        Chat on WhatsApp
      </span>
    </motion.a>
  );
};

export default FloatingWhatsApp;