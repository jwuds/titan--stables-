import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ImageBlock = ({ data, onChange }) => {
  const [imageUrl, setImageUrl] = useState(data?.url || '');
  const [altText, setAltText] = useState(data?.alt || '');
  const [caption, setCaption] = useState(data?.caption || '');
  const [isUploading, setIsUploading] = useState(false);
  const [fileSize, setFileSize] = useState(data?.size || 0);
  const { toast } = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      setFileSize(file.size);
      onChange({ url: publicUrl, alt: altText, caption, size: file.size });
      
      toast({ title: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAltChange = (e) => {
    setAltText(e.target.value);
    onChange({ url: imageUrl, alt: e.target.value, caption, size: fileSize });
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
    onChange({ url: imageUrl, alt: altText, caption: e.target.value, size: fileSize });
  };

  const removeImage = () => {
    setImageUrl('');
    onChange({ url: '', alt: altText, caption, size: 0 });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-background border rounded-md p-4">
      {!imageUrl ? (
        <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <Label htmlFor="image-upload" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Label>
          <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
          <p className="text-xs text-muted-foreground mt-2">Drag & drop or click to upload</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative group rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex justify-center max-h-[300px]">
            <img src={imageUrl} alt={altText || 'Preview'} className="object-contain max-h-[300px]" />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="destructive" size="icon" onClick={removeImage} className="h-8 w-8 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
              {formatSize(fileSize)}
            </div>
          </div>
          
          <div className="grid gap-3">
            <div className="grid gap-1">
              <Label className="text-sm font-medium">Alt Text (Required for SEO)</Label>
              <Input value={altText} onChange={handleAltChange} placeholder="Describe the image..." className={!altText ? 'border-amber-500' : ''} />
            </div>
            <div className="grid gap-1">
              <Label className="text-sm font-medium">Caption (Optional)</Label>
              <Input value={caption} onChange={handleCaptionChange} placeholder="Image caption..." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;