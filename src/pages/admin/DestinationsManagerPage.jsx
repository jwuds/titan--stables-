import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plane, Plus, Trash2, Edit2, MoveVertical, Image as ImageIcon, Video, Loader2, Play } from 'lucide-react';

const DestinationsManagerPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    media_url: '',
    media_type: 'video', // Default to video
    display_order: 0
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load delivery videos" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (formData.media_type === 'video' && !file.type.startsWith('video/')) {
       toast({ variant: "destructive", title: "Invalid File", description: "Please upload a video file." });
       return;
    }
    if (formData.media_type === 'image' && !file.type.startsWith('image/')) {
        toast({ variant: "destructive", title: "Invalid File", description: "Please upload an image file." });
        return;
    }

    setIsSubmitting(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `delivery-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, media_url: publicUrl }));
      toast({ title: "Upload Complete", description: "File uploaded successfully." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.media_url) {
      toast({ variant: "destructive", title: "Required Fields", description: "Name and Media URL are required." });
      return;
    }

    setIsSubmitting(true);
    try {
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('destinations')
          .update({
             name: formData.name,
             description: formData.description,
             media_url: formData.media_url,
             media_type: formData.media_type,
             display_order: formData.display_order
          })
          .eq('id', formData.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Entry updated successfully." });
      } else {
        // Insert
        const { error } = await supabase
          .from('destinations')
          .insert([{
             name: formData.name,
             description: formData.description,
             media_url: formData.media_url,
             media_type: formData.media_type,
             display_order: destinations.length // Append to end
          }]);
        if (error) throw error;
        toast({ title: "Created", description: "New entry added." });
      }
      
      setIsDialogOpen(false);
      fetchDestinations();
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save entry." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const { error } = await supabase.from('destinations').delete().eq('id', id);
      if (error) throw error;
      setDestinations(prev => prev.filter(d => d.id !== id));
      toast({ title: "Deleted", description: "Entry removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete." });
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      media_url: '',
      media_type: 'video', 
      display_order: 0
    });
  };

  const openEdit = (item) => {
    setFormData({ ...item });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Delivery Demonstrations</h1>
            <p className="text-muted-foreground mt-2">
              Manage the global delivery slide section. Upload videos showing the transport process.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2" /> Add Demonstration</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{formData.id ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Type</Label>
                  <Select 
                    value={formData.media_type} 
                    onValueChange={(val) => setFormData(prev => ({...prev, media_type: val}))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video (MP4/WebM)</SelectItem>
                      <SelectItem value="image">Image (JPG/PNG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Title</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="col-span-3"
                    placeholder="e.g. Loading at JFK" 
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                   <Label className="text-right">Description</Label>
                   <Textarea 
                      value={formData.description || ''} 
                      onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                      className="col-span-3"
                      placeholder="Short caption about the video..."
                   />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                   <Label className="text-right">Media</Label>
                   <div className="col-span-3 space-y-2">
                      <Input 
                         type="file" 
                         accept={formData.media_type === 'video' ? "video/*" : "image/*"}
                         onChange={handleFileUpload}
                         disabled={isSubmitting}
                      />
                      <div className="flex items-center gap-2">
                         <div className="h-px bg-slate-200 flex-1"></div>
                         <span className="text-xs text-muted-foreground">OR URL</span>
                         <div className="h-px bg-slate-200 flex-1"></div>
                      </div>
                      <Input 
                         value={formData.media_url}
                         onChange={e => setFormData(prev => ({...prev, media_url: e.target.value}))}
                         placeholder="https://..."
                      />
                   </div>
                </div>

                {formData.media_url && (
                    <div className="col-span-4 mt-2">
                        <Label className="mb-2 block">Preview</Label>
                        <div className="aspect-video bg-slate-100 rounded-md overflow-hidden border relative">
                            {formData.media_type === 'video' ? (
                                <video src={formData.media_url} controls className="w-full h-full object-cover" />
                            ) : (
                                <img src={formData.media_url} alt="Preview" className="w-full h-full object-cover" />
                            )}
                        </div>
                    </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
             <div className="flex items-center justify-center h-40">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
        ) : destinations.length === 0 ? (
             <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Video className="w-12 h-12 mb-4 opacity-20" />
                    <p>No delivery demonstrations uploaded yet.</p>
                </CardContent>
             </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((item) => (
                    <Card key={item.id} className="group overflow-hidden">
                        <div className="aspect-video relative bg-slate-900">
                             {item.media_type === 'video' ? (
                                 <>
                                    <video src={item.media_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" muted />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="w-12 h-12 text-white opacity-80" />
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider flex items-center gap-1">
                                        <Video className="w-3 h-3" /> Video
                                    </div>
                                 </>
                             ) : (
                                 <>
                                    <img src={item.media_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider flex items-center gap-1">
                                        <ImageIcon className="w-3 h-3" /> Image
                                    </div>
                                 </>
                             )}
                        </div>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                            <CardDescription className="line-clamp-2 text-xs mt-1">
                                {item.description || "No description provided."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 flex justify-end gap-2">
                             <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                                <Edit2 className="w-3 h-3 mr-1" /> Edit
                             </Button>
                             <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="w-3 h-3 mr-1" /> Delete
                             </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DestinationsManagerPage;