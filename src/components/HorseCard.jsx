import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Ruler, Award, Mail, ShoppingCart, ShieldCheck, Power, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const HorseCard = ({ horse }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth(); 
  const [status, setStatus] = useState(horse?.status || 'available');
  const [isFeatured, setIsFeatured] = useState(horse?.is_featured || false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!horse) return null;

  const isSold = status === 'sold';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSold) return;

    // Mock product/variant for cart
    const horseProduct = {
        id: `horse-${horse.id}`,
        title: `Deposit: ${horse.name}`,
        image: horse.images?.[0] || '',
        price: 1000, 
    };

    const horseVariant = {
        id: `horse-var-${horse.id}`,
        title: 'Reservation Deposit',
        price_formatted: '$1,000.00',
        price_in_cents: 100000,
        inventory_quantity: 1
    };

    try {
        await addToCart(horseProduct, horseVariant, 1, 1);
        toast({
            title: "Added to Cart",
            description: `Deposit for ${horse.name} added.`,
            duration: 2000,
        });
    } catch (error) {
        console.error("Error adding to cart", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not add to cart."
        });
    }
  };

  const toggleStatus = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdating(true);
    const newStatus = status === 'available' ? 'sold' : 'available';

    try {
      const { error } = await supabase
        .from('horses')
        .update({ status: newStatus })
        .eq('id', horse.id);

      if (error) throw error;
      setStatus(newStatus);
      toast({ title: "Status Updated", description: `${horse.name} marked as ${newStatus.toUpperCase()}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleFeatured = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating) return;
    
    const newValue = !isFeatured;
    setIsUpdating(true);
    
    try {
        const { error } = await supabase
            .from('horses')
            .update({ is_featured: newValue })
            .eq('id', horse.id);
            
        if (error) throw error;
        setIsFeatured(newValue);
        toast({ 
            title: newValue ? "Horse Featured" : "Horse Unfeatured", 
            description: newValue ? `${horse.name} will appear on home page.` : `${horse.name} removed from home page.` 
        });
    } catch (error) {
        toast({ variant: "destructive", title: "Failed", description: "Could not update feature status." });
    } finally {
        setIsUpdating(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all h-full flex flex-col border border-border/60 hover:border-primary/30 relative group"
    >
      <div className="relative h-72 overflow-hidden bg-slate-100">
        <img
          src={horse.images?.[0] || "https://placehold.co/600x400?text=No+Image"}
          alt={horse.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSold ? 'grayscale' : ''}`}
        />
        
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start">
           <div className="bg-slate-900/80 text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/50 backdrop-blur-sm shadow-lg">
            {horse.gender || 'Horse'}
          </div>
          
          {(horse.price >= 25000 || isFeatured) && !isSold && (
             <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 ${isFeatured ? 'bg-yellow-400 text-slate-900' : 'bg-primary text-slate-900'}`}>
               {isFeatured ? <><Star className="w-3 h-3 fill-slate-900" /> Featured</> : <><Award className="w-3 h-3" /> Premium</>}
             </div>
          )}
        </div>

        {isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-red-600 text-white px-8 py-2 transform -rotate-12 font-black text-3xl tracking-widest border-4 border-white shadow-2xl">
              SOLD
            </div>
          </div>
        )}
        
        {/* Admin Quick Controls */}
        {user && (
          <div className="absolute bottom-4 right-4 z-20 flex gap-2">
            <Button
                size="icon"
                variant={isFeatured ? "default" : "secondary"}
                onClick={toggleFeatured}
                disabled={isUpdating}
                className={`shadow-lg border-white/20 ${isFeatured ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-white/80 hover:bg-white'}`}
                title="Toggle Featured"
            >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />}
            </Button>
            <Button 
              size="sm" 
              variant={isSold ? "destructive" : "default"} 
              onClick={toggleStatus}
              disabled={isUpdating}
              className="shadow-lg border border-white/20"
            >
              {isSold ? 'Mark Available' : 'Mark Sold'}
            </Button>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">{horse.name}</h3>
        </div>
        <p className="text-primary font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
          <ShieldCheck className="w-4 h-4" />
          {horse.breed}
        </p>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{horse.age} years</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-primary" />
            <span>{horse.height}</span>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="truncate">{horse.discipline}</span>
          </div>
        </div>

        <p className="text-slate-700 mb-6 line-clamp-2 flex-grow text-sm leading-relaxed">{horse.description}</p>

        <div className="mt-auto space-y-3">
             {isSold ? (
               <div className="w-full bg-slate-100 text-slate-400 py-3 rounded-md text-center font-bold cursor-not-allowed border border-slate-200">
                 No Longer Available
               </div>
             ) : (
               <>
                 <div className="flex gap-3">
                    <Link to={`/horses/${horse.id}`} className="flex-1">
                        <Button variant="secondary" className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold">
                            Details
                        </Button>
                    </Link>
                     <Button 
                        variant="outline" 
                        size="icon"
                        className="border-primary text-primary hover:bg-primary hover:text-white aspect-square"
                        onClick={handleAddToCart}
                        title="Add Deposit to Cart"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </Button>
                 </div>
                <Link to={`/reserve?horse=${encodeURIComponent(horse.name)}`} className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all font-bold">
                        <Mail className="w-4 h-4 mr-2" /> Inquire / Reserve
                    </Button>
                </Link>
               </>
             )}
        </div>
      </div>
    </motion.div>
  );
};

export default HorseCard;