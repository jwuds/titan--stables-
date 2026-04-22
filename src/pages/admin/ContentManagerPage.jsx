import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Save, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContentManagerPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState(null);
  const { toast } = useToast();

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load site content."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleValueChange = (key, newValue) => {
    setContent(prev => prev.map(item => 
      item.key === key ? { ...item, value: newValue, isDirty: true } : item
    ));
  };

  const handleSave = async (item) => {
    setSavingId(item.key);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          key: item.key,
          value: item.value,
          type: item.type,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setContent(prev => prev.map(p => 
        p.key === item.key ? { ...p, isDirty: false } : p
      ));

      toast({ title: "Saved", description: `Updated ${item.key}` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save changes." });
    } finally {
      setSavingId(null);
    }
  };

  const filteredContent = content.filter(item => 
    item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.value && item.value.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AdminLayout title="Site Content Manager">
      <Helmet>
        <title>Manage Content - Admin Dashboard</title>
      </Helmet>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search content keys or values..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchContent}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            Loading content...
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No content found matching your search.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredContent.map((item) => (
              <div key={item.key} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row gap-4 md:items-start">
                  <div className="md:w-1/3">
                    <h3 className="font-mono text-sm font-semibold text-slate-700 break-all">{item.key}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded uppercase">
                      {item.type || 'text'}
                    </span>
                  </div>
                  <div className="md:w-2/3 space-y-3">
                    {item.type === 'textarea' ? (
                      <Textarea 
                        value={item.value || ''}
                        onChange={(e) => handleValueChange(item.key, e.target.value)}
                        className="font-mono text-sm min-h-[100px]"
                      />
                    ) : (
                      <Input 
                        value={item.value || ''}
                        onChange={(e) => handleValueChange(item.key, e.target.value)}
                        className="font-mono text-sm"
                      />
                    )}
                    
                    {item.isDirty && (
                      <div className="flex justify-end animate-in fade-in">
                        <Button 
                          size="sm" 
                          onClick={() => handleSave(item)}
                          disabled={savingId === item.key}
                        >
                          {savingId === item.key ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentManagerPage;