import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Award, Calendar, Ruler, Mail, ShoppingCart, Lock, ArrowRight, Heart } from 'lucide-react';
import { getHorseById, getHorses } from '@/data/horses.js';
import { Button } from '@/components/ui/button.jsx';
import SEO from '@/components/SEO.jsx';
import { HorseProductSchema } from '@/components/SchemaMarkup.jsx';
import FadeIn from '@/components/animations/FadeIn.jsx';
import Breadcrumbs from '@/components/Breadcrumbs.jsx';
import SocialShare from '@/components/SocialShare.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/components/ui/use-toast.js';

// Utility for recommendations
const getRecommendedHorses = (currentHorse, allHorses) => {
    if (!allHorses || !currentHorse) return [];
    return allHorses
        .filter(horse => horse.id !== currentHorse.id)
        .map(horse => {
            let score = 0;
            if (horse.breed === currentHorse.breed) score += 3;
            if (Math.abs(horse.age - currentHorse.age) <= 2) score += 2;
            if (horse.discipline === currentHorse.discipline) score += 2;
            const priceDiffRatio = Math.abs(horse.price - currentHorse.price) / currentHorse.price;
            if (priceDiffRatio <= 0.2) score += 2;
            if (horse.is_featured) score += 1;
            return { ...horse, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
};

const HorseDetailPage = () => {
  const { id } = useParams();
  const [horse, setHorse] = useState(null);
  const [allHorses, setAllHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [horseData, horsesData] = await Promise.all([
          getHorseById(id),
          getHorses()
      ]);
      setHorse(horseData);
      setAllHorses(horsesData || []);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const recommendedHorses = useMemo(() => {
      return getRecommendedHorses(horse, allHorses);
  }, [horse, allHorses]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (horse.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + (horse.images?.length || 1)) % (horse.images?.length || 1));
  };

  const handleAddToCart = async () => {
    if (!horse) return;
    
    const displayPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(horse.price || 0);
    
    const cartProduct = {
      id: horse.id,
      title: horse.name,
      image: horse.images?.[0] || '',
    };
    
    const cartVariant = {
      id: horse.id,
      title: 'Standard Reservation',
      price_formatted: displayPrice,
      price_in_cents: (horse.price || 0) * 100,
      inventory_quantity: 1, // Usually only 1 unique horse
      manage_inventory: true
    };

    try {
      await addToCart(cartProduct, cartVariant, 1, 1);
      toast({
        title: "Added to Cart! 🛒",
        description: `${horse.name} has been added to your inquiry cart.`,
      });
    } catch (error) {
      toast({
        title: "Already in cart",
        description: "This unique horse is already in your cart.",
        variant: "destructive"
      });
    }
  };

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-primary animate-pulse font-serif text-xl">Loading Horse Details...</div>
      </div>
  );
  
  if (!horse) return <div className="min-h-screen flex items-center justify-center">Horse not found.</div>;

  const hasImages = horse.images && horse.images.length > 0;
  const isSold = horse.status === 'sold';
  const displayPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(horse.price || 0);

  return (
    <>
      <SEO 
        title={`Premium KFPS Registered Friesian Horse - ${horse.name}`}
        description={`Meet ${horse.name}, a ${horse.age}-year-old ${horse.breed}. Shows exceptional dressage movement and a classic Baroque silhouette. Maintained under elite equestrian standards.`}
        keywords={`KFPS registered, Friesian horse ${horse.name}, dressage movement, Baroque silhouette, equestrian standards`}
        image={hasImages ? horse.images[0] : undefined}
        url={`/horses/${id}`}
        type="product"
      />
      
      <HorseProductSchema horse={horse} />

      <div className="bg-slate-50 min-h-screen">
        <Breadcrumbs items={[{ name: 'Our Horses', path: '/horses' }, { name: horse.name, path: `/horses/${id}` }]} />

        <div className="container mx-auto px-4 py-6 md:py-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-24">
            <FadeIn direction="right" delay={0.1}>
              <div className="relative rounded-xl shadow-2xl overflow-hidden aspect-w-4 aspect-h-3 bg-slate-200 group">
                {hasImages ? (
                    <AnimatePresence mode="wait">
                        <motion.img
                        key={currentImageIndex}
                        src={horse.images[currentImageIndex]}
                        alt={`${horse.name} - Premium ${horse.color || 'black'} ${horse.breed} - Titan Stables breeding program`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className={`w-full h-full object-cover ${isSold ? 'grayscale' : ''}`}
                        />
                    </AnimatePresence>
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <p className="text-slate-500">No images available</p>
                    </div>
                )}
                {hasImages && horse.images.length > 1 && (
                    <>
                    <Button size="icon" onClick={prevImage} aria-label="Previous Image" className="absolute left-2 top-1/2 z-30 bg-black/30 hover:bg-black/50 text-white border-none rounded-full"><ChevronLeft /></Button>
                    <Button size="icon" onClick={nextImage} aria-label="Next Image" className="absolute right-2 top-1/2 z-30 bg-black/30 hover:bg-black/50 text-white border-none rounded-full"><ChevronRight /></Button>
                    </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentImageIndex + 1} / {horse.images?.length || 1}
                </div>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {hasImages && horse.images.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentImageIndex(idx)}
                        aria-label={`View thumbnail ${idx + 1}`}
                        className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      >
                          <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                  ))}
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="mb-6">
                    <div className="flex justify-between items-start">
                         <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 font-serif">{horse.name} - KFPS Registered {horse.breed}</h1>
                         {isSold && <span className="bg-red-500 text-white px-4 py-1 rounded-full font-bold uppercase text-sm tracking-wider">Sold</span>}
                    </div>
                    <p className="text-xl text-primary font-semibold flex items-center gap-2">
                        {horse.breed} <span className="text-slate-300">•</span> {horse.gender} <span className="text-slate-300">•</span> {horse.age} Years
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <span className="text-slate-500 text-sm block">Height (Baroque Silhouette)</span>
                        <span className="font-bold text-slate-900">{horse.height}</span>
                    </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <span className="text-slate-500 text-sm block">Discipline</span>
                        <span className="font-bold text-slate-900">{horse.discipline} (Dressage Movement)</span>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-3 font-serif">Horse Details & Pedigree</h2>
                <div className="text-slate-600 leading-relaxed mb-6 prose prose-sm max-w-none">
                    <p>{horse.description}</p>
                    <p>Raised under strict equestrian standards, this KFPS registered Friesian horse exemplifies our commitment to quality.</p>
                </div>
                
                {horse.features && horse.features.length > 0 && (
                     <div className="mb-8">
                        <h3 className="font-bold text-slate-800 mb-3">Training & Temperament</h3>
                        <div className="flex flex-wrap gap-2">
                            {horse.features.map((feature, i) => (
                                <span key={i} className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/10">
                                    {feature}
                                </span>
                            ))}
                        </div>
                     </div>
                )}

                <h2 className="text-xl font-bold text-slate-800 mb-3 font-serif mt-4">Availability & Pricing</h2>
                <div className="bg-slate-50 p-4 rounded-lg mb-8">
                    <span className="text-slate-500 text-sm block">Price</span>
                    <span className="text-2xl font-bold text-primary">{displayPrice}</span>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={`/reserve?horseId=${horse.id}`} className="w-full sm:w-1/2">
                        <Button className="w-full py-6 text-lg bg-[#C0C0C0] hover:bg-[#A0A0A0] text-[#0F0F0F] shadow-xl font-bold transition-all hover:-translate-y-1" disabled={isSold}>
                            <CheckCircle className="mr-2 h-5 w-5" /> Inquire / Reserve
                        </Button>
                    </Link>
                    <Button 
                        onClick={handleAddToCart}
                        className="w-full sm:w-1/2 py-6 text-lg bg-[#0F0F0F] hover:bg-[#333333] text-white shadow-xl transition-all hover:-translate-y-1"
                        disabled={isSold}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    </Button>
                  </div>
                  <div className="flex gap-4 justify-center mt-2">
                       <SocialShare url={`/horses/${id}`} title={`Check out ${horse.name}, a premium KFPS registered Friesian at Titan Stables`} />
                  </div>
                </div>

              </div>
            </FadeIn>
          </div>

          {/* Recommended Horses Section */}
          {recommendedHorses.length > 0 && (
              <section className="border-t border-slate-200 pt-16">
                  <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Explore Other KFPS Registered Friesians</h2>
                      <Link to="/horses" className="text-primary hover:underline font-medium flex items-center">
                          View All Horses <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {recommendedHorses.map((recHorse, idx) => (
                          <motion.div 
                            key={recHorse.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group border border-slate-100 flex flex-col"
                          >
                              <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                                  {recHorse.images && recHorse.images[0] ? (
                                      <img 
                                        src={recHorse.images[0]} 
                                        alt={`${recHorse.name} - KFPS Friesian - Titan Stables`} 
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                      />
                                  ) : (
                                       <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">No Image</div>
                                  )}
                              </div>
                              
                              <div className="p-4 flex flex-col flex-grow">
                                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{recHorse.name}</h3>
                                  <div className="flex items-center text-xs text-slate-500 mb-3 space-x-2">
                                      <span>{recHorse.age} yrs</span>
                                      <span>•</span>
                                      <span>{recHorse.gender}</span>
                                  </div>
                                  
                                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50">
                                      <span className="font-bold text-slate-900">
                                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(recHorse.price)}
                                      </span>
                                      <Link to={`/horses/${recHorse.id}`}>
                                          <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 p-0 h-auto hover:bg-transparent">
                                              Details <ArrowRight className="w-3 h-3 ml-1" />
                                          </Button>
                                      </Link>
                                  </div>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              </section>
          )}

        </div>
      </div>
    </>
  );
};

export default HorseDetailPage;