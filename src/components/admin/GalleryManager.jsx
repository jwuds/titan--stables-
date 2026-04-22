import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, Trash2, Image as ImageIcon } from 'lucide-react';

const GalleryManager = () => {
  const { toast } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `facility-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('facility-gallery')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('facility-gallery')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('gallery_images').insert([{
        image_url: publicUrl,
        section_id: 'facility',
        caption: file.name.split('.')[0]
      }]);

      if (dbError) throw dbError;

      toast({ title: "Success", description: "Image uploaded successfully." });
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
      // Optimistically remove from UI
      setImages(prev => prev.filter(img => img.id !== id));
      
      // Delete from DB
      await supabase.from('gallery_images').delete().eq('id', id);
      
      // Attempt to delete from storage (optional cleanup)
      const fileName = imageUrl.split('/').pop();
      await supabase.storage.from('facility-gallery').remove([fileName]);

      toast({ title: "Deleted", description: "Image removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      fetchImages(); // Revert on error
    }
  };

  const updateCaption = async (id, newCaption) => {
    try {
      await supabase.from('gallery_images').update({ caption: newCaption }).eq('id', id);
      toast({ title: "Updated", description: "Caption saved." });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Facility Gallery</h2>
        <div className="relative">
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleUpload} accept="image/*" disabled={uploading} />
          <Button disabled={uploading}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload Image
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden group relative">
              <div className="aspect-square relative">
                <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Button variant="destructive" size="icon" onClick={() => handleDelete(img.id, img.image_url)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="p-2">
                <Input 
                  defaultValue={img.caption} 
                  onBlur={(e) => updateCaption(img.id, e.target.value)} 
                  className="h-8 text-sm" 
                  placeholder="Caption..."
                />
              </div>
            </Card>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
               <ImageIcon className="mx-auto h-12 w-12 opacity-20 mb-4" />
               <p>No images uploaded yet. Add some photos of your facility!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;