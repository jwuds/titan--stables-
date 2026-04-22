import React, { useState, useEffect } from 'react';
import { useHorseFacts } from '@/hooks/useHorseFacts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatBreedFacts } from '@/lib/horseFactsGenerator';

export default function BreedFactsBlock({ content = {}, onChange, isEdit }) {
  const { fetchAllBreeds, getBreedFacts } = useHorseFacts();
  const [breeds, setBreeds] = useState([]);
  const [facts, setFacts] = useState(content.facts || null);

  useEffect(() => {
    if (isEdit) fetchAllBreeds().then(setBreeds);
  }, [isEdit, fetchAllBreeds]);

  const handleSelect = async (breedName) => {
    const data = await getBreedFacts(breedName);
    const formatted = formatBreedFacts(data);
    setFacts(formatted);
    onChange({ ...content, breed: breedName, facts: formatted });
  };

  if (isEdit) {
    return (
      <div className="space-y-4">
        <Select value={content.breed || ''} onValueChange={handleSelect}>
          <SelectTrigger className="w-full bg-white text-slate-900"><SelectValue placeholder="Select Breed to Fetch Facts" /></SelectTrigger>
          <SelectContent>
            {breeds.map(b => <SelectItem key={b.id} value={b.breed_name}>{b.breed_name}</SelectItem>)}
          </SelectContent>
        </Select>
        {facts && <p className="text-sm text-green-600">Facts loaded for {content.breed}.</p>}
      </div>
    );
  }

  if (!content.facts) return null;
  const f = content.facts;

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 my-8 shadow-sm">
      <h3 className="text-2xl font-bold mb-4 border-b pb-2">Breed Facts: {content.breed}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {f.origin && <div><span className="font-semibold block text-slate-500 uppercase text-xs">Origin</span>{f.origin}</div>}
        {f.height && <div><span className="font-semibold block text-slate-500 uppercase text-xs">Height Range</span>{f.height}</div>}
        {f.weight && <div><span className="font-semibold block text-slate-500 uppercase text-xs">Weight Range</span>{f.weight}</div>}
        {f.lifespan && <div><span className="font-semibold block text-slate-500 uppercase text-xs">Lifespan</span>{f.lifespan}</div>}
      </div>
      {f.temperament?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <span className="font-semibold block text-slate-500 uppercase text-xs mb-2">Temperament</span>
          <div className="flex flex-wrap gap-2">
            {f.temperament.map((t, i) => <span key={i} className="px-2 py-1 bg-white border rounded text-slate-700 text-xs">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}