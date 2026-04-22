import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Printer, X, Check, Award, HeartPulse, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockHorses = [
  {
    id: 1,
    name: 'Teunis van de Hei',
    age: 5,
    gender: 'Stallion',
    color: 'True Black',
    price: '$85,000',
    bloodline: 'Jasper 366 x Tsjalke 397',
    health: 'Excellent',
    training: 'Z1 Dressage',
    traits: ['Exceptional Trot', 'Calm Temperament'],
    kfps: true,
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a'
  },
  {
    id: 2,
    name: 'Boudewijn R.',
    age: 7,
    gender: 'Gelding',
    color: 'Black',
    price: '$65,000',
    bloodline: 'Beart 411 x Norbert 444',
    health: 'Excellent',
    training: 'M2 Dressage',
    traits: ['Strong Build', 'Willing to learn'],
    kfps: true,
    image: 'https://images.unsplash.com/photo-1599053581540-248ea75b59cb'
  }
];

const HorseComparisonTool = ({ horses = mockHorses, onRemove }) => {
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Comparison link copied to clipboard.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!horses || horses.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-serif border-2 border-dashed border-slate-200 rounded-2xl">Select horses to compare</div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 max-w-6xl mx-auto my-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">Compare Horses</h2>
            <p className="text-slate-500 mt-1">Detailed side-by-side analysis of your selected Friesians.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrint} variant="outline" className="rounded-full border-slate-200 hover:border-[#D4AF37] hover:text-[#D4AF37]">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button onClick={handleShare} className="rounded-full bg-slate-900 text-white hover:bg-[#D4AF37]">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
        {horses.map(horse => (
          <Card key={horse.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col h-full">
            <button 
              onClick={() => onRemove && onRemove(horse.id)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="h-48 overflow-hidden relative">
              <img src={horse.image} alt={horse.name} className="w-full h-full object-cover" />
              {horse.kfps && (
                <div className="absolute bottom-3 left-3 bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                   <Award className="w-3 h-3" /> KFPS
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-4">{horse.name}</h3>
              
              <div className="space-y-4 text-sm flex-grow">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Price</span>
                  <span className="font-bold text-slate-900">{horse.price}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Age</span>
                  <span className="font-medium text-slate-900">{horse.age} Years</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Gender</span>
                  <span className="font-medium text-slate-900">{horse.gender}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Bloodline</span>
                  <span className="font-medium text-slate-900 text-right max-w-[60%]">{horse.bloodline}</span>
                </div>
                
                <div className="pt-2">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
                        <HeartPulse className="w-3.5 h-3.5 text-red-400" /> Health
                    </span>
                    <p className="font-medium text-slate-800">{horse.health}</p>
                </div>

                <div className="pt-2">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
                        <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" /> Training & Traits
                    </span>
                    <div className="bg-slate-50 rounded-lg p-3 space-y-1.5">
                        <div className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-slate-700">{horse.training}</span>
                        </div>
                        {horse.traits.map((trait, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                <span className="text-slate-700">{trait}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-slate-900 text-white hover:bg-[#D4AF37] rounded-xl font-bold">
                Inquire Now
              </Button>
            </div>
          </Card>
        ))}
        
        {horses.length < 3 && (
            <div className="border-2 border-dashed border-slate-200 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 group hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#D4AF37] group-hover:scale-110 transition-all mb-4">
                    <span className="text-3xl leading-none">+</span>
                </div>
                <h4 className="font-heading font-bold text-lg text-slate-800 mb-2">Add Another Horse</h4>
                <p className="text-sm text-slate-500 max-w-[200px]">Select up to 3 horses to compare side-by-side.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HorseComparisonTool;