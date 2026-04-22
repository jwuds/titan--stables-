import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AdminBlogListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTitle] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('blog_posts').select('id, title, is_published, geo_target, language_code, seo_score, view_count, created_at').order('created_at', { ascending: false });
      
      if (statusFilter === 'published') query = query.eq('is_published', true);
      if (statusFilter === 'draft') query = query.eq('is_published', false);

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({ title: 'Error fetching posts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await supabase.from('blog_posts').delete().eq('id', id);
      setPosts(posts.filter(p => p.id !== id));
      toast({ title: 'Post deleted' });
    } catch (err) {
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Blog Content Manager</h1>
          <p className="text-muted-foreground mt-1">Manage your articles, SEO settings, and content blocks.</p>
        </div>
        <Button onClick={() => navigate('/admin/blog-editor')} className="gap-2">
          <Plus className="w-4 h-4" /> Create New Post
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-4 mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>SEO Score</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Loading posts...</TableCell></TableRow>
            ) : filteredPosts.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No posts found.</TableCell></TableRow>
            ) : (
              filteredPosts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title || 'Untitled Post'}</TableCell>
                  <TableCell>
                    {post.is_published 
                      ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Published</span>
                      : <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Draft</span>
                    }
                  </TableCell>
                  <TableCell>{post.geo_target} / {post.language_code}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${post.seo_score > 70 ? 'text-green-600' : post.seo_score > 40 ? 'text-amber-600' : 'text-red-600'}`}>
                      {post.seo_score || 0}
                    </span>
                  </TableCell>
                  <TableCell>{post.view_count}</TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/blog-editor/${post.id}`)}>
                        <Edit className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBlogListPage;