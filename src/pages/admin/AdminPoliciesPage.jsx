import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

const AdminPoliciesPage = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (policy) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('policies')
        .upsert({
            id: policy.id,
            title: policy.title,
            content: policy.content,
            display_order: policy.display_order,
            updated_at: new Date()
        });

      if (error) throw error;
      toast({ title: "Saved", description: "Policy updated successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updatePolicyState = (id, field, value) => {
      setPolicies(policies.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addNewPolicy = () => {
      const newId = `new-${Date.now()}`;
      setPolicies([...policies, {
          id: newId,
          title: 'New Policy Section',
          content: '<p>Enter policy content here...</p>',
          display_order: policies.length + 1
      }]);
  };

  const deletePolicy = async (id) => {
      if(!window.confirm("Are you sure you want to delete this policy?")) return;
      try {
          const { error } = await supabase.from('policies').delete().eq('id', id);
          if (error) throw error;
          setPolicies(policies.filter(p => p.id !== id));
          toast({ title: "Deleted", description: "Policy removed." });
      } catch (error) {
          toast({ variant: "destructive", title: "Error", description: error.message });
      }
  };

  if (loading) return <AdminLayout title="Policy Manager"><div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout title="Policy Manager">
      <div className="max-w-4xl mx-auto space-y-6">
         <div className="flex justify-between items-center mb-6">
            <p className="text-slate-600">Manage the content displayed on the Policies page.</p>
            <Button onClick={addNewPolicy}><Plus className="mr-2 w-4 h-4" /> Add Section</Button>
         </div>

         <Accordion type="single" collapsible className="space-y-4">
            {policies.map((policy) => (
                <AccordionItem key={policy.id} value={policy.id} className="bg-white border border-slate-200 rounded-lg shadow-sm px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <span className="font-bold text-lg">{policy.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Section Title</Label>
                                <Input 
                                    value={policy.title} 
                                    onChange={(e) => updatePolicyState(policy.id, 'title', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Display Order</Label>
                                <Input 
                                    type="number"
                                    value={policy.display_order} 
                                    onChange={(e) => updatePolicyState(policy.id, 'display_order', parseInt(e.target.value))} 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <RichTextEditor 
                                value={policy.content} 
                                onChange={(val) => updatePolicyState(policy.id, 'content', val)} 
                            />
                        </div>

                        <div className="flex justify-between pt-4 border-t border-slate-100">
                             <Button variant="destructive" size="sm" onClick={() => deletePolicy(policy.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                             </Button>
                             <Button onClick={() => handleSave(policy)} disabled={saving}>
                                {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                             </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
         </Accordion>
      </div>
    </AdminLayout>
  );
};

export default AdminPoliciesPage;