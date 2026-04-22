import React, { useState, useEffect } from 'react';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { validatePhoneNumber, formatPhoneNumber, getWhatsAppLink } from '@/lib/phoneFormatter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save, Lock, Unlock, AlertTriangle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminGlobalSettingsPage = () => {
  const { settings, loading, updateSetting, lockSetting, unlockSetting } = useGlobalSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    primary_mobile: '',
    primary_whatsapp: '',
    whatsapp_link: '',
    company_name: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() => {
    if (!loading && Object.keys(settings).length > 0) {
      setFormData({
        primary_mobile: settings.primary_mobile?.setting_value || '',
        primary_whatsapp: settings.primary_whatsapp?.setting_value || '',
        whatsapp_link: settings.whatsapp_link?.setting_value || '',
        company_name: settings.company_name?.setting_value || ''
      });
    }
  }, [settings, loading]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Auto-update whatsapp link if whatsapp number changes
    if (key === 'primary_whatsapp') {
      const link = getWhatsAppLink(value);
      setFormData(prev => ({ ...prev, whatsapp_link: link }));
    }
  };

  const handleSave = async (key) => {
    const value = formData[key];
    
    if ((key === 'primary_mobile' || key === 'primary_whatsapp') && !validatePhoneNumber(value)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number with country code.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    const result = await updateSetting(key, value);
    
    // If whatsapp number is updated, also update the link silently
    if (key === 'primary_whatsapp' && result.success) {
       await updateSetting('whatsapp_link', formData.whatsapp_link);
    }

    setIsSaving(false);
    setEditingKey(null);

    if (result.success) {
      toast({ title: "Settings Updated", description: "The global setting has been saved successfully." });
    } else {
      toast({ title: "Update Failed", description: result.error, variant: "destructive" });
    }
  };

  const handleToggleLock = async (key, isLocked) => {
    const action = isLocked ? unlockSetting : lockSetting;
    const result = await action(key);
    
    if (result.success) {
      toast({ title: isLocked ? "Unlocked" : "Locked", description: `Setting has been ${isLocked ? 'unlocked' : 'locked'}.` });
    } else {
      toast({ 
        title: "Action Failed", 
        description: "You may not have permission to modify core locked settings.", 
        variant: "destructive" 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  const renderSettingRow = (key, label, type = "text") => {
    const settingObj = settings[key];
    const isLocked = settingObj?.is_locked;
    const isEditing = editingKey === key;
    const lastUpdated = settingObj?.updated_at ? new Date(settingObj.updated_at).toLocaleString() : 'Never';

    return (
      <div className="flex flex-col space-y-2 p-4 border rounded-lg bg-slate-50/50 mb-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-semibold">{label}</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Last updated: {lastUpdated}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleToggleLock(key, isLocked)}
              title={isLocked ? "Unlock setting" : "Lock setting"}
            >
              {isLocked ? <Lock className="w-4 h-4 text-amber-500" /> : <Unlock className="w-4 h-4 text-slate-400" />}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <Input 
              type={type}
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              disabled={isLocked && !isEditing}
              className={`bg-white text-slate-900 ${isLocked ? 'border-amber-200 bg-amber-50/30' : ''}`}
            />
            {type === 'phone' && formData[key] && (
              <p className="text-xs text-slate-500 mt-1">Formatted: {formatPhoneNumber(formData[key])}</p>
            )}
          </div>
          
          {(!isLocked || isEditing) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isSaving || formData[key] === settingObj?.setting_value}>
                  {isSaving && editingKey === key ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Change</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update this global setting? This will affect the public website immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleSave(key)}>Confirm Update</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        {isLocked && settingObj?.description && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
            <AlertTriangle className="w-3 h-3" />
            <span>This is a core system setting. Proceed with caution.</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Global Settings</h2>
        <p className="text-muted-foreground">
          Manage core application settings, contact information, and global variables.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update the primary contact details used across the website.</CardDescription>
        </CardHeader>
        <CardContent>
          {renderSettingRow('primary_mobile', 'Primary Mobile Number', 'phone')}
          {renderSettingRow('primary_whatsapp', 'Primary WhatsApp Number', 'phone')}
          {renderSettingRow('whatsapp_link', 'WhatsApp Direct Link (Auto-generated)', 'url')}
          {renderSettingRow('company_name', 'Company Name', 'text')}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGlobalSettingsPage;