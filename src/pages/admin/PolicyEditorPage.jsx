import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const SECTIONS = [
  { id: 'policy_payment', name: 'Payment Policy' },
  { id: 'policy_shipping', name: 'Shipping Policy' },
  { id: 'policy_refund', name: 'Refund Policy' },
  { id: 'policy_privacy', name: 'Privacy Policy' },
  { id: 'policy_terms', name: 'Terms & Conditions' },
  { id: 'about_story', name: 'About Us - Story' },
  { id: 'about_team', name: 'About Us - Team' },
  { id: 'services_export', name: 'Services - Export' },
];

const PolicyEditorPage = () => {
  const { content, updateContent, loading } = useContent();
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState(SECTIONS[0].id);
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load content when section changes
  useEffect(() => {
    if (!loading) {
      setEditorContent(content[selectedSection] || '');
    }
  }, [selectedSection, content, loading]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContent(selectedSection, editorContent, 'textarea');
      toast({ title: "Content Saved", description: "Changes are live immediately." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Long-Form Content Editor">
      <Helmet><title>Content Editor - Admin</title></Helmet>
      
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Edit Core Pages</CardTitle>
                <CardDescription>Select a section below to edit its content using the rich text editor.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-1/2 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Section to Edit</label>
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                            {SECTIONS.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </CardContent>
        </Card>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <RichTextEditor 
                value={editorContent} 
                onChange={setEditorContent} 
                className="min-h-[600px] border-none"
            />
        </div>
      </div>
    </AdminLayout>
  );
};

export default PolicyEditorPage;