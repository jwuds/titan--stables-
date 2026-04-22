import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash2, Book } from 'lucide-react';

const PoliciesManager = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', display_order: 0 });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase.from('policies').select('*').order('display_order');
      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      let query;
      if (editingPolicy) {
        query = supabase.from('policies').update(payload).eq('id', editingPolicy.id);
      } else {
        const maxOrder = policies.reduce((max, p) => Math.max(max, p.display_order || 0), 0);
        payload.display_order = maxOrder + 1;
        query = supabase.from('policies').insert([payload]);
      }
      const { error } = await query;
      if (error) throw error;
      toast({ title: "Success", description: "Policy updated successfully." });
      setIsDialogOpen(false);
      fetchPolicies();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy section?")) return;
    try {
      const { error } = await supabase.from('policies').delete().eq('id', id);
      if (error) throw error;
      setPolicies(policies.filter(p => p.id !== id));
      toast({ title: "Deleted", description: "Policy removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openEdit = (policy) => {
    setEditingPolicy(policy);
    setFormData({ title: policy.title, content: policy.content, display_order: policy.display_order });
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setEditingPolicy(null);
    setFormData({ title: '', content: '', display_order: 0 });
    setIsDialogOpen(true);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Policy Management</h2>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Section</Button>
      </div>

      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id} className="group">
            <CardContent className="p-6 flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <Book className="h-5 w-5 text-primary" />
                   <h3 className="font-bold text-xl">{policy.title}</h3>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap line-clamp-3">
                  {policy.content}
                </div>
              </div>
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" onClick={() => openEdit(policy)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(policy.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingPolicy ? 'Edit Policy Section' : 'New Policy Section'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Refund Policy" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="min-h-[200px]" placeholder="Policy details..." />
            </div>
          </div>
          <DialogFooter><Button onClick={handleSubmit}>Save Policy</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoliciesManager;