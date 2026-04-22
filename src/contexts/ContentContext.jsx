import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ContentContext = createContext(undefined);

const DEFAULT_CONTENT = {
  contact_email: 'sales@titanstables.org',
  contact_mobile: '515 705 4429',
  contact_whatsapp: '+1 (276) 329 8032',
  contact_address: 'Titan Stables, 13486 Cedar View Rd, Drewryville, VA 23844, United States',
  site_favicon: 'https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/8fcd88a19a82ef0d21d69644281d7338.jpg'
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) throw error;

      const contentMap = {};
      data?.forEach(item => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
    } catch (error) {
      console.error('Error fetching site content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateContent = async (key, value, type = 'text') => {
    try {
      setContent(prev => ({ ...prev, [key]: value }));

      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          key, 
          value, 
          type,
          updated_at: new Date().toISOString() 
        });

      if (error) throw error;

      toast({
        title: "Content Updated",
        description: "Changes saved successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save changes.",
      });
      return false;
    }
  };

  const getContent = (key, defaultValue) => {
    if (content[key] !== undefined) return content[key];
    if (defaultValue !== undefined) return defaultValue;
    return DEFAULT_CONTENT[key] || '';
  };

  return (
    <ContentContext.Provider value={{ content, loading, updateContent, getContent, refresh: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};