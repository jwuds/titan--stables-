import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { generateFAQSchema } from '@/components/SchemaMarkup';
import { Helmet } from 'react-helmet';

const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const defaultFaqs = [
    { question: "What makes Titan Stables' Friesians unique?", answer: "We specialize in KFPS-registered Friesians, focusing on traditional Baroque conformation, exceptional dressage movement, and sound health." },
    { question: "How much does a premium Friesian cost?", answer: "Prices vary based on age, training, pedigree, and KFPS status, typically ranging from $25,000 to over $100,000 for elite imported stock." },
    { question: "What is the average lifespan of a Friesian?", answer: "With proper care, a Friesian horse typically lives between 15 to 25 years, though many thrive well into their late twenties." },
    { question: "Do you offer training services?", answer: "Yes, we provide professional dressage and driving training programs tailored to each individual horse's potential and the owner's goals." },
    { question: "What does your care program include?", answer: "Our premium care program includes tailored nutrition, daily exercise, top-tier veterinary care, and regular farrier and dental services." },
    { question: "How often should a Friesian be exercised?", answer: "Friesians require regular daily exercise, including turnout time and structured training sessions, typically 5-6 days a week to maintain optimal health and fitness." },
    { question: "What is the ideal diet for a Friesian?", answer: "Friesians thrive on high-quality forage, balanced with specialized concentrated feeds that support their unique metabolism and muscular build." },
    { question: "Are Friesians suitable for beginners?", answer: "While powerful, Friesians are known for their gentle and willing temperament. Many are excellent for confident beginners under professional guidance." },
    { question: "What health issues are common in the breed?", answer: "We actively screen for known genetic conditions like dwarfism and hydrocephalus, and strictly manage diet to prevent issues like colic and laminitis." },
    { question: "How do you help me select the right horse?", answer: "We conduct thorough consultations to understand your goals, riding level, and lifestyle, matching you with the perfect equine partner from our curated selection." }
  ];

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const faqSchema = generateFAQSchema(displayFaqs);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      
      <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {displayFaqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 focus:outline-none"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-slate-800 text-lg">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
            </button>
            
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 py-4 border-t border-slate-100 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;