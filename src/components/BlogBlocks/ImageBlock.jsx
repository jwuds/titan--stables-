import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

export default function ImageBlock({ content = {}, onChange, isEdit }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const name = `${Math.random()}.${ext}`;
    const { error } = await supabase.storage.from('blog-images').upload(name, file);
    if (!error) {
      const { data } = supabase.storage.from('blog-images').getPublicUrl(name);
      onChange({ ...content, url: data.publicUrl });
    }
    setUploading(false);
  };

  if (isEdit) {
    return (
      <div className="space-y-2">
        {content.url && <img src={content.url} alt="Preview" className="h-32 object-cover rounded-md" />}
        <Input type="file" onChange={handleUpload} disabled={uploading} className="bg-white text-slate-900" />
        {uploading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
        <Input 
          placeholder="Alt text" 
          value={content.alt || ''} 
          onChange={(e) => onChange({ ...content, alt: e.target.value })} 
          className="bg-white text-slate-900"
        />
        <Input 
          placeholder="Caption (optional)" 
          value={content.caption || ''} 
          onChange={(e) => onChange({ ...content, caption: e.target.value })} 
          className="bg-white text-slate-900"
        />
      </div>
    );
  }

  if (!content.url) return null;
  return (
    <figure className="mb-6">
      <img src={content.url} alt={content.alt || 'Blog Image'} className="w-full rounded-xl shadow-sm object-cover" />
      {content.caption && <figcaption className="text-center text-sm text-slate-500 mt-2">{content.caption}</figcaption>}
    </figure>
  );
}