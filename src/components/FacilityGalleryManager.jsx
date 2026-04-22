import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Trash2, Upload, GripVertical, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const FacilityGalleryManager = () => {
  const { toast } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [editCaption, setEditCaption] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('section_id', 'facility')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `facility-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('facility-gallery')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('facility-gallery')
          .getPublicUrl(fileName);

        const maxOrder = images.reduce((max, img) => Math.max(max, img.display_order || 0), 0);

        const { error: dbError } = await supabase.from('gallery_images').insert([{
            section_id: 'facility',
            image_url: publicUrl,
            title: 'Facility Image',
            description: '',
            display_order: maxOrder + 1
        }]);

        if (dbError) throw dbError;
      }

      toast({ title: "Success", description: "Images uploaded successfully." });
      fetchImages();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      // 1. Delete from DB
      const { error: dbError } = await supabase.from('gallery_images').delete().eq('id', id);
      if (dbError) throw dbError;

      // 2. Try delete from storage (optional, best effort)
      if (imageUrl) {
          const path = imageUrl.split('/').pop();
          await supabase.storage.from('facility-gallery').remove([path]);
      }

      setImages(images.filter(img => img.id !== id));
      toast({ title: "Deleted", description: "Image removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openEdit = (image) => {
    setEditImage(image);
    setEditCaption(image.description || '');
  };

  const saveCaption = async () => {
    if (!editImage) return;
    try {
        const { error } = await supabase
            .from('gallery_images')
            .update({ description: editCaption })
            .eq('id', editImage.id);

        if (error) throw error;
        
        setImages(images.map(img => img.id === editImage.id ? { ...img, description: editCaption } : img));
        setEditImage(null);
        toast({ title: "Saved", description: "Caption updated." });
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4 bg-slate-100 p-4 rounded-lg border border-slate-200">
          <Button disabled={uploading} asChild className="cursor-pointer">
              <label>
                 {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                 Upload New Images
                 <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
          </Button>
          <p className="text-sm text-slate-500">Supports multiple file upload (JPG, PNG, WebP)</p>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
             <Card key={img.id} className="group relative overflow-hidden">
                <div className="aspect-square">
                    <img src={img.image_url} alt="Facility" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
                    <p className="text-white text-xs line-clamp-2 mb-2">{img.description || 'No caption'}</p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(img)}>Caption</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(img.id, img.image_url)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                </div>
             </Card>
          ))}
       </div>

       <Dialog open={!!editImage} onOpenChange={(open) => !open && setEditImage(null)}>
           <DialogContent>
               <DialogHeader><DialogTitle>Edit Caption</DialogTitle></DialogHeader>
               <div className="py-4">
                   <Label>SEO-Friendly Caption</Label>
                   <Input 
                        value={editCaption} 
                        onChange={(e) => setEditCaption(e.target.value)} 
                        placeholder="e.g. Spacious 12x12 matted stalls with automatic waterers"
                    />
                    <p className="text-xs text-slate-500 mt-2">Describe the facility feature clearly for better SEO.</p>
               </div>
               <DialogFooter>
                   <Button onClick={saveCaption}>Save Caption</Button>
               </DialogFooter>
           </DialogContent>
       </Dialog>
    </div>
  );
};

export default FacilityGalleryManager;