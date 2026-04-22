import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleMetadata from '@/components/AdminBlogComponents/ArticleMetadata';
import BlockList from '@/components/AdminBlogComponents/BlockList';
import BlockTypeSelector from '@/components/AdminBlogComponents/BlockTypeSelector';
import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';
import { useBlogArticles } from '@/hooks/useBlogArticles';
import { useBlogBlocks } from '@/hooks/useBlogBlocks';
import { useToast } from '@/components/ui/use-toast';
import { generateSlug } from '@/lib/slugGenerator';
import { supabase } from '@/lib/customSupabaseClient';

export default function AdminBlogEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchArticleBySlug, createArticle, updateArticle, publishArticle } = useBlogArticles();
  const { fetchBlocks, createBlock, updateBlock, deleteBlock, reorderBlocks } = useBlogBlocks();
  
  const [article, setArticle] = useState({ title: '', slug: '', status: 'draft', category: '', featured: false });
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data } = await supabase.from('blog_articles').select('*').eq('id', id).single();
      if (data) setArticle(data);
      const bData = await fetchBlocks(id);
      setBlocks(bData || []);
    };
    load();
  }, [id, fetchBlocks]);

  const handleMetadataChange = (data) => {
    if (!id && data.title && !data.slug) data.slug = generateSlug(data.title);
    setArticle(data);
  };

  const handleAddBlock = (type) => {
    setBlocks([...blocks, { block_type: type, block_order: blocks.length, content: {} }]);
  };

  const handleBlockChange = (index, content) => {
    const newBlocks = [...blocks];
    newBlocks[index].content = content;
    setBlocks(newBlocks);
  };

  const handleBlockDelete = async (index) => {
    const b = blocks[index];
    if (b.id) await deleteBlock(b.id);
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleBlockReorder = (index, dir) => {
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + dir];
    newBlocks[index + dir] = temp;
    setBlocks(newBlocks);
  };

  const save = async (publish = false) => {
    try {
      setSaving(true);
      let artId = id;
      if (!artId) {
        const res = await createArticle(article);
        artId = res.id;
        navigate(`/admin/blog/editor/${artId}`, { replace: true });
      } else {
        await updateArticle(artId, article);
      }

      // Save blocks
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.id) await updateBlock(b.id, { content: b.content, block_order: i });
        else {
          const res = await createBlock(artId, { block_type: b.block_type, content: b.content, block_order: i });
          blocks[i].id = res.id;
        }
      }

      if (publish) await publishArticle(artId);
      
      toast({ title: 'Saved Successfully' });
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title={id ? 'Edit Article' : 'Create Article'}>
      <div className="flex justify-end gap-4 mb-6">
        <Button variant="outline" onClick={() => save(false)} disabled={saving}><Save className="w-4 h-4 mr-2" /> Save Draft</Button>
        <Button onClick={() => save(true)} disabled={saving}><Send className="w-4 h-4 mr-2" /> Publish</Button>
      </div>

      <ArticleMetadata data={article} onChange={handleMetadataChange} />
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Content Blocks</h3>
        <BlockList blocks={blocks} onChange={handleBlockChange} onDelete={handleBlockDelete} onReorder={handleBlockReorder} />
      </div>

      <BlockTypeSelector onAdd={handleAddBlock} />
    </AdminLayout>
  );
}