
import { supabase } from '@/lib/customSupabaseClient';

export const fetchAboutContent = async () => {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .order('section_name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching about content:', error);
    return { data: null, error: error.message };
  }
};

export const fetchAboutContentBySection = async (sectionName) => {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .eq('section_name', sectionName)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching about content by section:', error);
    return { data: null, error: error.message };
  }
};

export const updateAboutContent = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating about content:', error);
    return { data: null, error: error.message };
  }
};

export const createAboutContent = async (sectionName, imageUrl, textContent) => {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .insert([
        {
          section_name: sectionName,
          image_url: imageUrl,
          text_content: textContent
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating about content:', error);
    return { data: null, error: error.message };
  }
};

export const deleteAboutContent = async (id) => {
  try {
    const { error } = await supabase
      .from('about_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting about content:', error);
    return { error: error.message };
  }
};
