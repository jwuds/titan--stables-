import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Upload, Trash2, MoveUp, MoveDown, Settings, Plus, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const EditableGallerySlider = ({ 
  storageKey, 
  defaultImages = [], 
  className, 
  imageClassName,
  overlayContent,
  aspectRatio = "16/9",
  slideInterval = 5000,
  effect = "fade", 
  showControls = true
}) => {
  const { getContent, updateContent } = useContent();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const rawContent = getContent(storageKey);
  let images = defaultImages;
  
  try {
    if (rawContent) {
      const parsed = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
      if (Array.isArray(parsed) && parsed.length > 0) {
        images = parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse gallery images", e);
  }

  const formattedImages = images.map((img, idx) => 
    typeof img === 'string' ? { url: img, id: `img-${idx}`, alt: `Gallery image ${idx + 1} - Titan Stables` } : { ...img, alt: img.alt || `Gallery image ${idx + 1} - Titan Stables` }
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${storageKey}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('site-assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(fileName);

      const newImages = [...formattedImages, { url: publicUrl, id: `img-${Date.now()}`, alt: "Newly uploaded gallery image - Titan Stables" }];
      await saveImages(newImages);
      toast({ title: "Image Added", description: "Gallery updated successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (index) => {
    const newImages = [...formattedImages];
    newImages.splice(index, 1);
    await saveImages(newImages);
  };

  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formattedImages.length - 1) return;

    const newImages = [...formattedImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    await saveImages(newImages);
  };

  const saveImages = async (newImages) => {
    await updateContent(storageKey, JSON.stringify(newImages), 'json');
  };

  return (
    <div className={cn("relative group w-full h-full overflow-hidden", className)}>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect={effect}
        speed={1000}
        autoplay={{ delay: slideInterval, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={formattedImages.length > 1}
        className="h-full w-full"
      >
        {formattedImages.map((img, idx) => (
          <SwiperSlide key={img.id || idx} className="relative h-full w-full bg-slate-900">
             <img 
               src={img.url} 
               alt={img.alt || `Premium gallery image ${idx + 1} - Titan Stables`}
               loading={idx === 0 ? "eager" : "lazy"}
               className={cn("w-full h-full object-cover", imageClassName)}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
          </SwiperSlide>
        ))}
        {overlayContent && (
            <div className="absolute inset-0 z-10 pointer-events-none">
                {overlayContent}
            </div>
        )}
      </Swiper>

      {user && showControls && (
        <div className="absolute top-4 right-4 z-50">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm gap-2">
                <Settings className="w-4 h-4" /> Edit Slides
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Manage Gallery Images</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-end">
                    <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Add New Image
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
                </div>

                <div className="grid gap-3">
                    {formattedImages.map((img, idx) => (
                        <div key={img.id || idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="w-16 h-12 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                                <img src={img.url} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 text-sm truncate text-slate-500">
                                Image {idx + 1}
                            </div>
                            <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" disabled={idx === 0} onClick={() => handleMove(idx, 'up')}><MoveUp className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" disabled={idx === formattedImages.length - 1} onClick={() => handleMove(idx, 'down')}><MoveDown className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(idx)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    ))}
                    {formattedImages.length === 0 && (
                        <div className="text-center py-8 text-slate-400 border-2 border-dashed rounded-lg">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No images yet. Add one to get started.</p>
                        </div>
                    )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default EditableGallerySlider;