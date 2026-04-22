import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '@/components/SEO';
import { generateProductSchema } from '@/lib/schema';
import { supabase } from '@/lib/customSupabaseClient';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);
        toast({
          title: "Added to Cart! 🛒",
          description: `${quantity} x ${product.title} (${selectedVariant.title}) added.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Cannot Add to Cart",
          description: error.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleQuantityChange = useCallback((amount) => {
    setQuantity(prevQuantity => {
        const newQuantity = prevQuantity + amount;
        if (newQuantity < 1) return 1;
        return newQuantity;
    });
  }, []);

  const handlePrevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
  }, [product?.images?.length]);

  const handleNextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
  }, [product?.images?.length]);

  const handleVariantSelect = useCallback((variant) => {
    setSelectedVariant(variant);
    if (variant.image_url && product?.images?.length > 0) {
      const imageIndex = product.images.findIndex(image => image.url === variant.image_url);
      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }
  }, [product?.images]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Parallel fetch: Product API and Local Overrides
        const [fetchedProduct, overrideResponse] = await Promise.all([
            getProduct(id),
            supabase.from('product_overrides').select('*').eq('product_id', id).single()
        ]);

        // Apply overrides if they exist
        const override = overrideResponse.data || {};
        const finalProduct = {
            ...fetchedProduct,
            title: override.custom_title || fetchedProduct.title,
            description: override.custom_description || fetchedProduct.description
        };

        try {
          // Prevent fetch if product has no ID or seems invalid
          if (finalProduct.id) {
            const quantitiesResponse = await getProductQuantities({
              fields: 'inventory_quantity',
              product_ids: [finalProduct.id]
            });
  
            const variantQuantityMap = new Map();
            if (quantitiesResponse && Array.isArray(quantitiesResponse.variants)) {
                quantitiesResponse.variants.forEach(variant => {
                    variantQuantityMap.set(variant.id, variant.inventory_quantity);
                });
            }
  
            // Safely merge variants
            const mergedVariants = Array.isArray(finalProduct.variants) 
                ? finalProduct.variants.map(variant => ({
                    ...variant,
                    inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
                }))
                : [];

            const productWithQuantities = {
              ...finalProduct,
              variants: mergedVariants
            };
  
            setProduct(productWithQuantities);
            if (mergedVariants.length > 0) {
              setSelectedVariant(mergedVariants[0]);
            }
          } else {
             setProduct(finalProduct);
          }
        } catch (quantityError) {
           console.warn("Could not fetch live quantities:", quantityError);
           // Fallback to product data without live quantity updates
           setProduct(finalProduct);
           if (finalProduct.variants && finalProduct.variants.length > 0) {
                setSelectedVariant(finalProduct.variants[0]);
           }
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto pt-20 px-6">
        <Link to="/store" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} />
          Back to Store
        </Link>
        <div className="text-center text-red-400 p-8 bg-red-950/20 border border-red-900 rounded-2xl">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <p className="mb-6">Error loading product: {error}</p>
        </div>
      </div>
    );
  }

  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.price_formatted;
  const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
  const isStockManaged = selectedVariant?.manage_inventory ?? false;
  const canAddToCart = !isStockManaged || quantity <= availableStock;

  // Safe image access
  const currentImage = (product.images && product.images.length > currentImageIndex) 
    ? product.images[currentImageIndex] 
    : (product.images && product.images.length > 0 ? product.images[0] : null);
    
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <>
      <SEO 
        title={product.title}
        description={product.description?.substring(0, 160) || product.title}
        image={currentImage?.url}
        url={`/product/${id}`}
        type="product"
        schema={generateProductSchema(product)}
      />
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Link to="/store" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} />
          Back to Store
        </Link>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 bg-slate-950/50 border border-white/10 p-4 md:p-8 rounded-3xl backdrop-blur-sm">
          {/* Image Section */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-square bg-black/40">
              <img
                src={!currentImage?.url ? placeholderImage : currentImage.url}
                alt={product.title}
                className="w-full h-full object-contain"
              />
               {hasMultipleImages && (
                <>
                  <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white p-2 rounded-full"><ChevronLeft size={20} /></button>
                  <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-primary text-white p-2 rounded-full"><ChevronRight size={20} /></button>
                </>
              )}
              {product.ribbon_text && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs md:text-sm font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg">{product.ribbon_text}</div>
              )}
            </div>
            {hasMultipleImages && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-primary scale-105' : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'}`}>
                    <img src={!image.url ? placeholderImage : image.url} alt="view" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Content Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col h-full">
            <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">{product.title}</h1>
                <p className="text-lg md:text-xl text-slate-400 mb-6">{product.subtitle}</p>
                <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-white/10">
                    <span className="text-3xl md:text-4xl font-bold text-primary">{price}</span>
                    {selectedVariant?.sale_price_in_cents && <span className="text-xl md:text-2xl text-slate-500 line-through">{originalPrice}</span>}
                </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />

            <div className="mt-auto space-y-6">
                {product.variants && product.variants.length > 1 && (
                <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Options</h3>
                    <div className="flex flex-wrap gap-3">
                    {product.variants.map(variant => (
                        <Button key={variant.id} variant={selectedVariant?.id === variant.id ? 'default' : 'outline'} onClick={() => handleVariantSelect(variant)} className={`transition-all h-auto py-3 px-4 md:px-6 text-sm md:text-base ${selectedVariant?.id === variant.id ? 'bg-primary text-primary-foreground' : 'bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white'}`}>
                        {variant.title}
                        </Button>
                    ))}
                    </div>
                </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="flex items-center border border-white/20 rounded-lg bg-slate-900/50 h-14 w-full sm:w-fit">
                        <Button onClick={() => handleQuantityChange(-1)} variant="ghost" size="icon" className="h-full w-12 rounded-none text-slate-300 hover:text-white hover:bg-white/5"><Minus size={18} /></Button>
                        <span className="flex-1 sm:w-12 text-center text-white font-bold text-lg">{quantity}</span>
                        <Button onClick={() => handleQuantityChange(1)} variant="ghost" size="icon" className="h-full w-12 rounded-none text-slate-300 hover:text-white hover:bg-white/5"><Plus size={18} /></Button>
                    </div>
                    <Button onClick={handleAddToCart} size="lg" className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 w-full sm:w-auto" disabled={!canAddToCart || !product.purchasable}>
                        <ShoppingCart className="mr-2 h-6 w-6" /> {product.purchasable ? 'Add to Cart' : 'Unavailable'}
                    </Button>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;