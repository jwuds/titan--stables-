import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit2, Trash2, ExternalLink, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import BlogPostForm from './BlogPostForm';
import { useToast } from '@/components/ui/use-toast';
import { fetchWithRetry, fetchWithTimeout } from '@/lib/supabaseErrorHandler';

const AdminBlogTab = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await fetchWithRetry(() => 
        fetchWithTimeout(
          supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
          10000
        )
      );

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError(err.message || 'An unexpected error occurred while fetching posts.');
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load blog posts.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const { error } = await fetchWithTimeout(supabase.from('blog_posts').delete().eq('id', id), 10000);
      if (error) throw error;
      toast({ title: 'Success', description: 'Post deleted successfully.' });
      fetchPosts();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: err.message });
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{editingPost ? 'Edit Post' : 'New Post'}</h2>
        </div>
        <BlogPostForm 
          post={editingPost} 
          onSave={() => { setIsEditing(false); fetchPosts(); }} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  const filteredPosts = posts.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Button onClick={() => { setEditingPost(null); setIsEditing(true); }} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" /> Create New Post
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search posts..." 
            className="pl-10 text-slate-900"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-slate-500">Loading posts...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                      <p className="text-red-600 font-medium">{error}</p>
                      <Button variant="outline" onClick={fetchPosts} className="mt-2">
                        <RefreshCw className="w-4 h-4 mr-2" /> Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No posts found. Create your first post!</td></tr>
              ) : (
                filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                        post.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {post.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{post.category}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingPost(post); setIsEditing(true); }}>
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogTab;