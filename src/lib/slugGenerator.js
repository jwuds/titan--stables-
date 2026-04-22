import { supabase } from './customSupabaseClient';

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const validateSlug = async (slug, excludeId = null) => {
  let query = supabase.from('blog_articles').select('id').eq('slug', slug);
  if (excludeId) query = query.neq('id', excludeId);
  const { data } = await query;
  return data && data.length === 0;
};