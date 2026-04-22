import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash, CheckCircle2, XCircle } from 'lucide-react';

export default function ProsConsBlock({ content = {}, onChange, isEdit }) {
  const pros = content.pros || [];
  const cons = content.cons || [];

  if (isEdit) {
    const handleList = (list, type) => (
      <div className="space-y-2 flex-1">
        <h4 className="font-semibold capitalize">{type}</h4>
        {list.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input 
              value={item} 
              className="bg-white text-slate-900"
              onChange={(e) => {
                const newList = [...list];
                newList[i] = e.target.value;
                onChange({ ...content, [type]: newList });
              }} 
            />
            <Button variant="ghost" size="icon" onClick={() => onChange({ ...content, [type]: list.filter((_, idx) => idx !== i) })}>
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange({ ...content, [type]: [...list, ''] })}>
          <Plus className="w-4 h-4 mr-2" /> Add {type}
        </Button>
      </div>
    );

    return (
      <div className="flex gap-6 flex-col md:flex-row">
        {handleList(pros, 'pros')}
        {handleList(cons, 'cons')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      <div className="bg-green-50 rounded-xl p-6 border border-green-100">
        <h4 className="font-bold text-green-800 text-lg mb-4 flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" /> Pros</h4>
        <ul className="space-y-3">
          {pros.map((p, i) => <li key={i} className="flex items-start"><span className="text-green-600 mr-2">•</span> <span className="text-slate-700">{p}</span></li>)}
        </ul>
      </div>
      <div className="bg-red-50 rounded-xl p-6 border border-red-100">
        <h4 className="font-bold text-red-800 text-lg mb-4 flex items-center"><XCircle className="w-5 h-5 mr-2" /> Cons</h4>
        <ul className="space-y-3">
          {cons.map((c, i) => <li key={i} className="flex items-start"><span className="text-red-500 mr-2">•</span> <span className="text-slate-700">{c}</span></li>)}
        </ul>
      </div>
    </div>
  );
}