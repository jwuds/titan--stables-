import React from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { History, Globe, Shield, Crown } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const FriesianBreedHistoryPage = () => {
  return (
    <>
      <SEO 
        title="History of the Friesian Horse - Heritage & Origins | Titan Stables"
        description="Explore the rich history of the Friesian horse breed, from medieval war horses to modern dressage stars. Learn about their Dutch heritage and KFPS preservation."
        keywords="Friesian horse history, Friesian breed origin, KFPS history, Friesian heritage, baroque horse history"
        url="/breed-history"
      />
      
      <div className="bg-slate-50 min-h-screen pb-24">
        {/* Hero */}
        <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
           <img src="https://images.unsplash.com/photo-1551865108-4c172026b02d?q=80&w=2000" alt="Friesian History" className="absolute inset-0 w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/60" />
           <div className="relative z-10 text-center text-white px-4">
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">The Friesian Heritage</h1>
              <p className="text-xl max-w-2xl mx-auto font-light">A story of survival, nobility, and the "Black Pearl" of the Netherlands.</p>
           </div>
        </div>

        <Breadcrumbs items={[{ name: 'Breed History', path: '/breed-history' }]} />
        
        <div className="container mx-auto px-4 mt-12 max-w-4xl">
           <FadeIn>
             <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 mb-12">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                   <Globe className="w-8 h-8 text-primary" /> Origins in Friesland
                </h2>
                <div className="prose prose-lg text-slate-600">
                   <p>The Friesian horse is one of Europe's oldest horse breeds, originating in the province of Friesland in the northern Netherlands. Historical records indicate that horses very similar to the modern Friesian have existed in this region for centuries. The breed's history is inextricably linked to the history of the Dutch people—a history of resilience against the elements and pride in their native livestock.</p>
                   <p>During the Middle Ages, the ancestors of the Friesian were in great demand as war horses. Their size, strength, and ability to carry a knight in full armor, combined with a willingness to work, made them prized mounts across Europe.</p>
                </div>
             </div>
           </FadeIn>

           <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FadeIn delay={0.2}>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
                     <Crown className="w-10 h-10 text-primary mb-4" />
                     <h3 className="text-xl font-bold font-serif mb-4">Royal Carriage Horses</h3>
                     <p className="text-slate-600">
                        As armor fell out of use, the Friesian evolved. In the 18th and 19th centuries, they became the horse of choice for high-stepping carriage driving. Their spectacular trot, characterized by high knee action and suspension, made them symbols of status and wealth in royal courts.
                     </p>
                  </div>
              </FadeIn>
              <FadeIn delay={0.3}>
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
                     <History className="w-10 h-10 text-primary mb-4" />
                     <h3 className="text-xl font-bold font-serif mb-4">Near Extinction</h3>
                     <p className="text-slate-600">
                        Despite their popularity, the breed faced a crisis in the early 20th century. With the mechanization of farming, heavy draft horses were preferred, and the lighter, elegant Friesian numbers dwindled. By 1913, only three KFPS studbook stallions remained.
                     </p>
                  </div>
              </FadeIn>
           </div>

           <FadeIn delay={0.4}>
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 mb-12">
                 <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" /> The Modern KFPS Standard
                 </h2>
                 <div className="prose prose-lg text-slate-600">
                    <p>Thanks to a dedicated group of breeders who founded the <strong>Koninklijke Vereniging "Het Friesch Paarden-Stamboek" (KFPS)</strong>, the breed was saved. Today, the KFPS maintains one of the strictest studbooks in the world to ensure the purity and quality of the Friesian horse.</p>
                    <p>Modern breeding aims to produce a horse that is:</p>
                    <ul className="list-disc pl-6 space-y-2">
                       <li><strong>Functionally Built:</strong> Uphill conformation suitable for dressage and sport.</li>
                       <li><strong>True to Type:</strong> Retaining the baroque characteristics—jet black coat, abundant mane and tail, and noble head.</li>
                       <li><strong>Mentally Sound:</strong> Possessing the willing, gentle, and intelligent character the breed is famous for.</li>
                    </ul>
                 </div>
              </div>
           </FadeIn>
        </div>
      </div>
    </>
  );
};

export default FriesianBreedHistoryPage;