import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar, MapPin, Truck, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const ShipmentCarousel = () => {
  const [shipments, setShipments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Admin State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    origin: '',
    destination: '',
    date: '',
    image_url: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % (shipments.length || 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + (shipments.length || 1)) % (shipments.length || 1));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `shipment-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      setNewShipment(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      toast({ title: "Upload Failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddShipment = async () => {
    if (!newShipment.origin || !newShipment.destination) {
       toast({ title: "Missing Fields", description: "Origin and Destination are required", variant: "destructive" });
       return;
    }

    const { data, error } = await supabase
        .from('shipments')
        .insert([newShipment])
        .select();

    if (!error && data) {
        setShipments([data[0], ...shipments]);
        setIsAddOpen(false);
        setNewShipment({ origin: '', destination: '', date: '', image_url: '' });
        toast({ title: "Shipment Added" });
    } else {
        toast({ title: "Error Adding Shipment", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shipment?")) return;
    const { error } = await supabase.from('shipments').delete().eq('id', id);
    if (!error) {
        const newShipments = shipments.filter(s => s.id !== id);
        setShipments(newShipments);
        if (currentIndex >= newShipments.length) setCurrentIndex(0);
        toast({ title: "Shipment Deleted" });
    }
  };

  // Fallback if no shipments
  if (!loading && shipments.length === 0) {
     return (
        <div className="w-full h-[400px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
           <Truck className="w-12 h-12 mb-2 opacity-50" />
           <p>No active shipments scheduled.</p>
           {user && (
             <Button variant="outline" className="mt-4" onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Shipment
             </Button>
           )}
           <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
             {/* Reuse Dialog content logic here or extract it, for simplicity duplicating invisible trigger logic above */}
             <DialogContent>
                 <DialogHeader><DialogTitle>Add Shipment</DialogTitle></DialogHeader>
                 <div className="grid gap-4 py-4">
                    <div><Label>Origin</Label><Input value={newShipment.origin} onChange={e => setNewShipment({...newShipment, origin: e.target.value})} placeholder="e.g. Amsterdam" /></div>
                    <div><Label>Destination</Label><Input value={newShipment.destination} onChange={e => setNewShipment({...newShipment, destination: e.target.value})} placeholder="e.g. New York" /></div>
                    <div><Label>Date/Timeframe</Label><Input value={newShipment.date} onChange={e => setNewShipment({...newShipment, date: e.target.value})} placeholder="e.g. mid-October" /></div>
                    <div>
                        <Label>Image</Label>
                        <Input type="file" onChange={handleFileUpload} accept="image/*" />
                        {isUploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                    </div>
                 </div>
                 <DialogFooter><Button onClick={handleAddShipment} disabled={isUploading}>Save</Button></DialogFooter>
             </DialogContent>
           </Dialog>
        </div>
     );
  }

  const currentShipment = shipments[currentIndex] || {};

  return (
    <div className="relative w-full h-[500px] group rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
       <AnimatePresence mode="wait">
          <motion.div 
            key={currentShipment.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
             <img 
               src={currentShipment.image_url || "https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?q=80&w=1000"} 
               alt={`${currentShipment.origin} to ${currentShipment.destination}`}
               className="w-full h-full object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </motion.div>
       </AnimatePresence>

       {/* Overlay Content */}
       <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.div
             key={`content-${currentShipment.id}`}
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50 max-w-md"
          >
              <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                      <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                      <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Upcoming Transport</p>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 flex flex-wrap gap-2 items-center">
                          {currentShipment.origin} <span className="text-slate-400">→</span> {currentShipment.destination}
                      </h3>
                      {currentShipment.date && (
                          <div className="flex items-center text-slate-600 text-sm mt-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              {currentShipment.date}
                          </div>
                      )}
                  </div>
              </div>
          </motion.div>
       </div>

       {/* Controls */}
       {shipments.length > 1 && (
         <>
            <Button size="icon" variant="ghost" onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-black/20 hover:text-white rounded-full">
                <ChevronLeft className="w-8 h-8" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-black/20 hover:text-white rounded-full">
                <ChevronRight className="w-8 h-8" />
            </Button>
         </>
       )}

       {/* Admin Controls */}
       {user && (
          <div className="absolute top-4 right-4 flex gap-2">
             <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="shadow-lg"><Plus className="w-4 h-4 mr-1" /> Add Route</Button>
                </DialogTrigger>
                <DialogContent>
                 <DialogHeader><DialogTitle>Add Shipment Route</DialogTitle></DialogHeader>
                 <div className="grid gap-4 py-4">
                    <div><Label>Origin</Label><Input value={newShipment.origin} onChange={e => setNewShipment({...newShipment, origin: e.target.value})} placeholder="e.g. Amsterdam" /></div>
                    <div><Label>Destination</Label><Input value={newShipment.destination} onChange={e => setNewShipment({...newShipment, destination: e.target.value})} placeholder="e.g. New York" /></div>
                    <div><Label>Date/Timeframe</Label><Input value={newShipment.date} onChange={e => setNewShipment({...newShipment, date: e.target.value})} placeholder="e.g. mid-October" /></div>
                    <div>
                        <Label>Image</Label>
                        <Input type="file" onChange={handleFileUpload} accept="image/*" />
                        {isUploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                    </div>
                 </div>
                 <DialogFooter><Button onClick={handleAddShipment} disabled={isUploading}>Save</Button></DialogFooter>
             </DialogContent>
             </Dialog>
             <Button size="sm" variant="destructive" onClick={() => handleDelete(currentShipment.id)}><Trash2 className="w-4 h-4" /></Button>
          </div>
       )}
    </div>
  );
};

export default ShipmentCarousel;