import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useHorseFacts = () => {
  const [loading, setLoading] = useState(false);

  const fetchAllBreeds = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('horse_facts_library').select('*').order('breed_name');
    setLoading(false);
    if (error) throw error;
    return data;
  }, []);

  const fetchBreedByName = async (name) => {
    const { data, error } = await supabase.from('horse_facts_library').select('*').eq('breed_name', name).single();
    if (error) throw error;
    return data;
  };

  const createBreed = async (data) => {
    const { data: res, error } = await supabase.from('horse_facts_library').insert([data]).select().single();
    if (error) throw error;
    return res;
  };

  const updateBreed = async (id, data) => {
    const { data: res, error } = await supabase.from('horse_facts_library').update({ ...data, updated_at: new Date() }).eq('id', id).select().single();
    if (error) throw error;
    return res;
  };

  const deleteBreed = async (id) => {
    const { error } = await supabase.from('horse_facts_library').delete().eq('id', id);
    if (error) throw error;
  };

  const getBreedFacts = async (breedName) => {
    try {
      return await fetchBreedByName(breedName);
    } catch {
      return null;
    }
  };

  return { loading, fetchAllBreeds, fetchBreedByName, createBreed, updateBreed, deleteBreed, getBreedFacts };
};