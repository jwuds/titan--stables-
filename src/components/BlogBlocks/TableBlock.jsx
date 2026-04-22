import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

export default function TableBlock({ content = {}, onChange, isEdit }) {
  const rows = content.rows || [['Column 1', 'Column 2'], ['Data 1', 'Data 2']];

  if (isEdit) {
    return (
      <div className="space-y-2">
        {rows.map((row, rIndex) => (
          <div key={rIndex} className="flex gap-2">
            {row.map((cell, cIndex) => (
              <Input
                key={cIndex}
                value={cell}
                className="bg-white text-slate-900"
                onChange={(e) => {
                  const newRows = [...rows];
                  newRows[rIndex][cIndex] = e.target.value;
                  onChange({ ...content, rows: newRows });
                }}
              />
            ))}
            <Button variant="ghost" size="icon" onClick={() => {
              const newRows = rows.filter((_, i) => i !== rIndex);
              onChange({ ...content, rows: newRows });
            }}><Trash className="w-4 h-4 text-red-500" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => {
          const cols = rows[0]?.length || 2;
          onChange({ ...content, rows: [...rows, Array(cols).fill('')] });
        }}><Plus className="w-4 h-4 mr-2" /> Add Row</Button>
      </div>
    );
  }

  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full bg-white border border-slate-200">
        <thead>
          <tr className="bg-slate-50">
            {rows[0].map((h, i) => <th key={i} className="px-4 py-2 border-b font-semibold text-left">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i} className="border-b hover:bg-slate-50">
              {row.map((c, j) => <td key={j} className="px-4 py-2">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}