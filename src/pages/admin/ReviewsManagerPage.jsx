import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Check, X, Star, Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const ReviewsManagerPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({ name: '', role: '', content: '', rating: 5, image_url: '', approved: true });

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (!error) setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSave = async () => {
    const payload = { ...formData };
    let error;

    if (editingReview) {
       const { error: updateError } = await supabase.from('reviews').update(payload).eq('id', editingReview.id);
       error = updateError;
    } else {
       const { error: insertError } = await supabase.from('reviews').insert([payload]);
       error = insertError;
    }

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Review saved.' });
      setIsDialogOpen(false);
      fetchReviews();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    setReviews(reviews.filter(r => r.id !== id));
  };

  const toggleApproval = async (review) => {
    await supabase.from('reviews').update({ approved: !review.approved }).eq('id', review.id);
    setReviews(reviews.map(r => r.id === review.id ? { ...r, approved: !r.approved } : r));
  };

  const openEditor = (review = null) => {
    setEditingReview(review);
    setFormData(review || { name: '', role: '', content: '', rating: 5, image_url: '', approved: true });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Reviews Management">
      <Helmet><title>Manage Reviews - Admin</title></Helmet>
      
      <div className="mb-6 flex justify-end">
        <Button onClick={() => openEditor()}><Plus className="w-4 h-4 mr-2" /> Add Manual Review</Button>
      </div>

      <div className="grid gap-4">
        {loading ? <Loader2 className="animate-spin mx-auto" /> : reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{review.name}</h3>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded">{review.role}</span>
                        <div className="flex text-yellow-400"><Star className="w-3 h-3 fill-current" /> {review.rating}</div>
                        {review.approved ? 
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center"><Check className="w-3 h-3 mr-1"/> Live</span> : 
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded flex items-center">Pending</span>
                        }
                    </div>
                    <p className="text-slate-600 italic">"{review.content}"</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleApproval(review)}>
                        {review.approved ? 'Unpublish' : 'Approve'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => openEditor(review)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(review.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
            </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{editingReview ? 'Edit Review' : 'Add Review'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Name</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div><Label>Role</Label><Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} /></div>
                </div>
                <div><Label>Rating (1-5)</Label><Input type="number" max={5} min={1} value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} /></div>
                <div><Label>Review Text</Label><Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} /></div>
                <div><Label>Avatar URL</Label><Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
            </div>
            <DialogFooter><Button onClick={handleSave}>Save Review</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ReviewsManagerPage;