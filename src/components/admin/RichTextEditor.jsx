import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, Italic, List, Link, Image, Code, Quote, Eye, Edit2, Heading1, Heading2 
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, className }) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormat = (prefix, suffix = '') => {
    const textarea = document.getElementById('editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || '';
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newValue = `${before}${prefix}${selection}${suffix}${after}`;
    onChange(newValue);
    
    // Restore focus and cursor (approximate)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const SimpleMarkdownRender = ({ content }) => {
    if (!content) return <p className="text-slate-400 italic">Nothing to preview...</p>;
    
    // Very basic markdown parsing for preview
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-3 mb-2">{line.replace('## ', '')}</h2>;
          if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
          if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-slate-300 pl-4 italic my-2">{line.replace('> ', '')}</blockquote>;
          return <p key={i} className="mb-2 min-h-[1rem]">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className={cn("border rounded-md bg-white overflow-hidden", className)}>
      <div className="flex items-center justify-between p-2 border-b bg-slate-50">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => insertFormat('**', '**')} title="Bold">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertFormat('*', '*')} title="Italic">
            <Italic className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <Button variant="ghost" size="sm" onClick={() => insertFormat('# ')} title="Heading 1">
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertFormat('## ')} title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <Button variant="ghost" size="sm" onClick={() => insertFormat('- ')} title="List">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertFormat('> ')} title="Quote">
            <Quote className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <Button variant="ghost" size="sm" onClick={() => insertFormat('[', '](url)')} title="Link">
            <Link className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertFormat('![alt](', ')')} title="Image">
            <Image className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertFormat('`', '`')} title="Code">
            <Code className="w-4 h-4" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsPreview(!isPreview)}
          className={cn("gap-2", isPreview && "bg-slate-200")}
        >
          {isPreview ? <Edit2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      <div className="relative min-h-[300px]">
        {isPreview ? (
          <div className="p-4 h-full overflow-y-auto bg-white min-h-[300px]">
            <SimpleMarkdownRender content={value} />
          </div>
        ) : (
          <Textarea
            id="editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full min-h-[300px] border-0 focus-visible:ring-0 rounded-none resize-y p-4 font-mono text-sm"
            placeholder="Write your masterpiece..."
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;