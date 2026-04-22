import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2, Upload } from 'lucide-react';

const AdminTeamPage = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    credentials: '',
    specialization: '',
    years_experience: '',
    image_url: '',
    display_order: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('team-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('team-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Success", description: "Image uploaded successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.role) {
        toast({ variant: "destructive", title: "Error", description: "Name and Role are required." });
        return;
      }

      const payload = { ...formData };
      let query;

      if (editingMember) {
        query = supabase.from('team_members').update(payload).eq('id', editingMember.id);
      } else {
        const maxOrder = members.reduce((max, m) => Math.max(max, m.display_order || 0), 0);
        payload.display_order = maxOrder + 1;
        query = supabase.from('team_members').insert([payload]);
      }

      const { error } = await query;
      if (error) throw error;

      toast({ title: "Success", description: "Team member saved successfully." });
      setIsDialogOpen(false);
      fetchMembers();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      
      setMembers(members.filter(m => m.id !== id));
      toast({ title: "Success", description: "Team member deleted." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const openNew = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      credentials: '',
      specialization: '',
      years_experience: '',
      image_url: '',
      display_order: 0
    });
    setIsDialogOpen(true);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      credentials: member.credentials || '',
      specialization: member.specialization || '',
      years_experience: member.years_experience || '',
      image_url: member.image_url,
      display_order: member.display_order
    });
    setIsDialogOpen(true);
  };

  if (loading) return <AdminLayout title="Team Management"><div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout title="Team Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-slate-600">Manage your team profiles displayed on the About page.</p>
          <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Team Member</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="relative group overflow-hidden">
              <div className="aspect-square bg-slate-100 relative">
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => openEdit(member)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(member.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="font-bold text-lg">{member.name}</div>
                <div className="text-sm text-primary font-medium mb-2">{member.role}</div>
                <div className="text-xs text-slate-500 line-clamp-2">{member.bio}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Sarah Titan" />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Head Trainer" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Bio (100-150 words)</Label>
                <Textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="h-32" placeholder="Professional biography..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Credentials</Label>
                  <Input value={formData.credentials} onChange={e => setFormData({...formData, credentials: e.target.value})} placeholder="e.g. USDF Gold Medalist" />
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Dressage Training" />
                </div>
              </div>
              
              <div className="space-y-2">
                 <Label>Years of Experience</Label>
                 <Input value={formData.years_experience} onChange={e => setFormData({...formData, years_experience: e.target.value})} placeholder="e.g. 15+ Years" />
              </div>

              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex gap-4 items-center">
                  {formData.image_url && <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-cover rounded" />}
                  <div className="flex-1">
                     <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                     {uploading && <p className="text-xs text-slate-500 mt-1">Uploading...</p>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                 <Label>Display Order</Label>
                 <Input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} />
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={uploading}>Save Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTeamPage;