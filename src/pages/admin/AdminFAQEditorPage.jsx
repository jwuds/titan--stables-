import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

const AdminFAQEditorPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    active: true,
    order: 0,
    article_assignment: ''
  });

  const wordCount = formData.answer.trim() ? formData.answer.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > 50;

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      toast({ title: 'Error fetching FAQs', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOverWordLimit) {
      toast({ title: 'Word limit exceeded', description: 'Answers must be under 50 words for AI optimization.', variant: 'destructive' });
      return;
    }
    
    if (!formData.question || !formData.answer) {
      toast({ title: 'Validation Error', description: 'Question and answer are required.', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        active: formData.active,
        order: parseInt(formData.order) || 0,
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase
          .from('faqs')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: 'Success', description: 'FAQ updated successfully.' });
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([payload]);

        if (error) throw error;
        toast({ title: 'Success', description: 'FAQ created successfully.' });
      }

      resetForm();
      fetchFaqs();
    } catch (error) {
      toast({ title: 'Error saving FAQ', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'FAQ deleted successfully.' });
      fetchFaqs();
    } catch (error) {
      toast({ title: 'Error deleting FAQ', description: error.message, variant: 'destructive' });
    }
  };

  const editFaq = (faq) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      active: faq.active || faq.visible || false,
      order: faq.order || 0,
      article_assignment: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ question: '', answer: '', category: 'General', active: true, order: 0, article_assignment: '' });
  };

  return (
    <AdminLayout title="AI-Optimized FAQ Editor">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question</label>
                <Input 
                  name="question" 
                  value={formData.question} 
                  onChange={handleInputChange} 
                  placeholder="e.g. What is a KFPS Friesian?"
                  className="text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>Answer (Target &lt; 50 words)</span>
                  <span className={`text-xs font-bold ${isOverWordLimit ? 'text-destructive' : 'text-green-600'}`}>
                    {wordCount}/50 words
                  </span>
                </label>
                <Textarea 
                  name="answer" 
                  value={formData.answer} 
                  onChange={handleInputChange} 
                  placeholder="Provide a concise, direct answer optimized for AI Overviews..."
                  rows={5}
                  className={`resize-none text-foreground ${isOverWordLimit ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {isOverWordLimit && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Answer is too long for optimal AI snippet extraction.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Input name="category" value={formData.category} onChange={handleInputChange} className="text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <Input type="number" name="order" value={formData.order} onChange={handleInputChange} className="text-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Assigned Article (Optional)</label>
                <Input 
                  name="article_assignment" 
                  value={formData.article_assignment} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Ultimate Guide to Friesians" 
                  className="text-foreground" 
                />
                <p className="text-xs text-muted-foreground mt-1">Assign this FAQ to a specific article for structured data.</p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="active" 
                  name="active" 
                  checked={formData.active} 
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <label htmlFor="active" className="text-sm cursor-pointer">Active & Publicly Visible</label>
              </div>

              <div className="pt-4 flex gap-2">
                <Button type="submit" disabled={submitting || isOverWordLimit} className="flex-1">
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  {editingId ? 'Update FAQ' : 'Save FAQ'}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/5 flex justify-between items-center">
              <h3 className="font-bold">Existing FAQs ({faqs.length})</h3>
            </div>
            
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : faqs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No FAQs found. Create one to get started.</div>
            ) : (
              <div className="divide-y divide-border">
                {faqs.map(faq => {
                  const faqWordCount = faq.answer ? faq.answer.trim().split(/\s+/).length : 0;
                  return (
                    <div key={faq.id} className="p-4 hover:bg-secondary/5 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded text-xs font-bold uppercase">
                              {faq.category || 'General'}
                            </span>
                            {(!faq.active && !faq.visible) && (
                              <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded text-xs font-bold uppercase">Draft</span>
                            )}
                            {faqWordCount <= 50 ? (
                               <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-bold flex items-center">
                                 AI Ready
                               </span>
                            ) : (
                               <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-bold">
                                 Too Long ({faqWordCount}w)
                               </span>
                            )}
                          </div>
                          <h4 className="font-bold text-foreground mb-1">{faq.question}</h4>
                          <p className="text-sm text-foreground/70">{faq.answer}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => editFaq(faq)}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminFAQEditorPage;