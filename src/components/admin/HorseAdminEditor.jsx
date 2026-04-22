import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, ImagePlus, Upload, X, Trash2, FolderSearch, Star } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import ImageBrowser from '@/components/admin/ImageBrowser';

const HorseAdminEditor = ({ horse: initialHorse, onUpdate, onDelete }) => {
  const { toast } = useToast();
  
  const [horse, setHorse] = useState(initialHorse);
  const [isSaving, setIsSaving] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);

  const [images, setImages] = useState((initialHorse.images || []).map(url => ({
    id: `existing-${Math.random()}`,
    preview: url,
    file: null,
    originalUrl: url
  })));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHorse(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

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
    if (images.length >= 8) {
      toast({
        title: "Limit Reached",
        description: "You can add a maximum of 8 images per horse.",
        variant: "destructive",
      });
      return;
    }
    setImages([...images, { id: `new-${Date.now()}`, preview: null, file: null, originalUrl: null }]);
  };

  const handleImageSelectFromBrowser = (imageUrl) => {
    if (images.length >= 8) {
      toast({
        title: "Limit Reached",
        description: "You can add a maximum of 8 images per horse.",
        variant: "destructive",
      });
      return;
    }
    setImages([...images, {
      id: `existing-${Date.now()}`,
      preview: imageUrl,
      file: null,
      originalUrl: imageUrl,
    }]);
  };

  const removeImageSlot = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleDeleteHorse = async () => {
      if (!window.confirm(`Are you sure you want to delete ${horse.name}? This action cannot be undone.`)) {
          return;
      }
      
      setIsSaving(true);
      
      // Delete horse record (Storage cleanup optional/handled elsewhere for robustness)
      const { error } = await supabase.from('horses').delete().eq('id', horse.id);

      if (error) {
        toast({ title: 'Error', description: `Failed to delete horse: ${error.message}`, variant: 'destructive'});
      } else {
        toast({ title: 'Success', description: `${horse.name} has been deleted.` });
        onDelete(horse.id);
      }
      setIsSaving(false);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    let finalImageUrls = [];

    const uploadPromises = images.map(async (image) => {
      if (image.file) { 
        const fileName = `${horse.id}/${Date.now()}-${image.file.name}`;
        const { data, error } = await supabase.storage
          .from('horse-images')
          .upload(fileName, image.file);

        if (error) {
          throw new Error(`Failed to upload ${image.file.name}: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('horse-images')
          .getPublicUrl(data.path);
        
        return publicUrl;
      } else if (image.preview) { 
        return image.originalUrl;
      }
      return null;
    });

    try {
      finalImageUrls = (await Promise.all(uploadPromises)).filter(Boolean);

      const updatedHorseData = {
        ...horse,
        price: Number(horse.price) || 0,
        age: Number(horse.age) || 0,
        featured_order: Number(horse.featured_order) || 0,
        images: finalImageUrls,
      };
      
      const { data: updatedData, error } = await supabase
        .from('horses')
        .update(updatedHorseData)
        .eq('id', horse.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setImages(updatedData.images.map(url => ({
        id: `existing-${Math.random()}`,
        preview: url,
        file: null,
        originalUrl: url
      })));
      setHorse(updatedData);
      onUpdate(updatedData);

      toast({
        title: 'Changes Saved!',
        description: `Information for ${updatedData.name} has been successfully saved.`,
      });

    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: 'Save Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      <ImageBrowser 
        isOpen={isBrowserOpen}
        onClose={() => setIsBrowserOpen(false)}
        onImageSelect={handleImageSelectFromBrowser}
      />
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {horse.name}
                {horse.is_featured && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
            </h3>
            <p className="text-sm text-slate-500">ID: {horse.id}</p>
          </div>
          <Button variant="destructive" size="icon" onClick={handleDeleteHorse} disabled={isSaving}>
              <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Feature Controls */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={`featured-${horse.id}`} 
                    name="is_featured" 
                    checked={horse.is_featured || false} 
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`featured-${horse.id}`} className="font-bold text-slate-800 cursor-pointer">
                      Feature on Home Page
                  </Label>
              </div>
              <div className="flex items-center gap-2">
                  <Label htmlFor={`order-${horse.id}`}>Order Priority (Lower # shows first)</Label>
                  <Input 
                    id={`order-${horse.id}`} 
                    name="featured_order" 
                    type="number" 
                    value={horse.featured_order || 0} 
                    onChange={handleInputChange} 
                    className="w-24 bg-white"
                  />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor={`name-${horse.id}`}>Name</Label>
              <Input id={`name-${horse.id}`} name="name" value={horse.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor={`breed-${horse.id}`}>Breed</Label>
              <Input id={`breed-${horse.id}`} name="breed" value={horse.breed} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor={`age-${horse.id}`}>Age</Label>
              <Input id={`age-${horse.id}`} name="age" type="number" value={horse.age} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor={`height-${horse.id}`}>Height (hands)</Label>
              <Input id={`height-${horse.id}`} name="height" value={horse.height} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor={`gender-${horse.id}`}>Gender</Label>
              <Input id={`gender-${horse.id}`} name="gender" value={horse.gender} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor={`price-${horse.id}`}>Price ($)</Label>
              <Input id={`price-${horse.id}`} name="price" type="number" value={horse.price} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor={`discipline-${horse.id}`}>Discipline</Label>
              <Input id={`discipline-${horse.id}`} name="discipline" value={horse.discipline} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor={`description-${horse.id}`}>Description</Label>
              <Textarea id={`description-${horse.id}`} name="description" value={horse.description} onChange={handleInputChange} rows={5} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-semibold text-slate-700">Images</Label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsBrowserOpen(true)} disabled={isSaving || images.length >= 8}>
                  <FolderSearch className="mr-2 h-4 w-4" />
                  Browse Existing
                </Button>
                <Button variant="outline" onClick={addImageSlot} disabled={isSaving || images.length >= 8}>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group aspect-w-1 aspect-h-1"
                >
                  <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center">
                    {image.preview ? (
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
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
                    disabled={isSaving}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImageSlot(index)}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              {images.length < 8 && (
                <div className="flex items-center justify-center w-full h-48 bg-transparent rounded-lg border-2 border-dashed border-slate-300 hover:bg-slate-50 transition-colors">
                  <Button variant="ghost" onClick={addImageSlot} disabled={isSaving}>
                      <ImagePlus className="mr-2 h-5 w-5" />
                      Add Image
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
          
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <Button onClick={handleSaveChanges} className="w-full sm:w-auto" disabled={isSaving}>
            {isSaving ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save All Changes for {horse.name}</>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default HorseAdminEditor;