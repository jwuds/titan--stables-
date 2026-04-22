import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function BlockTypeSelector({ onAdd }) {
  const [selected, setSelected] = React.useState('paragraph');
  const types = [
    { id: 'paragraph', label: 'Paragraph' },
    { id: 'heading', label: 'Heading' },
    { id: 'image', label: 'Image' },
    { id: 'quote', label: 'Quote' },
    { id: 'faq', label: 'FAQ Accordion' },
    { id: 'pros_cons', label: 'Pros & Cons' },
    { id: 'table', label: 'Data Table' },
    { id: 'internal_link', label: 'Internal Link' },
    { id: 'breed_facts', label: 'Breed Facts' }
  ];

  return (
    <div className="flex gap-2 items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-[200px] bg-white"><SelectValue placeholder="Block Type" /></SelectTrigger>
        <SelectContent>
          {types.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button onClick={() => onAdd(selected)}><Plus className="w-4 h-4 mr-2" /> Add Block</Button>
    </div>
  );
}