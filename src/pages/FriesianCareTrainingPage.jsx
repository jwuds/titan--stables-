import React from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Heart, Activity, Utensils, Scissors } from 'lucide-react';

const FriesianCareTrainingPage = () => {
  return (
    <>
      <SEO 
        title="Friesian Horse Care & Training Guide | Titan Stables"
        description="Expert advice on caring for and training Friesian horses. Nutrition, grooming tips for black coats, and exercise requirements for this unique breed."
        keywords="Friesian horse care, feeding friesian horse, grooming friesian mane, friesian health issues"
        url="/care-training"
      />
      
      <div className="bg-slate-50 min-h-screen pb-24">
        <div className="bg-slate-900 text-white py-16">
           <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Care & Training</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">Special considerations for the Black Pearl.</p>
           </div>
        </div>

        <Breadcrumbs items={[{ name: 'Care & Training', path: '/care-training' }]} />
        
        <div className="container mx-auto px-4 mt-12 max-w-4xl space-y-12">
            
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full text-primary"><Utensils /></div>
                  <h2 className="text-2xl font-serif font-bold">Nutrition Guidelines</h2>
               </div>
               <div className="prose prose-slate max-w-none">
                  <p>Friesians are generally easy keepers but have specific needs due to their heavy muscle mass and bone density.</p>
                  <ul>
                     <li><strong>Forage First:</strong> High-quality grass hay should form the basis of the diet.</li>
                     <li><strong>Trace Minerals:</strong> Copper and Zinc are crucial for maintaining the deep black coat color. Deficiencies can lead to sun bleaching (reddening).</li>
                     <li><strong>Avoid High Sugar:</strong> Like many draft breeds, they can be prone to metabolic issues. Low starch/sugar feeds are recommended.</li>
                  </ul>
               </div>
            </section>

             <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full text-primary"><Scissors /></div>
                  <h2 className="text-2xl font-serif font-bold">Grooming & Coat Care</h2>
               </div>
               <div className="prose prose-slate max-w-none">
                  <p>The hallmark of the breed is the long, flowing mane, tail, and feathers (leg hair).</p>
                  <ul>
                     <li><strong>Feathers:</strong> Must be kept clean and dry to prevent "scratches" (bacterial/fungal dermatitis). Do not clip them if you intend to inspect or show.</li>
                     <li><strong>Mane & Tail:</strong> Often kept braided to prevent breakage. Never brush a dry tail; use detangler and pick by hand.</li>
                     <li><strong>Sun Protection:</strong> To maintain the jet-black coat, horses are often turned out at night or wear UV sheets during peak sun hours in summer.</li>
                  </ul>
               </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full text-primary"><Activity /></div>
                  <h2 className="text-2xl font-serif font-bold">Training Considerations</h2>
               </div>
               <div className="prose prose-slate max-w-none">
                  <p>Friesians mature slower than light horse breeds. Skeletal maturity may not be complete until age 6-7.</p>
                  <ul>
                     <li><strong>Start Slow:</strong> Avoid intense collection or heavy impact work at young ages (3-4 years). Focus on long-and-low stretching to build back strength.</li>
                     <li><strong>Endurance:</strong> They have smaller hearts and lungs relative to body size compared to Thoroughbreds. Interval training helps build stamina safely.</li>
                     <li><strong>Mental:</strong> They are highly intelligent and willing. Harsh methods usually backfire; they respond best to clear, fair, positive reinforcement.</li>
                  </ul>
               </div>
            </section>

        </div>
      </div>
    </>
  );
};

export default FriesianCareTrainingPage;