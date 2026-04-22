import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useHorseFacts } from '@/hooks/useHorseFacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminHorseFactsPage() {
  const { fetchAllBreeds, createBreed, updateBreed, deleteBreed } = useHorseFacts();
  const [breeds, setBreeds] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const { toast } = useToast();

  const load = async () => setBreeds(await fetchAllBreeds());
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (form.id) await updateBreed(form.id, form);
      else await createBreed(form);
      setOpen(false);
      load();
      toast({ title: 'Saved' });
    } catch(e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Sure?')) return;
    await deleteBreed(id);
    load();
  };

  return (
    <AdminLayout title="Horse Facts Library">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Breed Facts</h2>
        <Button onClick={() => { setForm({}); setOpen(true); }}><Plus className="w-4 h-4 mr-2"/> Add Breed</Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Breed Name</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breeds.map(b => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.breed_name}</TableCell>
                <TableCell>{b.origin}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setForm(b); setOpen(true); }}><Edit className="w-4 h-4 text-blue-600" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash className="w-4 h-4 text-red-600" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto text-slate-900">
          <DialogHeader><DialogTitle>{form.id ? 'Edit' : 'Add'} Breed</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Breed Name" value={form.breed_name || ''} onChange={e=>setForm({...form, breed_name: e.target.value})} className="border-slate-300" />
            <Input placeholder="Origin" value={form.origin || ''} onChange={e=>setForm({...form, origin: e.target.value})} className="border-slate-300" />
            <Input placeholder="Height Range (e.g. 15hh - 17hh)" value={form.height_range || ''} onChange={e=>setForm({...form, height_range: e.target.value})} className="border-slate-300" />
            <Input placeholder="Weight Range (e.g. 1000 - 1500 lbs)" value={form.weight_range || ''} onChange={e=>setForm({...form, weight_range: e.target.value})} className="border-slate-300" />
            <Input placeholder="Lifespan (e.g. 25 - 30 years)" value={form.lifespan || ''} onChange={e=>setForm({...form, lifespan: e.target.value})} className="border-slate-300" />
            <Button onClick={handleSave} className="w-full">Save Facts</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}