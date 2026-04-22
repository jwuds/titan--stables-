import React, { useState, useEffect } from 'react';
import { useAdminSections } from '@/hooks/useAdminSections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

const GlobalDeliveryEditor = () => {
  const { getGlobalDeliveryImages, addGlobalDeliveryImage, deleteGlobalDeliveryImage, loading } = useAdminSections();
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const data = await getGlobalDeliveryImages();
    setImages(data);
  };

  const handleAdd = async () => {
    if (!newImageUrl) return;
    await addGlobalDeliveryImage({ image_url: newImageUrl, display_order: images.length });
    setNewImageUrl('');
    loadImages();
  };

  const handleDelete = async (id) => {
    await deleteGlobalDeliveryImage(id);
    loadImages();
  };

  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">Edit Global Delivery Excellence</h1>
      
      <div className="flex gap-4 mb-8">
        <Input 
          placeholder="Image URL" 
          value={newImageUrl} 
          onChange={(e) => setNewImageUrl(e.target.value)} 
        />
        <Button onClick={handleAdd} disabled={loading || !newImageUrl}>Add Image</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {images.map(img => (
          <Card key={img.id}>
            <CardContent className="p-4 relative">
              <img src={img.image_url} alt="Preview" className="w-full h-48 object-cover rounded-md mb-4" />
              <Button variant="destructive" size="icon" className="absolute top-6 right-6" onClick={() => handleDelete(img.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GlobalDeliveryEditor;