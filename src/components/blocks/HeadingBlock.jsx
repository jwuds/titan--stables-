import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HeadingBlock = ({ data, onChange }) => {
  const [level, setLevel] = useState(data?.level || 'H2');
  const [text, setText] = useState(data?.text || '');

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onChange({ level, text: newText });
  };

  const handleLevelChange = (val) => {
    setLevel(val);
    onChange({ level: val, text });
  };

  const getSeoGuidance = () => {
    if (level === 'H1' && text.length > 70) return "Warning: H1 is usually best under 70 characters.";
    if (text.length === 0) return "Heading is empty.";
    return "Length is good.";
  };

  return (
    <div className="flex flex-col gap-2 w-full bg-background border rounded-md p-3">
      <div className="flex gap-2 items-start">
        <Select value={level} onValueChange={handleLevelChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="H1">Heading 1</SelectItem>
            <SelectItem value="H2">Heading 2</SelectItem>
            <SelectItem value="H3">Heading 3</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={text}
          onChange={handleTextChange}
          placeholder={`Enter ${level} text...`}
          className={`flex-1 ${level === 'H1' ? 'text-2xl font-bold' : level === 'H2' ? 'text-xl font-semibold' : 'text-lg font-medium'}`}
        />
      </div>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span className={text.length > 70 && level === 'H1' ? 'text-amber-500' : ''}>
          {getSeoGuidance()}
        </span>
        <span>{text.length} chars</span>
      </div>
    </div>
  );
};

export default HeadingBlock;