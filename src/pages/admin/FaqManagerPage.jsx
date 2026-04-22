import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Trash2, Edit, Plus, GripVertical } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const FaqManagerPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({ question: '', answer: '', display_order: 0 });

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
    if (!error) setFaqs(data);
    setLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSave = async () => {
    const payload = { ...formData };
    if (editingFaq) {
       await supabase.from('faqs').update(payload).eq('id', editingFaq.id);
    } else {
       await supabase.from('faqs').insert([payload]);
    }
    setIsDialogOpen(false);
    fetchFaqs();
    toast({ title: 'Success', description: 'FAQ saved successfully.' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    fetchFaqs();
  };

  const openEditor = (faq = null) => {
    setEditingFaq(faq);
    setFormData(faq || { question: '', answer: '', display_order: faqs.length + 1 });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="FAQ Management">
      <Helmet><title>Manage FAQs - Admin</title></Helmet>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => openEditor()}><Plus className="w-4 h-4 mr-2" /> Add FAQ</Button>
      </div>
      <div className="space-y-2">
        {loading ? <Loader2 className="animate-spin mx-auto" /> : faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-4 rounded border border-slate-200 flex items-start gap-4">
                <div className="mt-1 text-slate-400"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-grow">
                    <h4 className="font-bold text-slate-800">{faq.question}</h4>
                    <p className="text-slate-600 text-sm mt-1">{faq.answer}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditor(faq)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(faq.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
                <div><Label>Question</Label><Input value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} /></div>
                <div><Label>Answer</Label><Textarea value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} /></div>
                <div><Label>Order</Label><Input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} /></div>
            </div>
            <DialogFooter><Button onClick={handleSave}>Save FAQ</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FaqManagerPage;