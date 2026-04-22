import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        {/* Email/Contact Page Button */}
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring' }}
        >
             <Link to="/contact">
                <Button 
                    size="icon" 
                    className="h-14 w-14 rounded-full bg-slate-900 border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    title="Contact Us"
                >
                    <Mail className="w-6 h-6" />
                </Button>
            </Link>
        </motion.div>
    </div>
  );
};

export default FloatingContact;