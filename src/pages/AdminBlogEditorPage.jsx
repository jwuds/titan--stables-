import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, Eye, Send, Trash2 } from 'lucide-react';
import BlogBlockEditor from '@/components/BlogBlockEditor';
import BlogSEOSidebar from '@/components/BlogSEOSidebar';
import { supabase } from '@/lib/customSupabaseClient';
import { calculateSEOScore } from '@/lib/seoValidation';

const AdminBlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [seoData, setSeoData] = useState({
    focus_keyword: '',
    meta_description: '',
    canonical_url: '',
    geo_target: 'global',
    language_code: 'en'
  });
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      if (error) throw error;
      
      setTitle(data.title || '');
      setIsPublished(data.is_published || false);
      setSeoData({
        focus_keyword: data.focus_keyword || '',
        meta_description: data.meta_description || '',
        canonical_url: data.canonical_url || '',
        geo_target: data.geo_target || 'global',
        language_code: data.language_code || 'en'
      });
      
      const { data: blocksData, error: blocksError } = await supabase.from('blog_blocks').select('*').eq('blog_post_id', id).order('block_order', { ascending: true });
      if (blocksError) throw blocksError;
      
      if (blocksData) {
        setBlocks(blocksData.map(b => ({ id: b.id, type: b.block_type, data: b.block_data })));
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error loading post', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSave = async (publish = isPublished) => {
    if (!title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    try {
      const slug = generateSlug(title);
      const postObj = {
        title,
        slug,
        content_json: blocks,
        is_published: publish,
        seo_score: calculateSEOScore({ ...seoData, content_json: blocks }),
        ...seoData
      };

      let postId = id;

      if (!id) {
        const { data, error } = await supabase.from('blog_posts').insert([postObj]).select().single();
        if (error) throw error;
        postId = data.id;
        navigate(`/admin/blog-editor/${postId}`, { replace: true });
      } else {
        const { error } = await supabase.from('blog_posts').update(postObj).eq('id', id);
        if (error) throw error;
      }

      // Handle Blocks
      if (postId) {
        await supabase.from('blog_blocks').delete().eq('blog_post_id', postId);
        const blockInserts = blocks.map((b, idx) => ({
          blog_post_id: postId,
          block_type: b.type,
          block_order: idx,
          block_data: b.data
        }));
        if (blockInserts.length > 0) {
          await supabase.from('blog_blocks').insert(blockInserts);
        }
      }

      setIsPublished(publish);
      toast({ title: publish ? 'Post published successfully' : 'Draft saved successfully' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error saving post', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await supabase.from('blog_posts').delete().eq('id', id);
      toast({ title: 'Post deleted' });
      navigate('/admin/blog-list');
    } catch (err) {
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog-list')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Post Title..." 
            className="text-2xl font-bold border-none focus-visible:ring-0 shadow-none px-0 h-auto w-full max-w-2xl"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground mr-4">
            Status: {isPublished ? <span className="text-green-500 font-medium">Published</span> : <span className="text-amber-500 font-medium">Draft</span>}
          </span>
          <Button variant="outline" onClick={() => handleSave(false)} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" /> Publish
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 p-6 overflow-y-auto">
          <BlogBlockEditor blocks={blocks} onChange={setBlocks} />
        </div>
        
        <div className="w-[350px] border-l bg-card shrink-0 h-full p-0">
          <BlogSEOSidebar seoData={seoData} setSeoData={setSeoData} contentBlocks={blocks} />
        </div>
      </div>
      
      {/* Bottom Bar for additional actions if needed */}
      <div className="border-t bg-card px-6 py-3 flex justify-between items-center shrink-0">
        <div>
           {id && (
             <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
               <Trash2 className="w-4 h-4" /> Delete Post
             </Button>
           )}
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          <Eye className="w-4 h-4" /> Preview (Coming Soon)
        </Button>
      </div>
    </div>
  );
};

export default AdminBlogEditorPage;