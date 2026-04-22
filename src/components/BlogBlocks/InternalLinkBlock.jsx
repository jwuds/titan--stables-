import React from 'react';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InternalLinkBlock({ content = {}, onChange, isEdit }) {
  if (isEdit) {
    return (
      <div className="flex gap-2">
        <Input 
          placeholder="Link Text" 
          value={content.text || ''} 
          onChange={(e) => onChange({ ...content, text: e.target.value })} 
          className="bg-white text-slate-900"
        />
        <Input 
          placeholder="URL Path (e.g. /horses)" 
          value={content.url || ''} 
          onChange={(e) => onChange({ ...content, url: e.target.value })} 
          className="bg-white text-slate-900"
        />
      </div>
    );
  }

  return (
    <div className="my-6">
      <Link to={content.url || '#'} className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors bg-blue-50 px-4 py-3 rounded-lg w-full sm:w-auto shadow-sm border border-blue-100 group">
        {content.text || 'Learn more'}
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}