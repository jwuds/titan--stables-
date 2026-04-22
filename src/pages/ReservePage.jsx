import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, CheckCircle2, Loader2, Info, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';

const ReservePage = () => {
  const [searchParams] = useSearchParams();
  // Extract either 'horse' or 'horseId' from URL params
  const horseParam = searchParams.get('horse') || searchParams.get('horseId');
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHorse = async () => {
      setLoading(true);
      setError(null);
      if (horseParam) {
        try {
          // Check if horseParam is a UUID
          const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(horseParam);
          let query = supabase.from('horses').select('*');
          
          if (isUUID) {
              query = query.eq('id', horseParam);
          } else {
              // If it's a name like "Sjoerd", perform a case-insensitive match
              query = query.ilike('name', horseParam);
          }

          const { data, error: supabaseError } = await query.limit(1).single();
            
          if (supabaseError) throw supabaseError;
          setHorse(data);
        } catch (err) {
          console.error("Error fetching horse details:", err);
          setError("We couldn't find the selected horse. It may have been sold or removed. Please check the spelling or return to the gallery.");
        }
      }
      setLoading(false);
    };
    fetchHorse();
  }, [horseParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#0F0F0F] mb-4" />
        <p className="text-lg font-serif text-[#333333]">Loading Reservation Details...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={horse ? `Reserve ${horse.name} | Secure Reservation` : "Secure Your Premium Friesian | Reserve"}
        description="Reserve your premium KFPS registered Friesian horse with Titan Stables. Learn about our secure reservation process and ethical horse welfare commitments."
        keywords="reserve Friesian horse, KFPS registered Friesian, equestrian secure payment, Titan Stables reservation"
        url="/reserve"
      />

      <div className="min-h-screen bg-[#F5F5F5] pb-12">
        
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] w-full flex items-center justify-center overflow-hidden bg-[#0F0F0F]">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1684931802761-c7f76b48b495')` }}
            aria-hidden="true"
          />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 tracking-wide drop-shadow-lg">
              Secure Your Reservation
            </h1>
            <p className="text-lg md:text-xl text-[#C0C0C0] font-serif font-light tracking-wider drop-shadow-md">
              The Path to Ownership Starts Here
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-16 flex items-start gap-4">
              <Info className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-800 text-lg">Error Loading Profile</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <div className="flex gap-4 mt-4">
                    <Button onClick={() => window.location.reload()} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                        Retry Loading
                    </Button>
                    <Link to="/horses">
                        <Button className="bg-red-700 text-white hover:bg-red-800">
                            Return to Gallery
                        </Button>
                    </Link>
                </div>
              </div>
            </div>
          )}

          {/* Prominent Horse Profile Section */}
          {!error && horse ? (
            <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-[400px] md:h-auto bg-slate-200 relative">
                  {horse.images && horse.images[0] ? (
                    <img src={horse.images[0]} alt={horse.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm text-xs font-bold uppercase tracking-widest text-[#0F0F0F]">
                      Selected Equine
                  </div>
                </div>
                
                <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F0F0F] mb-6">{horse.name}</h2>
                  
                  <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-8">
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Age</span>
                        <span className="font-semibold text-lg text-[#0F0F0F]">{horse.age} Years</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Height</span>
                        <span className="font-semibold text-lg text-[#0F0F0F]">{horse.height || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Training Level</span>
                        <span className="font-semibold text-lg text-[#0F0F0F]">{horse.training_level || horse.discipline || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Temperament</span>
                        <span className="font-semibold text-lg text-[#0F0F0F]">{horse.temperament || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Registration</span>
                        <span className="font-semibold text-lg text-[#0F0F0F] flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" /> KFPS Registered
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Breeding Status</span>
                        <span className="font-semibold text-lg text-[#0F0F0F]">{horse.breeding_info || 'N/A'}</span>
                    </div>
                  </div>

                  {horse.features && horse.features.length > 0 && (
                    <div className="mb-8">
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 block">Special Features</span>
                      <div className="flex flex-wrap gap-2">
                        {horse.features.map((feature, idx) => (
                          <span key={idx} className="bg-[#F5F5F5] border border-[#E5E5E5] text-[#333333] px-3 py-1.5 rounded-md text-sm font-medium">
                              {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-8 border-t border-[#E5E5E5]">
                      <div className="text-sm text-slate-500 mb-1 font-bold uppercase tracking-wider">Total Purchase Value</div>
                      <div className="text-4xl font-serif font-bold text-[#0F0F0F]">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(horse.price || 0)}
                      </div>
                  </div>
                </div>
              </div>
            </div>
          ) : !error && !loading && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-16 flex items-start gap-4">
              <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-800 text-lg">No Horse Selected</h3>
                <p className="text-yellow-700 mt-1">Please navigate back to our horse gallery to select a horse for reservation.</p>
                <Link to="/horses" className="inline-block mt-4 text-sm font-medium text-yellow-800 hover:underline">
                  &larr; Return to Horses
                </Link>
              </div>
            </div>
          )}

          {/* How the Reservation Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-center text-[#0F0F0F] mb-12">How the Reservation Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-[#E5E5E5] relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0F0F0F] text-[#C0C0C0] rounded-full flex items-center justify-center font-bold text-xl border-4 border-[#F5F5F5]">1</div>
                <FileText className="w-10 h-10 mx-auto text-[#333333] mb-4 mt-4" />
                <h3 className="text-xl font-bold text-[#0F0F0F] mb-3">Selection & Consultation</h3>
                <p className="text-[#333333] text-sm leading-relaxed">
                  Review the horse's detailed profile, pedigree, and health records. Our expert team is available for virtual consultations to ensure the perfect match.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-[#E5E5E5] relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0F0F0F] text-[#C0C0C0] rounded-full flex items-center justify-center font-bold text-xl border-4 border-[#F5F5F5]">2</div>
                <Lock className="w-10 h-10 mx-auto text-[#333333] mb-4 mt-4" />
                <h3 className="text-xl font-bold text-[#0F0F0F] mb-3">Secure Deposit</h3>
                <p className="text-[#333333] text-sm leading-relaxed">
                  Place a fully refundable 10% deposit through our secure payment portal to reserve the horse. This holds the horse exclusively for you while PPE is arranged.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-[#E5E5E5] relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0F0F0F] text-[#C0C0C0] rounded-full flex items-center justify-center font-bold text-xl border-4 border-[#F5F5F5]">3</div>
                <ShieldCheck className="w-10 h-10 mx-auto text-[#333333] mb-4 mt-4" />
                <h3 className="text-xl font-bold text-[#0F0F0F] mb-3">Finalizing Import</h3>
                <p className="text-[#333333] text-sm leading-relaxed">
                  Following a successful Pre-Purchase Exam (PPE), we facilitate the final contract, assist with KFPS transfer paperwork, and coordinate global transport.
                </p>
              </div>
            </div>
          </div>

          {/* Commitment Section */}
          <div className="bg-[#0F0F0F] text-white rounded-2xl overflow-hidden shadow-xl mb-8">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-[#C0C0C0] mr-4" />
                <h2 className="text-2xl md:text-3xl font-serif font-bold">Our Commitment to Excellence & Horse Welfare</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#C0C0C0]">
                <div>
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" /> Transparent Practices
                  </h4>
                  <p className="text-sm leading-relaxed">
                    We guarantee full disclosure of all health records, behavioral history, and training backgrounds. Every horse represented by Titan Stables is subject to rigorous ethical standards.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" /> Welfare First
                  </h4>
                  <p className="text-sm leading-relaxed">
                    The physical and psychological well-being of our Friesians is paramount. Transport is strictly managed through certified equine logistics partners to ensure a stress-free journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final Secure Reservation Button */}
          {horse && !error && (
            <div className="py-8 md:py-12 lg:py-16 text-center">
              <Link to={`/checkout?horse=${encodeURIComponent(horse.name)}&source=reservation`}>
                <button className="w-full sm:w-full lg:w-[400px] h-[48px] md:h-[56px] bg-[#C0C0C0] hover:bg-[#A0A0A0] text-[#0F0F0F] font-serif font-bold text-[18px] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)] rounded mx-auto flex items-center justify-center">
                  Secure Your Payment <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <p className="text-sm text-slate-500 mt-4 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 256-bit Bank Level Encryption
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ReservePage;