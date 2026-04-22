import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { faqService } from '@/services/faqService';
import FAQImageUpload from './FAQImageUpload';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['Import', 'Care', 'Dressage', 'General', 'Breeding', 'Health'];
const GEO_TARGETS = ['Virginia', 'USA', 'International', 'Europe'];

export default function FAQForm({ initialData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    geo_target: 'International',
    is_priority: false,
    is_featured: false,
    image_url: null,
    display_order: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
        await faqService.updateFAQ(initialData.id, formData);
        toast({ title: 'FAQ Updated', description: 'The FAQ has been updated successfully.' });
      } else {
        await faqService.createFAQ(formData);
        toast({ title: 'FAQ Created', description: 'New FAQ added successfully.' });
      }
      onSuccess();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Question <span className="text-red-500">*</span></Label>
        <Input
          id="question"
          required
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="e.g., How much does international shipping cost?"
          className="text-gray-900"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="answer">Answer <span className="text-red-500">*</span></Label>
        <Textarea
          id="answer"
          required
          rows={5}
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          placeholder="Detailed answer here..."
          className="text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent className="bg-white">
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Geo-Target</Label>
          <Select value={formData.geo_target} onValueChange={(v) => setFormData({ ...formData, geo_target: v })}>
            <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
            <SelectContent className="bg-white">
              {GEO_TARGETS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-6 py-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(c) => setFormData({ ...formData, is_featured: c })}
          />
          <Label htmlFor="is_featured">Featured FAQ</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_priority"
            checked={formData.is_priority}
            onCheckedChange={(c) => setFormData({ ...formData, is_priority: c })}
          />
          <Label htmlFor="is_priority">High Priority</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Optional Image</Label>
        <FAQImageUpload
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?.id ? 'Update FAQ' : 'Save FAQ'}
        </Button>
      </div>
    </form>
  );
}