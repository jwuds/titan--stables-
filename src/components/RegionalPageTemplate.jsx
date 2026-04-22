import React from 'react';
import PageHeader from '@/components/PageHeader';
import SEO from '@/components/SEO';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Plane, FileCheck, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RegionalPageTemplate = ({ regionId, regionName, heroImage, description, contactInfo, timeline, pricing }) => {

  return (
    <>
      <SEO 
        title={`${regionName || 'Regional'} Friesian Importation Hub | Titan Stables`}
        description={`Expert KFPS Friesian importation services to ${regionName || 'your region'}. Complete quarantine, transport, and customs management.`}
        url={`/regional/${regionId || 'global'}`}
      />
      
      <PageHeader 
        pageName={`regional_${regionId || 'global'}`}
        defaultTitle={`${regionName || 'Regional'} Hub`}
        defaultSubtitle={description || ''}
        defaultBgImage={heroImage || ''}
        heightClass="h-[60vh]"
      />

      <div className="bg-slate-50 min-h-screen pb-24 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          
          <div className="grid lg:grid-cols-3 gap-8">
             {/* Left Column: Contact & Trust */}
             <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 transform -translate-y-12">
                   <h3 className="text-2xl font-heading font-bold mb-6 text-slate-900 border-b pb-4">Regional Office</h3>
                   <ul className="space-y-6">
                      <li className="flex gap-4 items-start">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                            <MapPin className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">Location</p>
                            <p className="text-slate-600 text-sm mt-1 whitespace-pre-line">{contactInfo?.address || 'Contact us for details'}</p>
                         </div>
                      </li>
                      <li className="flex gap-4 items-start">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                            <Phone className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">Direct Line</p>
                            <p className="text-slate-600 text-sm mt-1">{contactInfo?.phone || 'N/A'}</p>
                         </div>
                      </li>
                      <li className="flex gap-4 items-start">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                            <Mail className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">Email</p>
                            <p className="text-slate-600 text-sm mt-1">{contactInfo?.email || 'N/A'}</p>
                         </div>
                      </li>
                      <li className="flex gap-4 items-start">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                            <Clock className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm">Hours</p>
                            <p className="text-slate-600 text-sm mt-1">{contactInfo?.hours || 'N/A'}</p>
                         </div>
                      </li>
                   </ul>
                   <div className="mt-8 pt-6 border-t">
                      <Button className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-white rounded-full py-6 font-bold" asChild>
                         <Link to="/contact">Contact Representative</Link>
                      </Button>
                   </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden shadow-lg">
                   <div className="absolute right-0 top-0 opacity-10">
                      <ShieldCheck className="w-32 h-32 transform translate-x-8 -translate-y-8" />
                   </div>
                   <h3 className="text-xl font-heading font-bold mb-4 relative z-10 text-[#D4AF37]">The Titan Guarantee</h3>
                   <p className="text-slate-300 text-sm leading-relaxed relative z-10 mb-6">
                      Every importation through our {regionName || 'local'} hub is fully insured and handled by our dedicated logistics team, ensuring a stress-free experience from the Netherlands to your stable.
                   </p>
                   <ul className="space-y-2 text-sm text-slate-200 relative z-10 font-medium">
                      <li className="flex items-center gap-2">✓ Full Mortality Insurance</li>
                      <li className="flex items-center gap-2">✓ Veterinary Health Certificates</li>
                      <li className="flex items-center gap-2">✓ Quarantine Management</li>
                   </ul>
                </div>
             </div>

             {/* Right Column: Process & Details */}
             <div className="lg:col-span-2 space-y-12 lg:pt-8">
                
                <section>
                   <h2 className="text-3xl font-heading font-bold mb-8 text-slate-900 flex items-center gap-3">
                      <Plane className="w-8 h-8 text-primary" /> Importation to {regionName || 'Your Region'}
                   </h2>
                   <div className="prose max-w-none text-slate-600">
                      <p className="text-lg mb-6">
                         Importing a KFPS Friesian to {regionName || 'your region'} requires specific regulatory compliance. Our regional experts manage the entire process, allowing you to focus on welcoming your new horse.
                      </p>
                      
                      <div className="grid sm:grid-cols-2 gap-6 mt-8">
                         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3"><FileCheck className="w-5 h-5 text-[#D4AF37]" /> Required Documentation</h4>
                            <ul className="text-sm space-y-2 list-disc pl-5">
                               <li>Export Health Certificate</li>
                               <li>Blood Testing (CEM, EVA, etc.)</li>
                               <li>Customs Declaration</li>
                               <li>KFPS Registration Papers</li>
                            </ul>
                         </div>
                         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3"><Clock className="w-5 h-5 text-[#D4AF37]" /> Estimated Timeline</h4>
                            <ul className="text-sm space-y-2">
                               <li><strong className="text-slate-700">Pre-Export Prep:</strong> {timeline?.prep || 'TBD'}</li>
                               <li><strong className="text-slate-700">Flight/Transit:</strong> {timeline?.transit || 'TBD'}</li>
                               <li><strong className="text-slate-700">Quarantine:</strong> {timeline?.quarantine || 'TBD'}</li>
                               <li><strong className="text-slate-700">Total Time:</strong> {timeline?.total || 'TBD'}</li>
                            </ul>
                         </div>
                      </div>
                   </div>
                </section>

                <section className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                   <h2 className="text-2xl font-heading font-bold mb-6 text-slate-900 flex items-center gap-3">
                      <CircleDollarSign className="w-6 h-6 text-primary" /> Logistics & Pricing Overview
                   </h2>
                   <p className="text-slate-600 mb-6">Pricing varies based on flight availability, fuel surcharges, and specific quarantine facility requirements in {regionName || 'your region'}.</p>
                   
                   <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                      <div className="flex justify-between items-center p-4 border-b">
                         <span className="font-bold text-slate-700">Flight & Transport</span>
                         <span className="text-slate-900 font-medium">{pricing?.flight || 'Variable'}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 border-b">
                         <span className="font-bold text-slate-700">Quarantine Fees</span>
                         <span className="text-slate-900 font-medium">{pricing?.quarantine || 'Variable'}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-slate-50">
                         <span className="font-bold text-slate-700">Estimated Total Cost</span>
                         <span className="text-primary font-bold text-lg">{pricing?.total || 'Contact for Quote'}</span>
                      </div>
                   </div>
                   <p className="text-xs text-slate-500 mt-4 italic">* Prices are estimates and subject to change based on current market rates and specific regional port of entry.</p>
                </section>

             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegionalPageTemplate;