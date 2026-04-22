import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/customSupabaseClient';

export default function ArticleMetadata({ data, onChange }) {
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { data: d } = await supabase.storage.from('blog-images').upload(`${Math.random()}-${file.name}`, file);
    if (d) {
      const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(d.path);
      onChange({ ...data, hero_image_url: urlData.publicUrl });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="space-y-4">
        <div>
          <Label className="text-slate-800">Title</Label>
          <Input className="bg-white text-slate-900 border-slate-300" value={data.title || ''} onChange={e => onChange({...data, title: e.target.value})} />
        </div>
        <div>
          <Label className="text-slate-800">Slug</Label>
          <Input className="bg-white text-slate-900 border-slate-300" value={data.slug || ''} onChange={e => onChange({...data, slug: e.target.value})} />
        </div>
        <div>
          <Label className="text-slate-800">Category</Label>
          <Input className="bg-white text-slate-900 border-slate-300" value={data.category || ''} onChange={e => onChange({...data, category: e.target.value})} />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="text-slate-800">Excerpt</Label>
          <Textarea className="bg-white text-slate-900 border-slate-300 h-24" value={data.excerpt || ''} onChange={e => onChange({...data, excerpt: e.target.value})} />
        </div>
        <div>
          <Label className="text-slate-800">Hero Image</Label>
          <div className="flex items-center gap-4">
            {data.hero_image_url && <img src={data.hero_image_url} alt="hero" className="w-16 h-16 object-cover rounded" />}
            <Input className="bg-white text-slate-900 border-slate-300" type="file" onChange={handleImage} />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Switch checked={data.featured || false} onCheckedChange={c => onChange({...data, featured: c})} />
          <Label className="text-slate-800">Featured Article</Label>
        </div>
      </div>
    </div>
  );
}