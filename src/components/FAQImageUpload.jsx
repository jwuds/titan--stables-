import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { faqService } from '@/services/faqService';
import { useToast } from '@/hooks/use-toast';

export default function FAQImageUpload({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await faqService.uploadImage(file);
      onChange(url);
      toast({ title: 'Success', description: 'Image uploaded successfully.' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-slate-200">
        <img src={value} alt="Preview" className="w-full h-40 object-cover" />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full"
          onClick={() => onChange(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer relative">
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleUpload}
        disabled={isUploading}
      />
      {isUploading ? (
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      ) : (
        <ImagePlus className="h-8 w-8 mb-2" />
      )}
      <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Click to upload image'}</span>
    </div>
  );
}