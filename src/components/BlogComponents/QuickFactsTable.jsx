import React from 'react';
import { generateQuickFactsTable } from '@/lib/horseFactsGenerator';

export default function QuickFactsTable({ article, blocks }) {
  const facts = generateQuickFactsTable(article, blocks);
  if (!facts.length) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 shadow-sm float-none lg:float-right lg:ml-8 lg:mb-8 lg:w-72">
      <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b">Quick Facts</h3>
      <ul className="space-y-3">
        {facts.map((f, i) => (
          <li key={i} className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{f.label}</span>
            <span className="font-semibold text-slate-800">{f.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}