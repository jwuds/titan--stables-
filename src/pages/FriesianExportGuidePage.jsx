import React from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Plane, FileCheck, Map, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FriesianExportGuidePage = () => {
  return (
    <>
      <SEO 
        title="International Horse Export Guide | Titan Stables"
        description="A complete guide to exporting Friesian horses from the USA. Learn about health certificates, quarantine, air transport, and customs clearance."
        keywords="horse export guide, international horse shipping, buying horse from USA, equine air transport"
        url="/export-guide"
      />
      
      <div className="bg-slate-50 min-h-screen pb-24">
        <div className="bg-slate-900 text-white py-16">
           <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">International Export Guide</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">We make bringing your dream horse home simple, no matter where you live.</p>
           </div>
        </div>

        <Breadcrumbs items={[{ name: 'Export Guide', path: '/export-guide' }]} />
        
        <div className="container mx-auto px-4 mt-12 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
               <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary">
                  <h2 className="text-2xl font-serif font-bold mb-4">The Process</h2>
                  <ol className="space-y-4 relative border-l border-slate-200 ml-2 pl-6">
                     <li className="relative">
                        <span className="absolute -left-[30px] w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
                        <strong className="block text-slate-900">Purchase & Vetting</strong>
                        <span className="text-sm text-slate-500">Exam completed and funds cleared.</span>
                     </li>
                     <li className="relative">
                        <span className="absolute -left-[30px] w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
                        <strong className="block text-slate-900">Export Bloodwork</strong>
                        <span className="text-sm text-slate-500">Testing for diseases like EIA, EVA, Piroplasmosis (depends on destination).</span>
                     </li>
                     <li className="relative">
                        <span className="absolute -left-[30px] w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</span>
                        <strong className="block text-slate-900">Health Certificate</strong>
                        <span className="text-sm text-slate-500">USDA endorsement of international health papers.</span>
                     </li>
                     <li className="relative">
                        <span className="absolute -left-[30px] w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">4</span>
                        <strong className="block text-slate-900">Quarantine & Flight</strong>
                        <span className="text-sm text-slate-500">Transport to quarantine facility before flying.</span>
                     </li>
                  </ol>
               </div>

               <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4">
                     <Clock className="w-8 h-8 text-primary shrink-0" />
                     <div>
                        <h3 className="font-bold text-lg">Timeline</h3>
                        <p className="text-slate-600 text-sm">Typically 3-6 weeks from purchase to landing, depending on destination requirements and flight availability.</p>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4">
                     <FileCheck className="w-8 h-8 text-primary shrink-0" />
                     <div>
                        <h3 className="font-bold text-lg">Documentation</h3>
                        <p className="text-slate-600 text-sm">We handle 100% of the paperwork. You just need to be ready to receive your horse.</p>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4">
                     <Plane className="w-8 h-8 text-primary shrink-0" />
                     <div>
                        <h3 className="font-bold text-lg">Shipping Partners</h3>
                        <p className="text-slate-600 text-sm">We work with top agents like Dutta Corp, Mersant, and IRT to ensure safety.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-primary text-white p-8 rounded-2xl text-center">
               <h2 className="text-2xl font-serif font-bold mb-4">Ready to Import?</h2>
               <p className="mb-6 max-w-xl mx-auto">Contact our logistics team for a specific quote to your nearest major airport.</p>
               <Link to="/contact">
                  <Button variant="secondary" size="lg" className="rounded-full">Request Shipping Quote</Button>
               </Link>
            </div>
        </div>
      </div>
    </>
  );
};

export default FriesianExportGuidePage;