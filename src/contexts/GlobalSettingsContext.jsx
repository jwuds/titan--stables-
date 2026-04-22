import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const GlobalSettingsContext = createContext({
  settings: {},
  loading: true,
  error: null,
  getSettingByKey: () => null,
  getAllSettings: () => ({}),
  updateSetting: async () => {},
  lockSetting: async () => {},
  unlockSetting: async () => {}
});

export const GlobalSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('global_settings')
        .select('*');

      if (fetchError) throw fetchError;

      const settingsMap = data.reduce((acc, item) => {
        acc[item.setting_key] = item;
        return acc;
      }, {});

      setSettings(settingsMap);
      setError(null);
    } catch (err) {
      console.error('Error fetching global settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('global_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'global_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const getSettingByKey = (key) => {
    return settings[key]?.setting_value || null;
  };

  const getAllSettings = () => {
    return settings;
  };

  const updateSetting = async (key, value) => {
    try {
      const { error } = await supabase
        .from('global_settings')
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq('setting_key', key);
        
      if (error) throw error;
      await fetchSettings();
      return { success: true };
    } catch (err) {
      console.error(`Error updating setting ${key}:`, err);
      return { success: false, error: err.message };
    }
  };

  const lockSetting = async (key) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      const { error } = await supabase
        .from('global_settings')
        .update({ 
          is_locked: true, 
          locked_by: userId,
          locked_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('setting_key', key);
        
      if (error) throw error;
      await fetchSettings();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const unlockSetting = async (key) => {
    try {
      // Note: RLS might block this if the setting is strictly locked
      const { error } = await supabase
        .from('global_settings')
        .update({ 
          is_locked: false, 
          locked_by: null,
          locked_at: null,
          updated_at: new Date().toISOString() 
        })
        .eq('setting_key', key);
        
      if (error) throw error;
      await fetchSettings();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    settings,
    loading,
    error,
    getSettingByKey,
    getAllSettings,
    updateSetting,
    lockSetting,
    unlockSetting
  };

  return (
    <GlobalSettingsContext.Provider value={value}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};