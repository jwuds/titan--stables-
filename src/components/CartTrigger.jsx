import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CartTrigger = ({ setIsCartOpen }) => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsCartOpen(true)}
          size="icon"
          className="rounded-full h-16 w-16 bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 relative flex items-center justify-center"
          aria-label="Open shopping cart"
        >
          {/* 
            Changed size to h-8 w-8 (32px) for better visibility.
            Increased strokeWidth to 2.5 to make the lines bolder and clearer.
          */}
          <ShoppingCart className="h-8 w-8" strokeWidth={2.5} />
          
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-background shadow-sm animate-in zoom-in duration-300">
              {itemCount}
            </span>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default CartTrigger;