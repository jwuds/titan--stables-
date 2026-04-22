import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save, ImagePlus, Upload, X } from 'lucide-react';

const HorseImageEditor = ({ horse }) => {
  const { toast } = useToast();
  // Initialize state with existing image URLs
  const [images, setImages] = useState(horse.images.map(url => ({
    id: `existing-${Math.random()}`,
    preview: url,
    file: null,
    originalUrl: url
  })));

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = {
        ...newImages[index],
        preview: URL.createObjectURL(file),
        file: file,
      };
      setImages(newImages);
    }
  };

  const addImageSlot = () => {
    if (images.length >= 8) { // Limit the number of images
      toast({
        title: "Limit Reached",
        description: "You can add a maximum of 8 images per horse.",
        variant: "destructive",
      });
      return;
    }
    setImages([...images, { id: `new-${Date.now()}`, preview: null, file: null, originalUrl: null }]);
  };

  const removeImageSlot = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSaveChanges = () => {
    // In a real application, you would upload files to Supabase Storage
    // and then update the horse record with the new image URLs.
    
    const filesToUpload = images.filter(img => img.file).length;

    console.log(`Simulating upload for ${horse.name}:`, images);
    toast({
      title: 'Changes Saved (Demo)',
      description: `Simulated saving ${filesToUpload} new image(s) for ${horse.name}.`,
    });

    // To make the change feel "permanent" in the demo, we can update the state
    // to treat the new files as "existing" images.
    const newImageList = images.map(img => ({
        id: img.id,
        preview: img.preview, // Keep the blob URL for display
        file: null, // Clear the file object after "upload"
        originalUrl: img.preview, // The new "source" is the preview
    })).filter(img => img.preview); // Remove any empty slots that weren't filled

    setImages(newImageList);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h3 className="text-2xl font-bold text-slate-800">{horse.name}</h3>
        <p className="text-sm text-slate-500">{horse.breed} - ID: {horse.id}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative group aspect-w-1 aspect-h-1"
            >
              <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center">
                {image.preview ? (
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(image.file ? image.preview : '')} // Clean up blob URL
                  />
                ) : (
                  <div className="text-center text-slate-500 p-2">
                    <Upload className="mx-auto h-8 w-8 mb-2" />
                    <span className="text-sm">Select Image</span>
                  </div>
                )}
              </div>
              <label htmlFor={`file-input-${horse.id}-${index}`} className="absolute inset-0 cursor-pointer bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-white font-bold text-sm bg-black/70 px-3 py-1 rounded-full">Change</span>
              </label>
              <Input
                id={`file-input-${horse.id}-${index}`}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                onChange={(e) => handleFileChange(index, e)}
              />
               <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImageSlot(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {image.file && <p className="text-xs text-slate-600 mt-2 truncate" title={image.file.name}>New: {image.file.name}</p>}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-200">
           <Button variant="outline" onClick={addImageSlot}>
            <ImagePlus className="mr-2 h-4 w-4" />
            Add Image Slot
          </Button>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes for {horse.name}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HorseImageEditor;