
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Pencil, Trash2, Plus, X, Save } from 'lucide-react';
import { fetchAboutContent, updateAboutContent, createAboutContent, deleteAboutContent } from '@/lib/aboutContent';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminAboutContentPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    section_name: '',
    image_url: '',
    text_content: ''
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    const { data, error } = await fetchAboutContent();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load about content sections',
        variant: 'destructive'
      });
    } else {
      setSections(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      section_name: section.section_name,
      image_url: section.image_url || '',
      text_content: section.text_content || ''
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingSection(null);
    setFormData({
      section_name: '',
      image_url: '',
      text_content: ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.section_name || !formData.text_content) {
      toast({
        title: 'Validation Error',
        description: 'Section name and text content are required',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);

    let result;
    if (editingSection) {
      result = await updateAboutContent(editingSection.id, formData);
    } else {
      result = await createAboutContent(
        formData.section_name,
        formData.image_url,
        formData.text_content
      );
    }

    setSaving(false);

    if (result.error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingSection ? 'update' : 'create'} section`,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: `Section ${editingSection ? 'updated' : 'created'} successfully`
      });
      setIsDialogOpen(false);
      loadSections();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    const { error } = await deleteAboutContent(id);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete section',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Section deleted successfully'
      });
      loadSections();
    }
  };

  return (
    <>
      <Helmet>
        <title>About Content Manager - Titan Stables Admin</title>
      </Helmet>

      <div className="admin-about-content p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#D4AF37]">About Content Manager</h1>
          <Button onClick={handleCreate} className="bg-[#D4AF37] hover:bg-[#B8860B] text-black">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section Name</TableHead>
                  <TableHead>Image Preview</TableHead>
                  <TableHead>Text Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{section.section_name}</TableCell>
                    <TableCell>
                      {section.image_url && (
                        <img
                          src={section.image_url}
                          alt={section.section_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md truncate text-sm text-gray-600">
                        {section.text_content}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(section)}
                          className="border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(section.id)}
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? 'Edit Section' : 'Create New Section'}
              </DialogTitle>
              <DialogDescription>
                {editingSection ? 'Update the section details below' : 'Add a new about content section'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="section_name">Section Name</Label>
                <Input
                  id="section_name"
                  value={formData.section_name}
                  onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
                  placeholder="e.g., heritage_mission"
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="text_content">Text Content</Label>
                <Textarea
                  id="text_content"
                  value={formData.text_content}
                  onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                  placeholder="Enter the section text content..."
                  rows={8}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-black"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminAboutContentPage;
