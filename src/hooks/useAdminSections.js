import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useAdminSections = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (table) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(table).select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (table, item) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(table).insert([item]).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (table, id) => {
    setLoading(true);
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getGlobalStandardImages: () => fetchItems('global_standard_images'),
    getGlobalDeliveryImages: () => fetchItems('global_delivery_images'),
    getDeliveryReachVideos: () => fetchItems('delivery_reach_videos'),
    getTeamMembers: () => fetchItems('team_members'),
    addGlobalStandardImage: (item) => addItem('global_standard_images', item),
    addGlobalDeliveryImage: (item) => addItem('global_delivery_images', item),
    addDeliveryReachVideo: (item) => addItem('delivery_reach_videos', item),
    addTeamMember: (item) => addItem('team_members', item),
    deleteGlobalStandardImage: (id) => deleteItem('global_standard_images', id),
    deleteGlobalDeliveryImage: (id) => deleteItem('global_delivery_images', id),
    deleteDeliveryReachVideo: (id) => deleteItem('delivery_reach_videos', id),
    deleteTeamMember: (id) => deleteItem('team_members', id),
  };
};