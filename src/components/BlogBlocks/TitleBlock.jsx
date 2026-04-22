import React from 'react';
import { Input } from '@/components/ui/input';

export default function TitleBlock({ content = {}, onChange, isEdit }) {
  if (isEdit) {
    return (
      <Input 
        value={content.text || ''} 
        onChange={(e) => onChange({ ...content, text: e.target.value })} 
        placeholder="Enter main title..." 
        className="text-2xl font-bold bg-white text-slate-900"
      />
    );
  }
  return <h1 className="text-4xl font-bold text-slate-900 mb-6">{content.text}</h1>;
}