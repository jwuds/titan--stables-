import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { PackagePlus, Save, UploadCloud, Info, Edit, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/customSupabaseClient';
import { getProducts } from '@/api/EcommerceApi';

const StoreManagerPage = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [overrides, setOverrides] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Existing Mock Upload State
  const [product, setProduct] = useState({ id: `sku-${Date.now()}`, title: '', description: '', price: '' });

  // Fetch Products and Overrides
  useEffect(() => {
    const loadData = async () => {
        setLoadingProducts(true);
        try {
            const [productsData, overridesData] = await Promise.all([
                getProducts({ limit: 100 }),
                supabase.from('product_overrides').select('*')
            ]);
            
            setProducts(productsData.products || []);
            const overrideMap = {};
            overridesData.data?.forEach(o => overrideMap[o.product_id] = o);
            setOverrides(overrideMap);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingProducts(false);
        }
    };
    loadData();
  }, []);

  const handleSaveOverride = async () => {
    if (!selectedProduct) return;
    const override = overrides[selectedProduct.id] || {};
    
    const { error } = await supabase.from('product_overrides').upsert({
        product_id: selectedProduct.id,
        custom_title: override.custom_title,
        custom_description: override.custom_description,
        updated_at: new Date().toISOString()
    });

    if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save changes.' });
    } else {
        toast({ title: 'Success', description: 'Product content updated locally.' });
    }
  };

  const handleOverrideChange = (field, value) => {
    if (!selectedProduct) return;
    setOverrides(prev => ({
        ...prev,
        [selectedProduct.id]: {
            ...prev[selectedProduct.id],
            [field]: value
        }
    }));
  };

  return (
    <AdminLayout title="Store Item Manager">
      <Helmet><title>Store Manager - Admin</title></Helmet>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-8">
            <TabsTrigger value="edit">Edit Item Content</TabsTrigger>
            <TabsTrigger value="upload">Upload New Item (Simulated)</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
            <div className="flex gap-6 h-[calc(100vh-250px)]">
                {/* Product List */}
                <div className="w-1/3 border rounded-lg overflow-hidden flex flex-col bg-white">
                    <div className="p-4 border-b bg-slate-50 font-bold text-slate-700">Select Product to Edit</div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {products.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => setSelectedProduct(p)}
                                className={`p-3 rounded cursor-pointer flex items-center gap-3 border transition-colors ${selectedProduct?.id === p.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-transparent'}`}
                            >
                                <img src={p.image || 'https://placehold.co/50'} className="w-10 h-10 rounded object-cover bg-slate-200" />
                                <div className="overflow-hidden">
                                    <div className="font-medium truncate">{p.title}</div>
                                    <div className="text-xs text-slate-500 truncate">{p.id}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div className="w-2/3 bg-white border rounded-lg p-6 flex flex-col">
                    {selectedProduct ? (
                        <>
                            <h3 className="text-lg font-bold mb-6">Editing: <span className="text-blue-600">{selectedProduct.title}</span></h3>
                            
                            <div className="space-y-4 flex-1">
                                <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-4 text-sm text-yellow-800">
                                    <Info className="w-4 h-4 inline mr-2"/>
                                    <strong>Note:</strong> You are editing a local override. The original product data from the store API remains unchanged, but visitors will see your custom text below.
                                </div>

                                <div>
                                    <Label>Custom Title (Override)</Label>
                                    <Input 
                                        placeholder={selectedProduct.title}
                                        value={overrides[selectedProduct.id]?.custom_title || ''}
                                        onChange={e => handleOverrideChange('custom_title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Custom Description (Override)</Label>
                                    <Textarea 
                                        className="min-h-[200px]"
                                        placeholder="Enter custom description here..."
                                        value={overrides[selectedProduct.id]?.custom_description || ''}
                                        onChange={e => handleOverrideChange('custom_description', e.target.value)}
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Original description is shown if left empty.</p>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <Button onClick={handleSaveOverride}>
                                    <Save className="w-4 h-4 mr-2"/> Save Content Changes
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            Select a product from the list to edit its content.
                        </div>
                    )}
                </div>
            </div>
        </TabsContent>

        <TabsContent value="upload">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
                 This interface simulates a Google Merchant Center compliant upload.
               </div>
               <div className="grid gap-4">
                 <div><Label>Title</Label><Input value={product.title} onChange={e => setProduct({...product, title: e.target.value})} /></div>
                 <div><Label>Price</Label><Input value={product.price} onChange={e => setProduct({...product, price: e.target.value})} /></div>
                 <Button className="w-fit" onClick={() => { setIsUploading(true); setTimeout(() => { setIsUploading(false); toast({title: 'Simulated Upload Success'}); }, 1000); }}>
                    {isUploading ? 'Uploading...' : 'Upload Item'}
                 </Button>
               </div>
            </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default StoreManagerPage;