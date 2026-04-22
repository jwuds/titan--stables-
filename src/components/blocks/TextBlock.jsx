import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Underline, Link as LinkIcon } from 'lucide-react';

const TextBlock = ({ data, onChange }) => {
  const [text, setText] = useState(data?.text || '');

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onChange({ text: newText });
  };

  const insertFormat = (tag) => {
    const textarea = document.getElementById('text-block-area');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    let formattedText = '';
    
    switch(tag) {
        case 'b': formattedText = `**${selectedText || 'bold text'}**`; break;
        case 'i': formattedText = `*${selectedText || 'italic text'}*`; break;
        case 'u': formattedText = `<u>${selectedText || 'underlined text'}</u>`; break;
        case 'link': formattedText = `[${selectedText || 'link text'}](url)`; break;
        default: formattedText = selectedText;
    }
    
    const newFullText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newFullText);
    onChange({ text: newFullText });
  };

  return (
    <div className="flex flex-col gap-2 w-full bg-background border rounded-md p-2">
      <div className="flex gap-1 border-b pb-2">
        <Button variant="ghost" size="sm" onClick={() => insertFormat('b')}><Bold className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => insertFormat('i')}><Italic className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => insertFormat('u')}><Underline className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => insertFormat('link')}><LinkIcon className="w-4 h-4" /></Button>
      </div>
      <Textarea
        id="text-block-area"
        value={text}
        onChange={handleChange}
        placeholder="Write your paragraph here... (Markdown supported)"
        className="min-h-[120px] border-none focus-visible:ring-0 resize-y"
      />
      <div className="text-xs text-muted-foreground text-right pr-2">
        {text.length} characters
      </div>
    </div>
  );
};

export default TextBlock;