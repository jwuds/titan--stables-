import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useHorses } from '@/hooks/useHorses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AdminHorseManagementPage() {
  const { fetchAllHorses, deleteHorse } = useHorses();
  const [horses, setHorses] = useState([]);
  const { toast } = useToast();

  const load = async () => setHorses(await fetchAllHorses());
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if(!confirm('Delete horse?')) return;
    await deleteHorse(id);
    load();
  };

  const handleAction = () => {
    toast({
      title: "Not Implemented",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <AdminLayout title="Horse Management">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Catalog</h2>
        <Button onClick={handleAction}><Plus className="w-4 h-4 mr-2"/> Add Horse</Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {horses.map(h => (
              <TableRow key={h.id}>
                <TableCell>
                  {h.image_url ? <img src={h.image_url} alt={h.name} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-slate-200 rounded"></div>}
                </TableCell>
                <TableCell className="font-medium">{h.name}</TableCell>
                <TableCell>{h.breed}</TableCell>
                <TableCell>{h.age}</TableCell>
                <TableCell><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{h.status}</span></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={handleAction}><Edit className="w-4 h-4 text-blue-600" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(h.id)}><Trash className="w-4 h-4 text-red-600" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}