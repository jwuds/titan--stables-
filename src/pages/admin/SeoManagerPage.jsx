import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContent } from '@/contexts/ContentContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Save, AlertTriangle, Check, Loader2 } from 'lucide-react';

const PAGES = [
  { id: 'home', name: 'Home Page', path: '/' },
  { id: 'horses', name: 'Horses for Sale', path: '/horses' },
  { id: 'facility', name: 'Facility & Boarding', path: '/facility' },
  { id: 'services', name: 'Services', path: '/services' },
  { id: 'about', name: 'About Us', path: '/about' },
  { id: 'contact', name: 'Contact', path: '/contact' },
  { id: 'policies', name: 'Policies', path: '/policies' },
  { id: 'faq', name: 'FAQ', path: '/faq' },
  { id: 'login', name: 'Login', path: '/login' },
  { id: 'signup', name: 'Sign Up', path: '/signup' },
];

const SeoManagerPage = () => {
  const { content, updateContent, loading } = useContent();
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState('home');
  const [formData, setFormData] = useState({ title: '', desc: '', keywords: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [keywordWarning, setKeywordWarning] = useState(null);

  // Load data when page selection changes or content loads
  useEffect(() => {
    if (!loading) {
      setFormData({
        title: content[`seo_${selectedPage}_title`] || '',
        desc: content[`seo_${selectedPage}_desc`] || '',
        keywords: content[`seo_${selectedPage}_keywords`] || ''
      });
    }
  }, [selectedPage, content, loading]);

  // Keyword Uniqueness Validation
  useEffect(() => {
    const primaryKeyword = formData.keywords.split(',')[0].trim().toLowerCase();
    if (!primaryKeyword) {
      setKeywordWarning(null);
      return;
    }

    // Check if this primary keyword is used on any OTHER page
    const duplicatePage = PAGES.find(p => {
      if (p.id === selectedPage) return false;
      const otherKeywords = content[`seo_${p.id}_keywords`];
      if (!otherKeywords) return false;
      const otherPrimary = otherKeywords.split(',')[0].trim().toLowerCase();
      return otherPrimary === primaryKeyword;
    });

    if (duplicatePage) {
      setKeywordWarning(`Primary keyword "${primaryKeyword}" is already used on ${duplicatePage.name}. Please assign a unique primary keyword.`);
    } else {
      setKeywordWarning(null);
    }
  }, [formData.keywords, selectedPage, content]);

  const handleSave = async () => {
    if (keywordWarning) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Cannot save: Primary keyword must be unique across all pages.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        updateContent(`seo_${selectedPage}_title`, formData.title),
        updateContent(`seo_${selectedPage}_desc`, formData.desc),
        updateContent(`seo_${selectedPage}_keywords`, formData.keywords)
      ]);
      toast({ title: "SEO Settings Saved", description: `Updated SEO for ${PAGES.find(p => p.id === selectedPage)?.name}` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save SEO settings." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="SEO Strategy Manager">
      <Helmet><title>SEO Manager - Admin</title></Helmet>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar: Page List */}
        <div className="w-full lg:w-1/4 bg-white rounded-lg border border-slate-200 overflow-hidden h-fit">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">Select Page</div>
          <div className="flex flex-col">
            {PAGES.map(page => {
               // Check if SEO is configured for this page
               const isConfigured = content[`seo_${page.id}_title`] && content[`seo_${page.id}_keywords`];
               
               return (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`p-4 text-left border-l-4 transition-all hover:bg-slate-50 flex justify-between items-center ${
                    selectedPage === page.id 
                      ? 'border-l-primary bg-primary/5 text-primary font-medium' 
                      : 'border-l-transparent text-slate-600'
                  }`}
                >
                  <span>{page.name}</span>
                  {isConfigured && <Check className="w-4 h-4 text-green-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Editor */}
        <div className="w-full lg:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Edit Metadata: <span className="text-primary">{PAGES.find(p => p.id === selectedPage)?.name}</span>
              </CardTitle>
              <CardDescription>
                Configure how this page appears in search engines and social media.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="title">Page Title (H1 / Meta Title)</Label>
                <div className="relative">
                    <Input 
                      id="title"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. Friesian Horses for Sale | Titan Stables"
                      className="pr-20"
                    />
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${formData.title.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>
                        {formData.title.length}/60
                    </span>
                </div>
                <p className="text-xs text-slate-500">Include your primary keyword near the beginning.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input 
                  id="keywords"
                  value={formData.keywords}
                  onChange={e => setFormData({...formData, keywords: e.target.value})}
                  placeholder="primary keyword, secondary keyword, related term"
                  className={keywordWarning ? "border-red-500 bg-red-50" : ""}
                />
                {keywordWarning ? (
                  <div className="flex items-center gap-2 text-red-600 text-xs mt-1 font-medium animate-pulse">
                     <AlertTriangle className="w-3 h-3" /> {keywordWarning}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">First keyword is your <strong>Primary Keyword</strong> and must be unique to this page.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Meta Description</Label>
                <div className="relative">
                    <Textarea 
                      id="desc"
                      value={formData.desc}
                      onChange={e => setFormData({...formData, desc: e.target.value})}
                      placeholder="A compelling summary of the page content..."
                      rows={4}
                    />
                    <span className={`absolute right-3 bottom-3 text-xs ${formData.desc.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
                        {formData.desc.length}/160
                    </span>
                </div>
              </div>

              {/* SERP Preview */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Google Search Preview</h4>
                 <div className="bg-white p-4 rounded shadow-sm max-w-2xl font-sans">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center">
                            <img src="/favicon.ico" alt="" className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="flex flex-col">
                             <span className="text-sm text-slate-800">Titan Stables</span>
                             <span className="text-xs text-slate-500">https://titanstables.com{PAGES.find(p => p.id === selectedPage)?.path}</span>
                        </div>
                    </div>
                    <div className="text-[#1a0dab] text-xl font-medium cursor-pointer hover:underline truncate">
                        {formData.title || "Page Title"}
                    </div>
                    <div className="text-sm text-[#4d5156] mt-1 line-clamp-2">
                        {formData.desc || "Page description will appear here..."}
                    </div>
                 </div>
              </div>

              <div className="flex justify-end pt-4">
                 <Button onClick={handleSave} disabled={isSaving || !!keywordWarning}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Settings
                 </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SeoManagerPage;