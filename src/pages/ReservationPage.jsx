import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getHorseById } from '@/data/horses';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ChevronRight, Award, Heart, Globe, Lock } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const ReservationPage = () => {
  const [searchParams] = useSearchParams();
  const horseId = searchParams.get('horseId');
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHorse = async () => {
      if (horseId) {
        const data = await getHorseById(horseId);
        setHorse(data);
      }
      setLoading(false);
    };
    fetchHorse();
  }, [horseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="animate-pulse text-[#C0C0C0] font-serif text-2xl">Preparing Reservation...</div>
      </div>
    );
  }

  if (!horse) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-serif text-[#0F0F0F] mb-4">Horse Not Found</h1>
        <p className="text-[#333333] mb-8 text-center max-w-md">We could not locate the horse for reservation. Please return to our collection.</p>
        <Link to="/horses">
          <Button className="bg-[#0F0F0F] text-white hover:bg-[#333333] min-h-[48px] px-8 text-lg rounded-xl">Browse Horses</Button>
        </Link>
      </div>
    );
  }

  const depositAmount = horse.price ? horse.price * 0.10 : 5000;
  const displayDeposit = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(depositAmount);

  return (
    <>
      <SEO 
        title={`Reserve ${horse.name} - Titan Stables`} 
        description="Securely reserve your premium KFPS registered Friesian horse. Learn about our commitment to excellence and international buyer standards."
      />
      
      {/* Hero Section */}
      <section className="bg-[#0F0F0F] text-white pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#333333] border border-[#C0C0C0]/30 text-xs font-bold uppercase tracking-widest mb-6 text-[#C0C0C0]">
                    <ShieldCheck className="w-4 h-4" /> Secure Reservation
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">Secure Your Premium Friesian</h1>
                <p className="text-xl text-[#C0C0C0] max-w-2xl mx-auto font-light">
                    Reserve Your KFPS Registered Friesian Horse
                </p>
            </motion.div>
        </div>
      </section>

      <div className="bg-[#F5F5F5] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl space-y-16">
            
            {/* Horse Details Section */}
            <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#C0C0C0]/50 flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 relative min-h-[300px] md:min-h-[400px]">
                    <img 
                        src={horse.images?.[0] || 'https://images.unsplash.com/photo-1613437190836-d59585104264'} 
                        alt={horse.name} 
                        className="absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-sm font-bold uppercase tracking-widest text-[#C0C0C0] mb-1">Selected Horse</p>
                        <h2 className="text-3xl font-serif font-bold">{horse.name}</h2>
                    </div>
                </div>
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                            <p className="text-sm text-[#333333] font-bold uppercase mb-1">Age & Gender</p>
                            <p className="text-lg text-[#0F0F0F]">{horse.age} yrs • {horse.gender}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#333333] font-bold uppercase mb-1">Height</p>
                            <p className="text-lg text-[#0F0F0F]">{horse.height}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#333333] font-bold uppercase mb-1">Training Level</p>
                            <p className="text-lg text-[#0F0F0F]">{horse.discipline}</p>
                        </div>
                        <div>
                            <p className="text-sm text-[#333333] font-bold uppercase mb-1">Registry</p>
                            <p className="text-lg text-[#0F0F0F] flex items-center gap-2"><Award className="w-5 h-5 text-[#C0C0C0]" /> KFPS Registered</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-[#F5F5F5]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <p className="text-sm text-[#333333] mb-1">Standard Deposit</p>
                                <p className="text-3xl font-bold text-[#0F0F0F]">{displayDeposit}</p>
                                <p className="text-xs text-[#333333] mt-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Fully refundable pending PPE</p>
                            </div>
                            <Button 
                                onClick={() => navigate(`/checkout?horseId=${horse.id}`)}
                                className="bg-[#C0C0C0] hover:bg-[#A0A0A0] text-[#0F0F0F] text-lg font-bold py-7 px-8 rounded-xl shadow-lg w-full sm:w-auto min-h-[56px] transition-all transform hover:scale-105"
                            >
                                Secure Your Reservation <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reservation Process */}
            <section>
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-serif font-bold text-[#0F0F0F] mb-4">How the Reservation Works</h3>
                    <p className="text-[#333333]">A transparent, secure process designed for international peace of mind.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { step: "01", title: "Selection & Consultation (with PPE)", desc: "Your deposit secures the horse and triggers a comprehensive veterinary Pre-Purchase Evaluation (PPE). You consult directly with our experts regarding the results." },
                        { step: "02", title: "Secure Deposit", desc: "A 10% fully refundable deposit removes the horse from the public market for 14 days, providing you exclusive rights to complete the evaluation process." },
                        { step: "03", title: "Finalizing Import & Transport", desc: "Upon your approval, we execute all KFPS transfer documentation, international health certificates, and coordinate premium door-to-door global transport." }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl border-2 border-[#C0C0C0]/40 shadow-sm relative overflow-hidden group hover:border-[#0F0F0F] transition-colors">
                            <div className="absolute top-0 right-0 bg-[#F5F5F5] text-[#C0C0C0] font-bold text-6xl opacity-30 -mr-4 -mt-4 p-4 rounded-bl-full select-none">{item.step}</div>
                            <h4 className="text-xl font-bold text-[#0F0F0F] mb-4 relative z-10 pr-8">{item.title}</h4>
                            <p className="text-[#333333] relative z-10 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Terms & Ethical Standards */}
            <section className="bg-[#FFFFFF] p-8 md:p-12 rounded-3xl shadow-lg border border-[#E5E5E5]">
                <div className="flex items-center gap-4 mb-8 border-b border-[#F5F5F5] pb-6">
                    <div className="bg-[#0F0F0F] p-4 rounded-2xl text-[#C0C0C0]"><Heart className="w-8 h-8" /></div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#0F0F0F]">Our Commitment to Excellence & Horse Welfare</h3>
                </div>
                <div className="prose prose-slate max-w-none text-[#333333] leading-loose space-y-6">
                    <p>
                        At Titan Stables, based in the heart of Virginia's equestrian country, our unwavering dedication to <strong>horse welfare standards</strong> defines every aspect of our business. We believe that securing a premium KFPS registered Friesian horse should be a journey marked by transparency, ethical practices, and profound respect for these magnificent animals.
                    </p>
                    <p>
                        Our <strong>international buyer policies</strong> are meticulously designed to protect both the purchaser and the equine athlete. Every horse presented in our collection has undergone rigorous conditioning prioritizing the classic Baroque silhouette without compromising joint longevity or mental health. We enforce strict biosecurity and veterinary protocols, ensuring that your future partner is not only athletically capable but fundamentally sound and happy.
                    </p>
                    <p>
                        <strong>KFPS Registration & Authenticity:</strong> We guarantee the authenticity of every horse we offer. Complete KFPS documentation, full pedigree tracing, and comprehensive health records accompany every sale. This transparent <strong>equestrian business standard</strong> ensures that your investment in a Dutch heritage Friesian is secure, legally robust, and internationally recognized.
                    </p>
                    <p>
                        The <strong>secure reservation process</strong> you are entering today is the first step in a lifelong partnership. By placing a fully refundable deposit, you ensure the horse is held exclusively for your consideration while we facilitate an independent Pre-Purchase Evaluation. We manage all logistics—from USDA/CFIA health certificates to premium, stress-free global transport—allowing you to focus entirely on welcoming your new Friesian home.
                    </p>
                </div>
                <div className="mt-12 text-center">
                    <Button 
                        onClick={() => navigate(`/checkout?horseId=${horse.id}`)}
                        className="bg-[#C0C0C0] hover:bg-[#A0A0A0] text-[#0F0F0F] text-xl font-bold py-8 px-12 rounded-2xl shadow-xl min-h-[64px] transition-transform transform hover:-translate-y-1"
                    >
                        Secure Your Reservation Now <Lock className="ml-3 w-6 h-6" />
                    </Button>
                    <p className="mt-4 text-sm text-[#333333] flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-600" /> SSL Encrypted Checkout
                    </p>
                </div>
            </section>

        </div>
      </div>
    </>
  );
};

export default ReservationPage;