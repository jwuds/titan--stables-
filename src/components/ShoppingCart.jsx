import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Trash2, Minus, Plus, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/api/EcommerceApi';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      toast({
        title: 'Your cart is empty',
        description: 'Add some products to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCartOpen(false);
    navigate('/checkout?source=cart');

  }, [cartItems, toast, setIsCartOpen, navigate]);

  // Order Summary Calculations
  const subtotalCents = cartItems.reduce((total, item) => {
    const price = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
    return total + price * item.quantity;
  }, 0);
  
  const subtotal = subtotalCents / 100;
  const discountAmount = subtotal * 0.15;
  const finalAmount = subtotal - discountAmount;
  const depositAmount = finalAmount * 0.10;
  const remainingBalance = finalAmount - depositAmount;

  const formatMoney = (val) => formatCurrency(Math.round(val * 100), { symbol: '$', code: 'USD' });

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-white/10 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShoppingCartIcon className="h-6 w-6 text-primary" />
                Your Cart
              </h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-slate-500 h-full flex flex-col items-center justify-center">
                  <ShoppingCartIcon size={64} className="mb-4 opacity-20" />
                  <p className="text-lg">Your cart is empty.</p>
                  <Button 
                    variant="link" 
                    className="text-primary mt-2" 
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue Browsing
                  </Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <motion.div 
                    layout
                    key={item.variant.id} 
                    className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/10 relative group hover:bg-white/10 transition-colors"
                  >
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-white/5">
                      <img src={item.product.image || "https://placehold.co/100"} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                          <h3 className="font-semibold text-white truncate pr-6 text-sm">{item.product.title}</h3>
                          <p className="text-xs text-slate-400 truncate">{item.variant.title}</p>
                          <p className="text-sm text-primary font-bold mt-1">
                            {item.variant.sale_price_formatted || item.variant.price_formatted}
                          </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                         <div className="flex items-center bg-slate-900 rounded-md border border-white/10">
                            <button 
                              onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 text-slate-400 hover:text-white transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs text-white font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              className="px-2 py-1 text-slate-400 hover:text-white transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                         </div>
                         <button 
                            onClick={() => removeFromCart(item.variant.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            title="Remove Item"
                          >
                            <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-slate-900/80 backdrop-blur-md shrink-0">
                
                {/* Order Summary Section */}
                <div className="space-y-3 mb-6 bg-slate-950 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Discount (15%)</span>
                    <span>-{formatMoney(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white font-medium pt-2 border-t border-white/10">
                    <span>Final Total</span>
                    <span>{formatMoney(finalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300 pt-2 border-t border-white/10">
                    <span>Deposit Required (10%)</span>
                    <span>{formatMoney(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Remaining Balance</span>
                    <span>{formatMoney(remainingBalance)}</span>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-end">
                    <div>
                        <span className="block text-sm text-slate-300">Due Today</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{formatMoney(depositAmount)}</span>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-xs text-yellow-200/80 leading-relaxed">
                    Reservations require a secure 10% deposit today. Remaining balance is due before delivery.
                  </p>
                </div>

                <Button 
                    onClick={handleCheckout} 
                    className="w-full bg-[#C0C0C0] hover:bg-[#A0A0A0] text-[#0F0F0F] py-6 text-lg font-bold shadow-lg rounded-xl transition-all hover:scale-[1.02]"
                >
                  Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-center text-slate-500 mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Secure SSL Encrypted Checkout
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;