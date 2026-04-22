import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTestimonials } from '@/hooks/usePageData.js';

const TestimonialsSection = () => {
  const { testimonials, loading } = useTestimonials(3);

  return (
    <section className="section-container bg-slate-50 border-y border-slate-200">
      <div className="section-content">
          <div className="section-header">
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Trusted Worldwide</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Read what our international clients have to say about their experience with Titan Stables.</p>
          </div>
          {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>)}
               </div>
          ) : testimonials && testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map(testimonial => (
                      <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
                          <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-100" />
                          <div className="flex text-[#D4AF37] mb-4">
                              {[...Array(testimonial.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                          </div>
                          <p className="text-slate-700 italic mb-6 relative z-10">"{testimonial.content}"</p>
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                  {(testimonial.customers?.first_name?.[0] || testimonial.title?.[0] || 'T').toUpperCase()}
                              </div>
                              <div>
                                  <p className="font-bold text-slate-900 text-sm">{testimonial.customers?.first_name} {testimonial.customers?.last_name || testimonial.title}</p>
                                  <p className="text-xs text-slate-500">{testimonial.customers?.country || 'Verified Buyer'}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-center text-slate-500">Check out our social media for community reviews!</p>
          )}
      </div>
    </section>
  );
};

export default TestimonialsSection;