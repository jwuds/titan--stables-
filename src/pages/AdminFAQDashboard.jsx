import React, { useState } from 'react';
import { useFAQs } from '@/hooks/useFAQs';
import { faqService } from '@/services/faqService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FAQForm from '@/components/FAQForm';
import AdminSidebar from '@/components/admin/AdminSidebar';
import SeoHead from '@/components/SeoHead';

export default function AdminFAQDashboard() {
  const { faqs, loading, refetch } = useFAQs();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    setIsDeleting(true);
    try {
      await faqService.deleteFAQ(id);
      toast({ title: 'Deleted', description: 'FAQ removed successfully.' });
      refetch();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SeoHead pageKey="admin" customTitle="Manage FAQs | Admin Dashboard" />
      <AdminSidebar isOpen={true} setIsOpen={() => {}} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden p-6 lg:p-10">
        <div className="max-w-6xl mx-auto w-full space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#0A1128]">FAQ Management</h1>
              <p className="text-sm text-slate-500">Create and manage dynamic frequently asked questions.</p>
            </div>
            <Button onClick={handleOpenAdd} className="bg-[#D4AF37] hover:bg-[#b5952f] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add New FAQ
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search FAQs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Geo-Target</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell><GripVertical className="h-4 w-4 text-slate-300 cursor-move" /></TableCell>
                        <TableCell className="font-medium max-w-[300px] truncate" title={faq.question}>
                          {faq.question}
                        </TableCell>
                        <TableCell><Badge variant="outline">{faq.category}</Badge></TableCell>
                        <TableCell><Badge variant="secondary" className="bg-blue-50">{faq.geo_target}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {faq.is_featured && <Badge className="bg-[#D4AF37] hover:bg-[#b5952f] text-[10px] px-1">Featured</Badge>}
                            {faq.is_priority && <Badge variant="destructive" className="text-[10px] px-1">Priority</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(faq)}>
                              <Edit2 className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)} disabled={isDeleting}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          No FAQs found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif font-bold text-[#0A1128]">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </DialogTitle>
            </DialogHeader>
            <FAQForm 
              initialData={editingFaq} 
              onSuccess={() => { setIsModalOpen(false); refetch(); }}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}