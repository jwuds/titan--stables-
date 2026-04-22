import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Quote } from 'lucide-react';

export default function QuoteBlock({ content = {}, onChange, isEdit }) {
  if (isEdit) {
    return (
      <div className="space-y-2">
        <Textarea 
          placeholder="Quote text..." 
          value={content.text || ''} 
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          className="bg-white text-slate-900"
        />
        <Input 
          placeholder="Author/Source" 
          value={content.author || ''} 
          onChange={(e) => onChange({ ...content, author: e.target.value })}
          className="bg-white text-slate-900"
        />
      </div>
    );
  }

  return (
    <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 p-6 rounded-r-lg my-8 relative">
      <Quote className="absolute top-4 left-4 w-8 h-8 text-blue-200" />
      <p className="text-lg italic text-slate-700 relative z-10 pl-8">{content.text}</p>
      {content.author && <footer className="mt-2 pl-8 font-semibold text-slate-900">— {content.author}</footer>}
    </blockquote>
  );
}