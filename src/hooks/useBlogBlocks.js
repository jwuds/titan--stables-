import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useBlogBlocks = () => {
  const [loading, setLoading] = useState(false);

  const fetchBlocks = useCallback(async (articleId) => {
    setLoading(true);
    const { data, error } = await supabase.from('blog_blocks').select('*').eq('article_id', articleId).order('block_order', { ascending: true });
    setLoading(false);
    if (error) throw error;
    return data;
  }, []);

  const createBlock = async (articleId, data) => {
    const { data: res, error } = await supabase.from('blog_blocks').insert([{ article_id: articleId, ...data }]).select().single();
    if (error) throw error;
    return res;
  };

  const updateBlock = async (id, data) => {
    const { data: res, error } = await supabase.from('blog_blocks').update({ ...data, updated_at: new Date() }).eq('id', id).select().single();
    if (error) throw error;
    return res;
  };

  const deleteBlock = async (id) => {
    const { error } = await supabase.from('blog_blocks').delete().eq('id', id);
    if (error) throw error;
  };

  const reorderBlocks = async (articleId, blocks) => {
    const updates = blocks.map((b, i) => ({ id: b.id, article_id: articleId, block_order: i, block_type: b.block_type }));
    const { error } = await supabase.from('blog_blocks').upsert(updates);
    if (error) throw error;
  };

  return { loading, fetchBlocks, createBlock, updateBlock, deleteBlock, reorderBlocks };
};