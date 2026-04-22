import React, { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Save, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PLATFORMS = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'YouTube', 'TikTok'];

const DEFAULT_LINKS = [
  { platform: 'Facebook', url: 'https://www.facebook.com/share/1AtuzRi5oB/', active: true },
  { platform: 'Instagram', url: 'https://www.instagram.com/titanstables?igsh=eHF6OGduaTI5Z2Ri', active: true }
];

const SocialMediaManager = () => {
  const { getContent, updateContent, loading } = useContent();
  const [links, setLinks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      const stored = getContent('social_media_links');
      if (stored) {
        try {
          const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
          setLinks(parsed.length > 0 ? parsed : DEFAULT_LINKS);
        } catch (e) {
          setLinks(DEFAULT_LINKS);
        }
      } else {
        setLinks(DEFAULT_LINKS);
      }
    }
  }, [loading, getContent]);

  const handleAddLink = () => {
    setLinks([...links, { platform: 'Instagram', url: '', active: true }]);
  };

  const handleRemoveLink = (index) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };

  const handleChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Store as JSON string in site_content
      const success = await updateContent('social_media_links', JSON.stringify(links), 'json');
      if (success) {
        toast({ title: "Success", description: "Social media links updated successfully." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save changes." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Manage your social media profiles and URLs displayed in the footer.</CardDescription>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {links.map((link, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end p-4 border rounded-lg bg-slate-50/50">
              <div className="w-full sm:w-1/4 space-y-2">
                <Label>Platform</Label>
                <Select 
                  value={link.platform} 
                  onValueChange={(val) => handleChange(index, 'platform', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-1/2 space-y-2">
                <Label>Profile URL</Label>
                <div className="relative">
                  <Input 
                    value={link.url} 
                    onChange={(e) => handleChange(index, 'url', e.target.value)}
                    placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                  />
                  {link.url && (
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 pb-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`active-${index}`}
                    checked={link.active}
                    onChange={(e) => handleChange(index, 'active', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`active-${index}`} className="text-xs text-muted-foreground cursor-pointer">Visible</Label>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveLink(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={handleAddLink} className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Add Social Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaManager;