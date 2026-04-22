import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqService } from '@/services/faqService';

export default function FAQAccordion({ faq, value }) {
  const handleExpand = () => {
    faqService.incrementViewCount(faq.id).catch(() => {});
  };

  return (
    <AccordionItem value={value} className="bg-white border border-slate-200 rounded-xl mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow px-2">
      <AccordionTrigger onClick={handleExpand} className="px-4 py-4 hover:no-underline group">
        <div className="flex flex-col items-start text-left w-full pr-4">
          <h3 className="text-lg font-serif font-bold text-[#0A1128] group-hover:text-primary transition-colors mb-2">
            {faq.question}
          </h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {faq.category}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 border-slate-200 text-slate-600">
              <MapPin className="w-3 h-3" /> {faq.geo_target}
            </Badge>
            {faq.is_featured && (
              <Badge className="bg-[#D4AF37] text-white hover:bg-[#b5952f]">Featured</Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="prose prose-slate max-w-none"
          >
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
            
            {faq.image_url && (
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                <img src={faq.image_url} alt="FAQ Visual" className="w-full max-h-80 object-cover" />
              </div>
            )}
            
            <div className="flex items-center gap-1 mt-4 text-xs text-slate-400">
              <Eye className="w-3 h-3" /> {faq.view_count || 0} views
            </div>
          </motion.div>
        </AnimatePresence>
      </AccordionContent>
    </AccordionItem>
  );
}