import React from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { DollarSign, BarChart, CheckCircle } from 'lucide-react';

const FriesianPricingPage = () => {
  return (
    <>
      <SEO 
        title="Friesian Horse Pricing Guide - Understanding Cost Factors | Titan Stables"
        description="Understand the factors that influence the price of a Friesian horse. From pedigree and training to age and gender, learn what determines market value."
        keywords="Friesian horse price, cost of Friesian horse, buying a Friesian, expensive horse breeds"
        url="/friesian-pricing"
      />
      
      <div className="bg-slate-50 min-h-screen pb-24">
        <div className="bg-slate-900 text-white py-16">
           <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Understanding Friesian Pricing</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">Why does one Friesian cost $15,000 and another $150,000?</p>
           </div>
        </div>

        <Breadcrumbs items={[{ name: 'Pricing Guide', path: '/friesian-pricing' }]} />
        
        <div className="container mx-auto px-4 mt-12 max-w-4xl space-y-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
               <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2"><BarChart className="text-primary" /> Key Value Factors</h2>
               <div className="grid md:grid-cols-2 gap-8">
                  <div>
                     <h3 className="font-bold text-lg mb-2">1. Pedigree & Papers</h3>
                     <p className="text-slate-600 mb-4">Horses registered with the main studbook (KFPS) command higher prices. Full papered horses (mother, grandmother, great-grandmother all Star/Model/Pref) are significantly more valuable.</p>
                  </div>
                  <div>
                     <h3 className="font-bold text-lg mb-2">2. Training Level</h3>
                     <p className="text-slate-600 mb-4">A green broke horse is affordable. A horse successfully competing at 3rd Level or Prix St. Georges Dressage represents years of professional investment and is priced accordingly.</p>
                  </div>
                  <div>
                     <h3 className="font-bold text-lg mb-2">3. Conformation & Movement</h3>
                     <p className="text-slate-600 mb-4">Horses with "Ster" (Star), "Kroon" (Crown), or "Model" predicates have been judged by Dutch inspectors to be in the top percentage of the breed.</p>
                  </div>
                  <div>
                     <h3 className="font-bold text-lg mb-2">4. Age & Gender</h3>
                     <p className="text-slate-600 mb-4">Mares are often prized for breeding. Stallions with potential for approval are rare and expensive. Geldings are the standard for riding and are generally priced based on ability.</p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-100 p-8 rounded-xl border border-slate-200">
               <h2 className="text-2xl font-serif font-bold mb-4">Typical Price Ranges</h2>
               <p className="text-sm text-slate-500 mb-6 italic">*Estimates based on current international market conditions for KFPS registered horses.</p>
               
               <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm">
                     <span className="font-medium">Weanling Foals</span>
                     <span className="font-bold text-slate-900">$10,000 - $20,000</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm">
                     <span className="font-medium">Young Horse (Unbroken, 2-3 yrs)</span>
                     <span className="font-bold text-slate-900">$18,000 - $35,000</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm">
                     <span className="font-medium">Started Under Saddle (Basic)</span>
                     <span className="font-bold text-slate-900">$35,000 - $55,000</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm">
                     <span className="font-medium">Ster Mare / High Quality Gelding</span>
                     <span className="font-bold text-slate-900">$50,000 - $85,000</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm border-l-4 border-primary">
                     <span className="font-medium">FEI Level / Approved Stallion / Model Mare</span>
                     <span className="font-bold text-primary">$100,000+</span>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default FriesianPricingPage;