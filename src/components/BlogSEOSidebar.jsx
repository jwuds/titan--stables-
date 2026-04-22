import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { calculateSEOScore, validateFocusKeyword, validateMetaDescription, checkKeywordDensity } from '@/lib/seoValidation';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const BlogSEOSidebar = ({ seoData, setSeoData, contentBlocks }) => {
  const [score, setScore] = useState(0);
  const [validations, setValidations] = useState({});

  useEffect(() => {
    const postObj = {
      ...seoData,
      content_json: contentBlocks
    };
    setScore(calculateSEOScore(postObj));
    
    setValidations({
      keyword: validateFocusKeyword(seoData.focus_keyword, contentBlocks),
      meta: validateMetaDescription(seoData.meta_description),
      density: checkKeywordDensity(seoData.focus_keyword, contentBlocks)
    });
  }, [seoData, contentBlocks]);

  const handleChange = (field, value) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const StatusIcon = ({ status }) => {
    if (status === 'pass') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <Info className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border h-full overflow-y-auto">
      <div>
        <h3 className="text-lg font-semibold mb-4">SEO Overview</h3>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <Progress value={score} className="h-2" indicatorClassName={score > 70 ? 'bg-green-500' : score > 40 ? 'bg-amber-500' : 'bg-red-500'} />
          </div>
          <span className="font-bold text-lg w-12 text-right">{score}/100</span>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="focus_keyword">Focus Keyword</Label>
        <Input 
          id="focus_keyword" 
          value={seoData.focus_keyword || ''} 
          onChange={(e) => handleChange('focus_keyword', e.target.value)}
          placeholder="e.g., friesian horse training"
        />
        {validations.keyword && (
          <div className="flex items-start gap-2 text-sm mt-1">
            <StatusIcon status={validations.keyword.status} />
            <span className="text-muted-foreground">{validations.keyword.message}</span>
          </div>
        )}
        {validations.density && seoData.focus_keyword && (
           <div className="flex items-start gap-2 text-sm mt-1">
           <StatusIcon status={validations.density.status} />
           <span className="text-muted-foreground">{validations.density.message}</span>
         </div>
        )}
      </div>

      <div className="grid gap-2">
        <div className="flex justify-between items-end">
          <Label htmlFor="meta_description">Meta Description</Label>
          <span className="text-xs text-muted-foreground">{(seoData.meta_description || '').length}/160</span>
        </div>
        <Textarea 
          id="meta_description" 
          value={seoData.meta_description || ''} 
          onChange={(e) => handleChange('meta_description', e.target.value)}
          className="resize-none h-24"
        />
        {validations.meta && (
          <div className="flex items-start gap-2 text-sm mt-1">
            <StatusIcon status={validations.meta.status} />
            <span className="text-muted-foreground">{validations.meta.message}</span>
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="canonical_url">Canonical URL</Label>
        <Input 
          id="canonical_url" 
          value={seoData.canonical_url || ''} 
          onChange={(e) => handleChange('canonical_url', e.target.value)}
          placeholder="https://example.com/blog/..."
        />
      </div>

      <div className="grid gap-4 mt-2">
        <div className="grid gap-2">
          <Label>Target Region</Label>
          <Select value={seoData.geo_target || 'global'} onValueChange={(v) => handleChange('geo_target', v)}>
            <SelectTrigger><SelectValue placeholder="Select Region" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="USA">USA</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Netherlands">Netherlands</SelectItem>
              <SelectItem value="Mexico">Mexico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Language</Label>
          <Select value={seoData.language_code || 'en'} onValueChange={(v) => handleChange('language_code', v)}>
            <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BlogSEOSidebar;