import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress.jsx';
import { validateSeoScore } from '@/lib/blogSeoUtils';
import { useToast } from '@/components/ui/use-toast';

const SEOSettings = ({ seoData, onChange, post }) => {
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const calculatedScore = validateSeoScore(post, seoData);
      setScore(calculatedScore);
    } catch (err) {
      console.error("Score validation error:", err);
      setScore(0);
    }
  }, [seoData, post]);

  const handleChange = (e) => {
    try {
      onChange({ ...seoData, [e.target.name]: e.target.value });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Input Error', description: 'Failed to update field value.' });
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">SEO Settings</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">SEO Score:</span>
          <div className="w-32"><Progress value={score} className="h-2" /></div>
          <span className={`text-sm font-bold ${score > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>{score}/100</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between">
            <Label htmlFor="meta_title">Meta Title</Label>
            <span className={`text-xs ${seoData?.meta_title?.length >= 50 && seoData?.meta_title?.length <= 60 ? 'text-emerald-500' : 'text-slate-400'}`}>
              {seoData?.meta_title?.length || 0} / 60
            </span>
          </div>
          <Input id="meta_title" name="meta_title" value={seoData?.meta_title || ''} onChange={handleChange} className="text-slate-900" />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="meta_description">Meta Description</Label>
            <span className={`text-xs ${seoData?.meta_description?.length >= 150 && seoData?.meta_description?.length <= 160 ? 'text-emerald-500' : 'text-slate-400'}`}>
              {seoData?.meta_description?.length || 0} / 160
            </span>
          </div>
          <Textarea id="meta_description" name="meta_description" value={seoData?.meta_description || ''} onChange={handleChange} rows={3} className="text-slate-900" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="focus_keyword">Focus Keyword</Label>
            <Input id="focus_keyword" name="focus_keyword" value={seoData?.focus_keyword || ''} onChange={handleChange} className="text-slate-900" />
          </div>
          <div>
            <Label htmlFor="h1_tag">H1 Tag</Label>
            <Input id="h1_tag" name="h1_tag" value={seoData?.h1_tag || ''} onChange={handleChange} className="text-slate-900" />
          </div>
        </div>

        <div>
          <Label htmlFor="meta_keywords">Meta Keywords (comma separated)</Label>
          <Input id="meta_keywords" name="meta_keywords" value={seoData?.meta_keywords || ''} onChange={handleChange} className="text-slate-900" />
        </div>

        <div>
          <Label htmlFor="canonical_url">Canonical URL</Label>
          <Input id="canonical_url" name="canonical_url" value={seoData?.canonical_url || ''} onChange={handleChange} className="text-slate-900" />
        </div>
      </div>
    </div>
  );
};

export default SEOSettings;