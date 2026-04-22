import React, { useState, useRef } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const EditableImage = ({ 
  name, 
  defaultValue, 
  alt, 
  className,
  containerClassName,
  aspectRatio = null,
  ...props 
}) => {
  const { getContent, updateContent } = useContent();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const savedUrl = name ? getContent(name, defaultValue) : defaultValue;
  const optimizedAlt = alt ? (alt.includes("Titan Stables") ? alt : `${alt} - Titan Stables`) : "Premium equestrian image - Titan Stables";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !name) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${name}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('site-assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(fileName);

      await updateContent(name, publicUrl, 'image');
      toast({ title: "Image Updated", description: "Refresh if changes don't appear immediately." });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const style = aspectRatio ? { aspectRatio } : {};

  const ImageComponent = (
    <img 
      src={savedUrl} 
      alt={optimizedAlt} 
      loading="lazy"
      className={cn(
        "w-full h-full object-cover transition-opacity duration-300", 
        isUploading && "opacity-50", 
        className
      )} 
      style={style}
      {...props} 
    />
  );

  if (!user || !name) {
    return (
      <div className={cn("relative overflow-hidden w-full h-full", containerClassName)} style={style}>
        {ImageComponent}
      </div>
    );
  }

  return (
    <div className={cn("relative group overflow-hidden w-full h-full", containerClassName)} style={style}>
      {ImageComponent}
      
      <div 
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-20"
        onClick={handleOverlayClick}
      >
        <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
          ) : (
            <><ImagePlus className="w-4 h-4" /> Change Image</>
          )}
        </div>
      </div>
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  );
};

export default EditableImage;