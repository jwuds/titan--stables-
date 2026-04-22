import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getHorseById } from '@/data/horses';
import { ShieldCheck, Plane, FileCheck, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ProcessCard = ({ number, title, desc, icon: Icon }) => (
  <div className="bg-[#FFFFFF] border border-[#C0C0C0] p-8 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#0F0F0F] mb-6">
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-3xl font-serif font-bold text-[#C0C0C0] mb-2">{number}</div>
    <h3 className="text-xl font-serif font-bold text-[#0F0F0F] mb-3">{title}</h3>
    <p className="text-[#333333] leading-relaxed">{desc}</p>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-[#F5F5F5] last:border-0">
    <span className="text-sm uppercase tracking-wider font-bold text-[#333333] sm:w-1/3 mb-1 sm:mb-0">
      {label}
    </span>
    <span className="text-base font-medium text-[#0F0F0F] sm:w-2/3">
      {value || 'Not specified'}
    </span>
  </div>
);

const RequestPage = () => {
  const [searchParams] = useSearchParams();
  const horseId = searchParams.get('horseId');
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-pulse text-[#333333] font-serif text-xl">Loading Request Details...</div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Secure Your Premium Friesian | Reservation Request"
        description="Reserve your KFPS registered Friesian horse today. Learn about our international buyer policies, horse welfare standards, and secure reservation process."
      />
      <div className="min-h-screen bg-[#F5F5F5] font-sans">
        
        {/* Task 1: Hero Section */}
        <section className="bg-[#0F0F0F] py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-[#0F0F0F] z-0 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 tracking-tight"
            >
              Secure Your Premium Friesian
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-[#C0C0C0] font-light font-serif tracking-wide max-w-2xl mx-auto"
            >
              Reserve Your KFPS Registered Friesian Horse
            </motion.p>
          </div>
        </section>

        {/* Task 1: How the Reservation Works */}
        <section className="py-20 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F0F0F] mb-4">How the Reservation Works</h2>
              <div className="w-24 h-1 bg-[#C0C0C0] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProcessCard 
                number="01" 
                title="Selection & Consultation" 
                icon={FileCheck}
                desc="Select your KFPS registered Friesian and undergo an expert consultation. We schedule a comprehensive Pre-Purchase Evaluation (PPE) with top veterinarians to ensure absolute health and suitability." 
              />
              <ProcessCard 
                number="02" 
                title="Secure Deposit" 
                icon={ShieldCheck}
                desc="Reserve your chosen horse securely. We provide transparent documentation and a fully refundable holding deposit system pending the successful results of the veterinary PPE." 
              />
              <ProcessCard 
                number="03" 
                title="Finalizing Import & Transport" 
                icon={Plane}
                desc="We manage all international logistics from our Virginia-based facility, perfectly handling KFPS documentation, customs, and premium, welfare-focused air transport to your stable." 
              />
            </div>
          </div>
        </section>

        {/* Task 2: Horse Profile Section */}
        <section className="py-20 bg-[#FFFFFF] border-t border-b border-[#C0C0C0]/30">
          <div className="container mx-auto px-4 max-w-6xl">
            {!horse ? (
              <div className="text-center py-24 bg-[#F5F5F5] rounded-xl border border-[#C0C0C0] shadow-sm">
                <h2 className="text-3xl font-serif font-bold text-[#0F0F0F] mb-4">Select a horse to begin</h2>
                <p className="text-[#333333] mb-8 max-w-md mx-auto">Please browse our exclusive collection of KFPS registered Friesians to find the perfect addition to your stable.</p>
                <Link to="/horses">
                  <Button className="bg-[#0F0F0F] text-white hover:bg-[#333333] px-8 py-6 text-lg rounded-md shadow-lg">Browse Collection</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden border-4 border-[#F5F5F5] shadow-lg">
                    <img 
                      src={horse.images?.[0] || 'https://images.unsplash.com/photo-1613437190836-d59585104264'} 
                      alt={`Premium KFPS registered ${horse.name} - Titan Stables`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#0F0F0F]/80 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm tracking-wider uppercase">
                      Reservation Pending
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 bg-[#F5F5F5] p-8 md:p-10 rounded-lg border border-[#C0C0C0]/50 shadow-sm">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F0F0F] mb-2">{horse.name}</h2>
                  <p className="text-[#333333] mb-8 font-light italic text-lg">{horse.breed} • {horse.category || horse.gender}</p>
                  
                  <div className="flex flex-col">
                    <DetailRow label="Age" value={`${horse.age} Years`} />
                    <DetailRow label="Height" value={horse.height} />
                    <DetailRow label="Training Level" value={horse.training_level || horse.discipline} />
                    <DetailRow label="Temperament" value={horse.temperament} />
                    <DetailRow label="KFPS Registration" value="Verified & Authenticated" />
                    <DetailRow label="Breeding Status" value={horse.breeding_info || "Inquire for details"} />
                    <DetailRow label="Special Features" value={horse.features?.join(', ')} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Task 3: Commitment & Welfare Section */}
        <section className="py-24 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F0F0F] mb-6">Our Commitment to Excellence & Horse Welfare</h2>
              <div className="w-24 h-1 bg-[#C0C0C0] mx-auto"></div>
            </div>
            
            <div className="prose prose-lg prose-slate max-w-none text-[#333333] font-light leading-relaxed space-y-6">
              <p>
                At Titan Stables, our commitment to excellence and <strong>horse welfare standards</strong> is the foundational pillar of our entire equestrian operation. We firmly believe that yielding a magnificent, well-adjusted athlete requires uncompromising care from the moment of birth to the day they arrive at your facility. Our premium Virginia-based facility is specifically designed to meet and dramatically exceed global equine welfare requirements. Every horse in our care enjoys expansive, safely fenced turnout in lush pastures, state-of-the-art climate-controlled stabling, and a scientifically formulated nutrition program strictly tailored to their individual metabolism and <strong>Friesian conditioning</strong> needs.
              </p>
              <p>
                Navigating <strong>international buyer policies</strong> should be an experience of absolute transparency and peace of mind. We understand that acquiring a premium equine partner across international borders represents a significant financial and emotional investment. Therefore, we expertly manage the entire exportation process. This includes meticulously facilitating KFPS registration transfers, organizing comprehensive government-endorsed health certifications, and processing complex customs documentation. Our global transportation partners are rigorously vetted, ensuring the highest standards of safety, hydration, and comfort during air and ground travel.
              </p>
              <p>
                Unwavering authenticity is central to our business model. Our adherence to <strong>KFPS Registration & Authenticity</strong> protocols ensures that every horse we present embodies pure, unadulterated Dutch Friesian bloodlines. We strictly enforce the breed standards established in the Netherlands, actively preserving the classic Baroque horse silhouette and cultivating exceptional dressage movement. Every transaction is accompanied by fully certified documentation that indisputably proves the lineage and caliber of your investment.
              </p>
              <p>
                Our <strong>ethical commitment</strong> extends profoundly beyond the point of sale. We are dedicated to responsible breeding practices that actively eliminate genetic flaws while promoting exceptionally willing and gentle temperaments. We take immense pride in our buyer-matching process, taking the time to ensure our gentle giants are perfectly paired with owners whose goals and facilities align with the horse's unique needs. Engaging in our <strong>secure reservation process</strong> means you are partnering with a trusted industry authority. We provide fully transparent terms, highly secure payment structures, and robust legal documentation, ensuring an exceptional and professional acquisition experience.
              </p>
            </div>
          </div>
        </section>

        {/* Task 4: Call to Action */}
        <section className="py-24 bg-[#0F0F0F] border-t border-[#333333]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">Ready to welcome your new partner?</h2>
            {horse ? (
              <Link to={`/checkout?horseId=${horse.id}`}>
                <button className="bg-[#C0C0C0] text-[#0F0F0F] border-2 border-[#C0C0C0] h-14 md:h-16 w-full max-w-[400px] text-lg md:text-xl font-serif font-bold rounded-md shadow-lg hover:bg-white hover:border-white hover:scale-105 transition-all duration-300">
                  Secure Your Reservation
                </button>
              </Link>
            ) : (
              <Link to="/horses">
                <button className="bg-[#C0C0C0] text-[#0F0F0F] border-2 border-[#C0C0C0] h-14 md:h-16 w-full max-w-[400px] text-lg md:text-xl font-serif font-bold rounded-md shadow-lg hover:bg-white hover:border-white hover:scale-105 transition-all duration-300">
                  Browse Available Horses
                </button>
              </Link>
            )}
          </div>
        </section>

      </div>
    </>
  );
};

export default RequestPage;