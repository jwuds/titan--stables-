import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { fetchWithTimeout } from '@/lib/supabaseErrorHandler';

const ImageManager = ({ images, onChange }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  const handleRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleAltChange = (index, value) => {
    const newImages = [...images];
    newImages[index].alt_text = value;
    onChange(newImages);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const newUploads = [];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 5MB limit`);
        }
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await fetchWithTimeout(
          supabase.storage.from('blog-images').upload(filePath, file),
          15000
        );

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filePath);
        newUploads.push({ image_url: publicUrl, alt_text: '', position: images.length + newUploads.length });
      }

      onChange([...images, ...newUploads]);
      toast({ title: 'Success', description: 'Images uploaded successfully.' });
    } catch (err) {
      console.error('Upload failed:', err);
      toast({ variant: 'destructive', title: 'Upload Failed', description: err.message });
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Additional Images</h3>
      {images.map((img, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardContent className="p-4 flex gap-4 items-center">
            <img src={img.image_url} alt={img.alt_text} className="w-24 h-24 object-cover rounded-md" />
            <div className="flex-1 space-y-2">
              <Label>Alt Text</Label>
              <Input value={img.alt_text || ''} onChange={(e) => handleAltChange(idx, e.target.value)} placeholder="Describe the image..." className="text-slate-900" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleRemove(idx)} className="text-red-500 hover:bg-red-50">
              <Trash2 className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      ))}
      
      <div className="relative">
        <Input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileUpload} 
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        <div className={`p-8 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50 transition-colors ${uploading ? 'opacity-50' : 'hover:bg-slate-100'}`}>
          {uploading ? (
            <div className="flex flex-col items-center text-primary">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <Upload className="w-6 h-6 mb-2" />
              <span>Click to upload or drag images here</span>
              <span className="text-xs mt-1">(Max 5MB per image)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageManager;