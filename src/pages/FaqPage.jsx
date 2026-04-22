import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const heroImages = ["https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2000"];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(faqs.map(f => f.category).filter(Boolean))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="Frequently Asked Questions About Friesian Horses"
        description="Find answers to common questions about buying, caring for, and training Friesian horses at Titan Stables."
        keywords="Friesian horse FAQ, horse care questions, buying Friesian horses"
        url="/faq"
      />
      
      <PageHeader 
        pageName="faq" 
        defaultTitle="Frequently Asked Questions" 
        defaultSubtitle="Everything you need to know about our process, care, and purchase guidelines."
        images={heroImages}
        heightClass="h-[50vh]"
      />
      
      <Breadcrumbs items={[{ name: 'FAQ', path: '/faq' }]} />

      <section className="py-16 bg-slate-50 min-h-[50vh]">
        <div className="container mx-auto px-4 max-w-4xl">
           
           <div className="bg-white rounded-xl shadow-lg p-6 -mt-24 relative z-10 mb-12 border border-slate-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                 <div className="relative w-full md:w-auto md:flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input 
                       placeholder="Search questions..." 
                       className="pl-9 bg-slate-50 border-slate-200" 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                       <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                             activeCategory === cat 
                                ? 'bg-primary text-white' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                       >
                          {cat}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           {loading ? (
             <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
           ) : (
             <FadeIn>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`item-${index}`} className="border-b border-slate-100 last:border-0 px-6">
                        <AccordionTrigger className="hover:no-underline py-6 text-left">
                           <span className="font-serif font-bold text-lg text-slate-900">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 leading-relaxed pb-6 text-base">
                           {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {filteredFaqs.length === 0 && (
                     <div className="p-12 text-center text-slate-500">
                        No questions found matching your criteria.
                     </div>
                  )}
                </div>
             </FadeIn>
           )}
        </div>
      </section>
    </>
  );
};

export default FaqPage;