import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, Trash2, Type, Heading, Image as ImageIcon, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import TextBlock from './blocks/TextBlock';
import HeadingBlock from './blocks/HeadingBlock';
import ImageBlock from './blocks/ImageBlock';

const generateId = () => Math.random().toString(36).substr(2, 9);

const BlogBlockEditor = ({ blocks, onChange }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);

  const addBlock = (type) => {
    const newBlocks = [...blocks, { id: generateId(), type, data: {} }];
    onChange(newBlocks);
  };

  const updateBlock = (id, data) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, data } : b);
    onChange(newBlocks);
  };

  const removeBlock = (id) => {
    const newBlocks = blocks.filter(b => b.id !== id);
    onChange(newBlocks);
  };

  const moveBlock = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[idx];
    newBlocks[idx] = newBlocks[idx + dir];
    newBlocks[idx + dir] = temp;
    onChange(newBlocks);
  };

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null) return;
    if (draggedIdx !== index) {
      const newBlocks = [...blocks];
      const draggedItem = newBlocks[draggedIdx];
      newBlocks.splice(draggedIdx, 1);
      newBlocks.splice(index, 0, draggedItem);
      setDraggedIdx(index);
      onChange(newBlocks);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const renderBlockContent = (block) => {
    switch (block.type) {
      case 'text': return <TextBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />;
      case 'heading': return <HeadingBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />;
      case 'image': return <ImageBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />;
      default: return <div className="p-4 bg-muted">Unknown block type</div>;
    }
  };

  return (
    <div className="flex gap-6 h-full min-h-[600px]">
      {/* Block Palette */}
      <div className="w-48 shrink-0 flex flex-col gap-2">
        <h3 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">Add Blocks</h3>
        <Button variant="outline" className="justify-start gap-2" onClick={() => addBlock('heading')}>
          <Heading className="w-4 h-4" /> Heading
        </Button>
        <Button variant="outline" className="justify-start gap-2" onClick={() => addBlock('text')}>
          <Type className="w-4 h-4" /> Text
        </Button>
        <Button variant="outline" className="justify-start gap-2" onClick={() => addBlock('image')}>
          <ImageIcon className="w-4 h-4" /> Image
        </Button>
        {/* Placeholder for other types */}
      </div>

      {/* Editor Area */}
      <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-lg border border-border overflow-y-auto">
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <Plus className="w-12 h-12 mb-4 opacity-20" />
            <p>No blocks added yet.</p>
            <p className="text-sm">Click a block on the left to start building your post.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {blocks.map((block, idx) => (
              <Card 
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`relative group flex border ${draggedIdx === idx ? 'opacity-50' : 'opacity-100'} transition-opacity`}
              >
                <div className="w-8 bg-muted border-r flex flex-col items-center py-2 gap-2 shrink-0 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="flex-1 p-2 min-w-0">
                  {renderBlockContent(block)}
                </div>

                <div className="w-10 flex flex-col items-center justify-start gap-1 p-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveBlock(idx, -1)} disabled={idx === 0}>
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1}>
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeBlock(block.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogBlockEditor;