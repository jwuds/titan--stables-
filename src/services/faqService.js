import { supabase } from '@/lib/customSupabaseClient.js';

export const faqService = {
  async getFAQs() {
    const { data, error } = await supabase
      .from('faq_registry')
      .select('*')
      .order('is_priority', { ascending: false })
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createFAQ(faqData) {
    const { data, error } = await supabase
      .from('faq_registry')
      .insert([faqData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateFAQ(id, updates) {
    const { data, error } = await supabase
      .from('faq_registry')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteFAQ(id) {
    const { error } = await supabase.from('faq_registry').delete().eq('id', id);
    if (error) throw error;
  },

  async incrementViewCount(id) {
    // Requires a stored procedure normally, but for simplicity we fetch and increment
    const { data } = await supabase.from('faq_registry').select('view_count').eq('id', id).single();
    if (data) {
      await supabase.from('faq_registry').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id);
    }
  },

  async uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const { error: uploadError, data } = await supabase.storage
      .from('faq-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('faq-images')
      .getPublicUrl(data.path);
      
    return publicUrl;
  }
};