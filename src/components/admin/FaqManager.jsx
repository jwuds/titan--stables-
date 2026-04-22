import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash2, GripVertical, Search } from 'lucide-react';

const FaqManager = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    display_order: 0
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.question || !formData.answer) return;
      
      const payload = { ...formData };
      let query;

      if (editingFaq) {
        query = supabase.from('faqs').update(payload).eq('id', editingFaq.id);
      } else {
        // Get max order
        const maxOrder = faqs.reduce((max, f) => Math.max(max, f.display_order || 0), 0);
        payload.display_order = maxOrder + 1;
        query = supabase.from('faqs').insert([payload]);
      }

      const { error } = await query;
      if (error) throw error;

      toast({ title: "Success", description: editingFaq ? "FAQ updated" : "FAQ added" });
      setIsDialogOpen(false);
      fetchFaqs();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      setFaqs(faqs.filter(f => f.id !== id));
      toast({ title: "Deleted", description: "FAQ removed successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      display_order: faq.display_order
    });
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'General', display_order: 0 });
    setIsDialogOpen(true);
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add New FAQ</Button>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border">
        <Search className="h-5 w-5 text-gray-400" />
        <Input 
          className="border-none shadow-none focus-visible:ring-0" 
          placeholder="Search FAQs..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <Card key={faq.id} className="group hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-2 text-gray-400 cursor-move"><GripVertical className="h-4 w-4" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{faq.category || 'General'}</span>
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(faq.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredFaqs.length === 0 && <div className="text-center text-muted-foreground py-8">No FAQs found.</div>}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Shipping, Care, Purchase" />
            </div>
            <div className="space-y-2">
              <Label>Question</Label>
              <Input value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} placeholder="What is...?" />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="min-h-[100px]" placeholder="The answer is..." />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Save FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FaqManager;