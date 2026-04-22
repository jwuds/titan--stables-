import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import BlockEditor from './BlockEditor';

export default function BlockList({ blocks, onChange, onDelete, onReorder }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div key={block.id || index} className="bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold text-sm text-slate-600 uppercase tracking-wider">{block.block_type}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" disabled={index === 0} onClick={() => onReorder(index, -1)}><ArrowUp className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" disabled={index === blocks.length - 1} onClick={() => onReorder(index, 1)}><ArrowDown className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(index)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="p-4">
            <BlockEditor block={block} onChange={(content) => onChange(index, content)} />
          </div>
        </div>
      ))}
    </div>
  );
}