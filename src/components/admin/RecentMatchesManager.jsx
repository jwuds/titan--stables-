
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Pencil, Trash2, Calendar, User, Globe, ImagePlus, Eye, EyeOff } from 'lucide-react';
import { safeQuery } from '@/lib/supabaseErrorHandler';

const RecentMatchesManager = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    horse_name: '',
    new_owner_name: '',
    location: '',
    match_date: '',
    story_description: '',
    image_url: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const query = supabase
        .from('recent_matches')
        .select('*')
        .order('display_order', { ascending: true })
        .order('match_date', { ascending: false });
        
      const { data, error } = await safeQuery(query, []);
      
      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }
      
      setMatches(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Fetch Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: "destructive", title: "Invalid File", description: "Please upload an image file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File Too Large", description: "Image must be under 5MB." });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `match-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('recent-matches')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('recent-matches')
        .getPublicUrl(fileName);
      
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Success", description: "Image uploaded successfully." });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.horse_name || !formData.new_owner_name) {
      toast({ variant: "destructive", title: "Validation Error", description: "Horse name and owner name are required." });
      return;
    }

    try {
      const payload = {
        ...formData,
        display_order: parseInt(formData.display_order) || 0
      };
      
      let query;

      if (editingMatch) {
        query = supabase
          .from('recent_matches')
          .update(payload)
          .eq('id', editingMatch.id);
      } else {
        query = supabase
          .from('recent_matches')
          .insert([payload]);
      }

      const { error } = await safeQuery(query, null);
      
      if (error) {
        console.error('Save error:', error);
        throw error;
      }

      toast({ title: "Success", description: `Match ${editingMatch ? 'updated' : 'created'} successfully.` });
      setIsDialogOpen(false);
      fetchMatches();
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this match record?")) return;
    
    try {
      const deleteQuery = supabase
        .from('recent_matches')
        .delete()
        .eq('id', id);
      
      const { error } = await safeQuery(deleteQuery, null);
      
      if (error) throw error;
      
      setMatches(matches.filter(m => m.id !== id));
      toast({ title: "Deleted", description: "Match record removed successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const toggleActive = async (match) => {
    try {
      const updateQuery = supabase
        .from('recent_matches')
        .update({ is_active: !match.is_active })
        .eq('id', match.id);
      
      const { error } = await safeQuery(updateQuery, null);
      
      if (error) throw error;
      
      setMatches(matches.map(m => m.id === match.id ? { ...m, is_active: !m.is_active } : m));
      toast({ title: "Updated", description: `Match ${!match.is_active ? 'activated' : 'deactivated'}.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      horse_name: match.horse_name || '',
      new_owner_name: match.new_owner_name || '',
      location: match.location || '',
      match_date: match.match_date || '',
      story_description: match.story_description || match.description || '',
      image_url: match.image_url || '',
      display_order: match.display_order || 0,
      is_active: match.is_active !== false
    });
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setEditingMatch(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      horse_name: '',
      new_owner_name: '',
      location: '',
      match_date: '',
      story_description: '',
      image_url: '',
      display_order: 0,
      is_active: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recent Matches & Success Stories</h2>
          <p className="text-slate-600 text-sm mt-1">Manage carousel content for homepage and testimonials</p>
        </div>
        <Button onClick={openNew} className="bg-[#D4AF37] hover:bg-[#B8860B] text-black">
          <Plus className="mr-2 h-4 w-4" /> Add Match
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin w-8 h-8 text-[#D4AF37]" />
        </div>
      ) : matches.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          <p className="mb-4">No matches found. Create your first success story above.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <Card key={match.id} className="overflow-hidden group relative">
              {!match.is_active && (
                <div className="absolute top-2 left-2 z-20 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  HIDDEN
                </div>
              )}
              <div className="aspect-video bg-slate-100 relative">
                 {match.image_url ? (
                   <img src={match.image_url} alt={match.horse_name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="flex items-center justify-center h-full text-slate-400">
                     <ImagePlus className="w-12 h-12" />
                   </div>
                 )}
                 <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 bg-white/90 hover:bg-white" 
                      onClick={() => toggleActive(match)}
                      title={match.is_active ? "Hide from carousel" : "Show in carousel"}
                    >
                      {match.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-8 w-8 bg-white/90 hover:bg-white" 
                      onClick={() => openEdit(match)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleDelete(match.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                 </div>
              </div>
              <CardContent className="p-4">
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="font-bold text-lg">{match.horse_name}</h3>
                   <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded">#{match.display_order}</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                    <User className="w-3 h-3" /> {match.new_owner_name || 'No Owner Listed'}
                 </div>
                 {match.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <Globe className="w-3 h-3" /> {match.location}
                    </div>
                 )}
                 {match.match_date && (
                   <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <Calendar className="w-3 h-3" /> {match.match_date}
                   </div>
                 )}
                 <p className="text-sm text-slate-600 line-clamp-2">{match.story_description || match.description || 'No story provided'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMatch ? 'Edit Match' : 'Add New Match'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Horse Name <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.horse_name} 
                    onChange={e => setFormData({...formData, horse_name: e.target.value})} 
                    placeholder="e.g. Midnight Eclipse"
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Owner Name <span className="text-red-500">*</span></Label>
                  <Input 
                    value={formData.new_owner_name} 
                    onChange={e => setFormData({...formData, new_owner_name: e.target.value})} 
                    placeholder="e.g. Sarah Johnson"
                  />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                      placeholder="e.g. New York, USA" 
                    />
                 </div>
                 <div className="space-y-2">
                    <Label>Match Date</Label>
                    <Input 
                      type="date" 
                      value={formData.match_date} 
                      onChange={e => setFormData({...formData, match_date: e.target.value})} 
                    />
                 </div>
             </div>
             <div className="space-y-2">
                <Label>Story Description</Label>
                <Textarea 
                  value={formData.story_description} 
                  onChange={e => setFormData({...formData, story_description: e.target.value})} 
                  placeholder="Share the success story of this match..." 
                  className="min-h-[100px]"
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input 
                    type="number" 
                    value={formData.display_order} 
                    onChange={e => setFormData({...formData, display_order: e.target.value})} 
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-slate-500">Lower numbers appear first in carousel</p>
               </div>
               <div className="space-y-2">
                  <Label>Active Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={formData.is_active} 
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <span className="text-sm">{formData.is_active ? 'Visible in carousel' : 'Hidden from carousel'}</span>
                  </div>
               </div>
             </div>
             <div className="space-y-2">
                <Label>Photo</Label>
                <div className="flex gap-2">
                   <Input 
                     type="file" 
                     accept="image/*" 
                     onChange={handleImageUpload} 
                     disabled={uploading} 
                   />
                   {uploading && <Loader2 className="animate-spin w-5 h-5" />}
                </div>
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="h-32 rounded border mt-2 object-cover" 
                  />
                )}
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={uploading || !formData.horse_name || !formData.new_owner_name}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black"
            >
              {editingMatch ? 'Update' : 'Create'} Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentMatchesManager;
