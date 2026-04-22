import React, { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Editable = ({ 
  name, 
  defaultValue, 
  type = 'text', // 'text' | 'textarea'
  className, 
  as: Component = 'div',
  ...props 
}) => {
  const { getContent, updateContent } = useContent();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const savedValue = getContent(name, defaultValue);
  const [tempValue, setTempValue] = useState(savedValue);

  // Update temp value when content changes externally or loads
  useEffect(() => {
    setTempValue(savedValue);
  }, [savedValue]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateContent(name, tempValue, type);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(savedValue);
    setIsEditing(false);
  };

  if (!user) {
    // Render regular content if not logged in
    return (
      <Component className={className} {...props}>
        {savedValue}
      </Component>
    );
  }

  if (isEditing) {
    return (
      <div className="relative group animate-in fade-in zoom-in-95 duration-200">
        {type === 'textarea' ? (
          <Textarea 
            value={tempValue} 
            onChange={(e) => setTempValue(e.target.value)}
            className={cn("min-h-[100px] bg-white/90 text-slate-900", className)}
            autoFocus
          />
        ) : (
          <Input 
            value={tempValue} 
            onChange={(e) => setTempValue(e.target.value)}
            className={cn("bg-white/90 text-slate-900 h-auto py-1", className)}
            autoFocus
          />
        )}
        <div className="absolute -top-10 right-0 z-50 flex gap-2 bg-white p-1 rounded shadow-lg border border-slate-200">
          <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0 text-red-500">
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group inline-block max-w-full">
      <Component className={cn(className, "border-2 border-transparent hover:border-dashed hover:border-primary/50 rounded transition-all cursor-pointer")} {...props}>
        {savedValue}
      </Component>
      <Button 
        size="icon" 
        variant="secondary"
        className="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default Editable;