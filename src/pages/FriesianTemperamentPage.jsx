import React from 'react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Heart, Smile, Brain } from 'lucide-react';

const FriesianTemperamentPage = () => {
  return (
    <>
      <SEO 
        title="Friesian Horse Temperament & Personality | Titan Stables"
        description="Discover the unique temperament of the Friesian horse. Known for their gentle nature, willingness to work, and people-oriented personality."
        keywords="Friesian horse temperament, are friesian horses friendly, friesian horse personality, family horse breed"
        url="/temperament"
      />
      
      <div className="bg-slate-50 min-h-screen pb-24">
        <div className="bg-slate-900 text-white py-16">
           <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">The Golden Character</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">Why Friesians are often called the "Labrador Retrievers" of the horse world.</p>
           </div>
        </div>

        <Breadcrumbs items={[{ name: 'Temperament', path: '/temperament' }]} />
        
        <div className="container mx-auto px-4 mt-12 max-w-4xl space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">People-Oriented</h3>
                    <p className="text-slate-600 text-sm">They actively seek out human companionship, often following their owners around the paddock.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <Brain className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Highly Intelligent</h3>
                    <p className="text-slate-600 text-sm">Quick learners who retain what they are taught. This makes them trainable but requires consistency.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                    <Smile className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Cool Headed</h3>
                    <p className="text-slate-600 text-sm">Generally less spooky than other sport breeds, making them excellent confidence builders.</p>
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-3xl font-serif font-bold mb-6">Suitability for Riders</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-primary mb-2">For Amateurs</h3>
                        <p className="text-slate-600">The Friesian is widely considered one of the best breeds for adult amateurs. Their forgiving nature and lack of "hotness" make them safe and enjoyable partners for those who want to enjoy riding without constant battles.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-primary mb-2">For Professionals</h3>
                        <p className="text-slate-600">While gentle, they are powerful athletes. A talented Friesian has the collection and presence to compete at the FEI levels in Dressage, offering a spectacular ride for the professional.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default FriesianTemperamentPage;