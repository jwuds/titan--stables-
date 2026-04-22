import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateSlug } from '@/lib/blogSeoUtils';
import SEOSettings from './SEOSettings';
import ImageManager from './ImageManager';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { fetchWithRetry, fetchWithTimeout } from '@/lib/supabaseErrorHandler';
import { Loader2 } from 'lucide-react';

const BlogPostForm = ({ post, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', author: '',
    status: 'draft', category: '', featured_image: '', featured_image_alt: ''
  });
  const [seoData, setSeoData] = useState({});
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData(post);
      fetchRelatedData(post.id);
    }
  }, [post]);

  const fetchRelatedData = async (id) => {
    setInitialLoading(true);
    try {
      await Promise.all([
        fetchWithRetry(() => fetchWithTimeout(supabase.from('blog_post_seo').select('*').eq('blog_post_id', id).single(), 5000)).then(res => {
          if (res.data) setSeoData(res.data);
        }).catch(() => {}),
        fetchWithRetry(() => fetchWithTimeout(supabase.from('blog_post_images').select('*').eq('blog_post_id', id).order('position'), 5000)).then(res => {
          if (res.data) setImages(res.data);
        }).catch(() => {})
      ]);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Warning', description: 'Failed to load some associated data.' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title' && !post) {
      setFormData({ ...formData, title: value, slug: generateSlug(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.title?.trim()) throw new Error('Title is required');
    if (!formData.slug?.trim()) throw new Error('Slug is required');
    if (!formData.content?.trim()) throw new Error('Content is required');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateForm();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Validation Error', description: err.message });
      return;
    }

    setLoading(true);
    try {
      let postId = post?.id;
      
      const savePostOp = async () => {
        if (postId) {
          const { error } = await supabase.from('blog_posts').update(formData).eq('id', postId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase.from('blog_posts').insert([formData]).select().single();
          if (error) throw error;
          postId = data.id;
        }
      };

      await fetchWithRetry(() => fetchWithTimeout(savePostOp(), 10000));

      if (seoData.meta_title || seoData.meta_description) {
        const seoPayload = { ...seoData, blog_post_id: postId };
        await fetchWithRetry(() => fetchWithTimeout(async () => {
          const { data: existingSeo } = await supabase.from('blog_post_seo').select('id').eq('blog_post_id', postId).single();
          if (existingSeo) {
            await supabase.from('blog_post_seo').update(seoPayload).eq('blog_post_id', postId);
          } else {
            await supabase.from('blog_post_seo').insert([seoPayload]);
          }
        }, 10000));
      }

      toast({ title: 'Success', description: 'Blog post saved successfully.' });
      onSave();
    } catch (error) {
      console.error('Save failed:', error);
      toast({ variant: 'destructive', title: 'Save Error', description: error.message || 'Failed to save post. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div>
              <Label htmlFor="title">Post Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="text-xl font-bold text-slate-900 py-6" />
            </div>
            
            <div>
              <Label htmlFor="slug">Slug / Permalink</Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required className="text-slate-900" />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt (Short Description)</Label>
              <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="text-slate-900" />
            </div>

            <div>
              <Label htmlFor="content">Content (Rich Text)</Label>
              <Textarea id="content" name="content" value={formData.content} onChange={handleChange} required rows={15} className="font-mono text-sm text-slate-900" placeholder="Supports Markdown / HTML..." />
            </div>
          </div>

          <SEOSettings seoData={seoData} onChange={setSeoData} post={formData} />
          <ImageManager images={images} onChange={setImages} />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold border-b pb-2">Publish Settings</h3>
            
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                <SelectTrigger className="text-slate-900"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" value={formData.author} onChange={handleChange} className="text-slate-900" />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" value={formData.category} onChange={handleChange} className="text-slate-900" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="font-bold border-b pb-2">Featured Image</h3>
            <div>
              <Label htmlFor="featured_image">Image URL</Label>
              <Input id="featured_image" name="featured_image" value={formData.featured_image} onChange={handleChange} className="text-slate-900" />
              {formData.featured_image && (
                <img src={formData.featured_image} alt="Preview" className="mt-4 rounded-lg w-full h-auto object-cover border" />
              )}
            </div>
            <div>
              <Label htmlFor="featured_image_alt">Alt Text</Label>
              <Input id="featured_image_alt" name="featured_image_alt" value={formData.featured_image_alt} onChange={handleChange} className="text-slate-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Post'}
        </Button>
      </div>
    </form>
  );
};

export default BlogPostForm;