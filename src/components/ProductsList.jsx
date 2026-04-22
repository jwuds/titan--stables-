
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Loader2, Tag, Pencil, Save, X, Plus, Trash2, ImagePlus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { validateFileUpload, sanitizeInput } from '@/lib/inputValidation';
import { checkRateLimit } from '@/lib/formSubmissionHelper';
import { safeQuery } from '@/lib/supabaseErrorHandler';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index, onDelete }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const displayPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price || 0);

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    
    if (!checkRateLimit('add_to_cart', 10, 10)) {
         console.warn("Cart rate limit exceeded");
         return;
    }

    const cartProduct = {
        id: product.id,
        title: product.title,
        image: product.image_url,
    };
    const cartVariant = {
        id: product.id,
        title: 'Standard',
        price_formatted: displayPrice,
        price_in_cents: (product.price || 0) * 100,
        inventory_quantity: product.inventory_quantity
    };

    try {
      await addToCart(cartProduct, cartVariant, 1, product.inventory_quantity);
      toast({
        title: "Added to Cart! 🛒",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [product, addToCart, toast, displayPrice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative group"
    >
      {user && (
         <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
                onClick={() => onDelete(product.id)}
                className="h-8 w-8 p-0 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600"
                title="Delete Product"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
         </div>
      )}
      
      <div className="rounded-xl border border-white/10 bg-slate-950/50 shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50 flex flex-col h-full">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
            <img
              src={product.image_url || placeholderImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
              {displayPrice}
            </div>
          </div>
          
          <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">{product.description || 'No description available.'}</p>
            
            <div className="mt-auto">
                 <Button 
                    onClick={handleAddToCart} 
                    className="w-full bg-white/10 hover:bg-primary hover:text-primary-foreground text-white border border-white/10 transition-all duration-300"
                    >
                    <ShoppingCart className="mr-2 h-4 w-4" /> 
                    Add to Cart
                </Button>
            </div>
          </div>
      </div>
    </motion.div>
  );
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    try {
        const query = supabase
            .from('store_products')
            .select('*')
            .order('created_at', { ascending: false });
        
        const { data, error } = await safeQuery(query, []);
        
        if (error) {
            console.error('Error fetching products:', error);
        }
        
        setProducts(data || []);
    } catch (error) {
        console.error('Unexpected error fetching products:', error);
        setProducts([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateFileUpload(file, ['image/jpeg', 'image/png', 'image/webp'], 5 * 1024 * 1024);
    if (!validation.valid) {
        toast({ variant: "destructive", title: "Invalid File", description: validation.error });
        return;
    }

    setUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `product-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('site-assets')
            .getPublicUrl(fileName);
            
        setNewProduct(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
        console.error('Upload error:', error);
        toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
        setUploading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.title || !newProduct.price) {
        toast({ variant: "destructive", title: "Error", description: "Title and price are required." });
        return;
    }

    const cleanProduct = {
        title: sanitizeInput(newProduct.title),
        description: sanitizeInput(newProduct.description),
        price: parseFloat(newProduct.price),
        image_url: newProduct.image_url,
        inventory_quantity: 100
    };

    try {
        const insertQuery = supabase
            .from('store_products')
            .insert([cleanProduct]);

        const { error } = await safeQuery(insertQuery, null);

        if (error) {
            console.error('Error creating product:', error);
            throw error;
        }

        toast({ title: "Success", description: "Product added to store." });
        setIsAddOpen(false);
        setNewProduct({ title: '', description: '', price: '', image_url: '' });
        fetchProducts();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message || 'Failed to create product' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    
    try {
        const deleteQuery = supabase
            .from('store_products')
            .delete()
            .eq('id', id);
        
        const { error } = await safeQuery(deleteQuery, null);
        
        if (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
        
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({ title: "Deleted", description: "Product removed." });
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message || 'Failed to delete product' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      {user && (
        <div className="mb-8 flex justify-end">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add New Product
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Product to Store</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Product Title</Label>
                            <Input 
                                value={newProduct.title}
                                onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                                placeholder="e.g. Leather Halter"
                                maxLength={100}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Price ($)</Label>
                            <Input 
                                type="number"
                                min="0"
                                step="0.01"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                placeholder="Product details..."
                                maxLength={500}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Product Image</Label>
                            <div className="flex items-center gap-4">
                                {newProduct.image_url && (
                                    <img src={newProduct.image_url} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                                )}
                                <div className="relative">
                                    <Button variant="outline" disabled={uploading} type="button">
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImagePlus className="w-4 h-4 mr-2" />}
                                        Upload Image
                                    </Button>
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateProduct} type="button">Save Product</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center text-slate-400 p-12 border border-dashed border-slate-800 rounded-xl">
            <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white">Store is Empty</h3>
            <p>Check back soon for new arrivals.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onDelete={handleDeleteProduct} />
            ))}
        </div>
      )}
    </>
  );
};

export default ProductsList;
