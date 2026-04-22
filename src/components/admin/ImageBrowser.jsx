import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';

const ImageBrowser = ({ isOpen, onClose, onImageSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all files from the root of the bucket
      const { data: files, error: listError } = await supabase.storage.from('horse-images').list(null, {
        limit: 500, // Adjust limit as needed
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (listError) throw listError;

      // Since files can be in folders (e.g., horse.id/), we need to fetch files from each folder.
      const folderPromises = files.filter(file => !file.id).map(folder => 
        supabase.storage.from('horse-images').list(folder.name, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        })
      );

      const folderResults = await Promise.all(folderPromises);
      
      let allImagePaths = files.filter(file => file.id).map(file => file.name);

      folderResults.forEach((result, index) => {
        if (result.data) {
          const folderName = files.filter(f => !f.id)[index].name;
          const paths = result.data.map(file => `${folderName}/${file.name}`);
          allImagePaths = [...allImagePaths, ...paths];
        }
      });

      const imageUrls = allImagePaths.map(path => {
        const { data: { publicUrl } } = supabase.storage.from('horse-images').getPublicUrl(path);
        return { url: publicUrl, path };
      });

      setImages(imageUrls);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images from storage. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (imageUrl) => {
    onImageSelect(imageUrl);
    toast({
      title: 'Image Selected',
      description: 'The image has been added to the current horse.',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Browse Existing Images</DialogTitle>
          <DialogDescription>
            Select an image from your storage to add to the horse.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto -mx-6 px-6">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-slate-600">Loading images...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p>{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.path}
                  className="relative group aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-all"
                  onClick={() => handleSelect(image.url)}
                >
                  <img src={image.url} alt={image.path} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white font-bold text-center">Select</p>
                  </div>
                </div>
              ))}
            </div>
          )}
           {!loading && !error && images.length === 0 && (
             <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">No images found in storage.</p>
             </div>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageBrowser;