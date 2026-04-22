import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Image as ImageIcon, X } from 'lucide-react';

const BlogPostEditor = ({ post, isOpen, onClose, onSaved }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || '',
        category: post.category || '',
        image_url: post.image_url || ''
      });
      setImagePreview(post.image_url || '');
    } else {
      // Reset for new post
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        image_url: ''
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [post, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title if creating new and slug is empty/untouched
    if (name === 'title' && !post) {
      const generatedSlug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload Image if changed
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const postData = {
        ...formData,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (post?.id) {
        // Update
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);
        error = updateError;
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([postData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Article ${post ? 'updated' : 'published'} successfully.`,
      });
      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save article.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Article' : 'New Article'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="Enter article title"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL-friendly)</Label>
              <Input 
                id="slug" 
                name="slug" 
                value={formData.slug} 
                onChange={handleInputChange} 
                placeholder="article-title-here"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                placeholder="e.g., Training, Health" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input 
                id="author" 
                name="author" 
                value={formData.author} 
                onChange={handleInputChange} 
                placeholder="Author Name" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
            <Textarea 
              id="excerpt" 
              name="excerpt" 
              value={formData.excerpt} 
              onChange={handleInputChange} 
              placeholder="Brief summary for the card view..." 
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-start gap-4">
              <div className="relative w-32 h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-slate-400 w-8 h-8" />
                )}
              </div>
              <div className="flex-grow space-y-2">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-slate-500">Recommended size: 1200x630px. Max 5MB.</p>
                {imagePreview && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { setImageFile(null); setImagePreview(''); setFormData(prev => ({...prev, image_url: ''})) }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4 mr-1" /> Remove Image
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              name="content" 
              value={formData.content} 
              onChange={handleInputChange} 
              placeholder="Write your article content here... (Supports basic line breaks)" 
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-slate-500">Tip: Use double line breaks for new paragraphs.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                'Publish Article'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostEditor;