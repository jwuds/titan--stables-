import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit2, Trash2, Calendar, Search } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { format } from 'date-fns';

const BlogManagerPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'General',
    excerpt: '',
    content: '',
    author: 'Titan Stables',
    image_url: '',
    published_at: new Date().toISOString().split('T')[0]
  });

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('blog_posts').upsert(payload);

      if (error) throw error;

      toast({ title: "Success", description: "Post saved successfully" });
      setIsDialogOpen(false);
      fetchPosts();
      resetForm();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (!error) {
        setPosts(prev => prev.filter(p => p.id !== id));
        toast({ title: "Post Deleted" });
        setDeleteConfirmId(null);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleEdit = (post) => {
    setFormData({
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      image_url: post.image_url,
      published_at: post.published_at ? post.published_at.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '', slug: '', category: 'General', excerpt: '', 
      content: '', author: 'Titan Stables', image_url: '',
      published_at: new Date().toISOString().split('T')[0]
    });
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Content Management System">
      <Helmet><title>CMS - Blog Manager</title></Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search posts..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" /> Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{formData.id ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    required 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (SEO URL)</Label>
                  <Input 
                    value={formData.slug}
                    placeholder="auto-generated-from-title"
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={v => setFormData({...formData, category: v})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input 
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Publish Date</Label>
                  <Input 
                    type="date"
                    value={formData.published_at}
                    onChange={e => setFormData({...formData, published_at: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input 
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Excerpt (SEO Meta Description)</Label>
                <Input 
                  value={formData.excerpt}
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <Label>Content (Markdown Supported)</Label>
                <RichTextEditor 
                  value={formData.content}
                  onChange={val => setFormData({...formData, content: val})}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save & Publish</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading content...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded border border-dashed">No posts found. Create your first one!</div>
        ) : (
          filteredPosts.map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0 flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-32 bg-slate-100 shrink-0">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-2">{post.category}</Badge>
                        <h3 className="font-bold text-lg text-slate-800">{post.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(post)}>
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => setDeleteConfirmId(post.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                    <span>By {post.author}</span>
                    <span className={post.published_at ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                      {post.published_at ? "Published" : "Draft"}
                    </span>
                  </div>
                  {deleteConfirmId === post.id && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded flex items-center justify-between">
                      <span className="text-sm text-red-700 font-medium">Delete this post?</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>Delete</Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogManagerPage;