import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2, Loader2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const SectionGallery = ({ sectionId, defaultImage, alt, className }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (sectionId) {
      fetchImages();
    }
  }, [sectionId]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('section_id', sectionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      if (data) setImages(data);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery-${sectionId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(fileName);

        const { data: newImage, error: dbError } = await supabase
          .from('gallery_images')
          .insert([{ 
            section_id: sectionId, 
            image_url: publicUrl,
            title: 'Gallery Image', // Default title
            description: '' // Default description
          }])
          .select()
          .single();

        if (dbError) throw dbError;

        setImages(prev => [...prev, newImage]);
        successCount++;
      }
      
      // If we added new images, switch to the first new one
      if (images.length === 0 && successCount > 0) {
         setCurrentIndex(0);
      } else if (successCount > 0) {
         setCurrentIndex(images.length); 
      }

      toast({ title: "Upload Complete", description: `Successfully added ${successCount} image(s) to gallery.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to upload one or more images." });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this image? This action cannot be undone.')) return;
    
    const imageToDelete = images[currentIndex];
    if (!imageToDelete) return;

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageToDelete.id);

      if (error) throw error;

      const newImages = images.filter(img => img.id !== imageToDelete.id);
      setImages(newImages);
      
      // Adjust index if needed
      if (currentIndex >= newImages.length) {
        setCurrentIndex(Math.max(0, newImages.length - 1));
      }
      
      toast({ title: "Deleted", description: "Image removed from gallery" });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Delete failed" });
    }
  };

  const nextSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // If no images in DB, show default image
  const displayImages = images.length > 0 ? images : [{ id: 'default', image_url: defaultImage }];
  const currentImage = displayImages[currentIndex] || displayImages[0];
  const isDefault = images.length === 0;

  return (
    <div className={cn("relative group overflow-hidden bg-slate-100 h-full w-full", className)}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage?.id || 'placeholder'}
          src={currentImage?.image_url}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Navigation - Only if multiple images */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all shadow-sm",
                  idx === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Admin Controls - Always visible for admins */}
      {user && (
        <div className="absolute top-4 right-4 flex gap-2 z-20 p-1.5 bg-black/40 backdrop-blur-md rounded-lg shadow-lg border border-white/10">
          <label className="cursor-pointer" title="Upload Photos">
            <div className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors", isUploading && "opacity-50 cursor-not-allowed")}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleUpload} 
              disabled={isUploading} 
            />
          </label>
          
          {!isDefault && (
            <Button 
              size="icon" 
              variant="destructive" 
              className="h-8 w-8"
              onClick={handleDelete}
              title="Delete Current Image"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      
      {/* Empty State Call to Action for Admin */}
      {user && isDefault && !isLoading && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 text-white px-5 py-3 rounded-xl backdrop-blur-md flex items-center gap-3 pointer-events-auto border border-white/20 shadow-xl">
               <UploadCloud className="w-5 h-5" />
               <span className="text-sm font-semibold">Start Gallery</span>
            </div>
         </div>
      )}
    </div>
  );
};

export default SectionGallery;