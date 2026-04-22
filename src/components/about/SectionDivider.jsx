
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const SectionDivider = ({ showIcon = true }) => {
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent flex-1"></div>
          
          {showIcon && (
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              whileInView={{ opacity: 1, rotate: 360 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </motion.div>
          )}
          
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent flex-1"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionDivider;
