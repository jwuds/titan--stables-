import React from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function ParagraphBlock({ content = {}, onChange, isEdit }) {
  if (isEdit) {
    return (
      <Textarea 
        value={content.text || ''} 
        onChange={(e) => onChange({ ...content, text: e.target.value })} 
        placeholder="Write a paragraph..." 
        className="min-h-[100px] bg-white text-slate-900"
      />
    );
  }
  return <p className="text-slate-700 leading-relaxed mb-6">{content.text}</p>;
}