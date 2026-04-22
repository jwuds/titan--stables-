import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function HeadingBlock({ content = {}, onChange, isEdit }) {
  if (isEdit) {
    return (
      <div className="flex gap-2">
        <Select value={content.level || 'h2'} onValueChange={(val) => onChange({ ...content, level: val })}>
          <SelectTrigger className="w-[100px] bg-white text-slate-900"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
            <SelectItem value="h4">H4</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          value={content.text || ''} 
          onChange={(e) => onChange({ ...content, text: e.target.value })} 
          placeholder="Heading text..." 
          className="flex-1 bg-white text-slate-900"
        />
      </div>
    );
  }
  const Tag = content.level || 'h2';
  const classes = {
    h2: "text-3xl font-bold mt-8 mb-4 text-slate-900",
    h3: "text-2xl font-semibold mt-6 mb-3 text-slate-800",
    h4: "text-xl font-medium mt-4 mb-2 text-slate-800"
  };
  return <Tag className={classes[Tag]}>{content.text}</Tag>;
}