import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQBlock({ content = {}, onChange, isEdit }) {
  const faqs = content.faqs || [];

  if (isEdit) {
    return (
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="p-4 border rounded bg-slate-50 relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500" onClick={() => {
              onChange({ ...content, faqs: faqs.filter((_, idx) => idx !== i) });
            }}><Trash className="w-4 h-4" /></Button>
            <Input 
              placeholder="Question" 
              value={faq.q || ''} 
              className="mb-2 pr-10 bg-white text-slate-900"
              onChange={(e) => {
                const newFaqs = [...faqs];
                newFaqs[i].q = e.target.value;
                onChange({ ...content, faqs: newFaqs });
              }}
            />
            <Textarea 
              placeholder="Answer" 
              value={faq.a || ''} 
              className="bg-white text-slate-900"
              onChange={(e) => {
                const newFaqs = [...faqs];
                newFaqs[i].a = e.target.value;
                onChange({ ...content, faqs: newFaqs });
              }}
            />
          </div>
        ))}
        <Button variant="outline" onClick={() => onChange({ ...content, faqs: [...faqs, { q: '', a: '' }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </div>
    );
  }

  if (!faqs.length) return null;

  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-semibold">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-slate-600">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}