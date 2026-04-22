import React, { useState, useEffect } from 'react';
import { useContactInfo } from '@/hooks/useContactInfo';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Save, X, Loader2, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import SEO from '@/components/SEO';

const AdminContactInfoPage = () => {
  const { user } = useAuth();
  const { contactInfo, loading, updateContactInfo } = useContactInfo();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    street_address: '',
    phone_number: '',
    whatsapp_number: '',
    email_address: '',
    google_maps_url: ''
  });

  useEffect(() => {
    if (contactInfo && !loading) {
      setFormData({
        street_address: contactInfo.street_address || '',
        phone_number: contactInfo.phone_number || '',
        whatsapp_number: contactInfo.whatsapp_number || '',
        email_address: contactInfo.email_address || '',
        google_maps_url: contactInfo.google_maps_url || ''
      });
    }
  }, [contactInfo, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateContactInfo(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: "Contact information has been updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update contact information.",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  const handleCancel = () => {
    if (contactInfo) {
      setFormData({
        street_address: contactInfo.street_address || '',
        phone_number: contactInfo.phone_number || '',
        whatsapp_number: contactInfo.whatsapp_number || '',
        email_address: contactInfo.email_address || '',
        google_maps_url: contactInfo.google_maps_url || ''
      });
    }
    toast({
      description: "Changes cancelled.",
    });
  };

  if (!user) {
    return <div className="p-8 text-center text-red-500">Unauthorized access. Admin only.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Contact Info Settings - Admin" />
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Contact Information</h1>
          <p className="text-slate-600 mt-2">
            Manage the global contact details displayed across the website (footer, contact page, etc).
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="email_address" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" /> Email Address
              </Label>
              <Input 
                id="email_address" 
                name="email_address" 
                type="email"
                value={formData.email_address} 
                onChange={handleChange} 
                placeholder="sales@titanstables.org"
                required
              />
              <p className="text-xs text-slate-500">Primary email for customer inquiries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone_number" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" /> Mobile / Phone Number
                </Label>
                <Input 
                  id="phone_number" 
                  name="phone_number" 
                  value={formData.phone_number} 
                  onChange={handleChange} 
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" /> WhatsApp Number
                </Label>
                <Input 
                  id="whatsapp_number" 
                  name="whatsapp_number" 
                  value={formData.whatsapp_number} 
                  onChange={handleChange} 
                  placeholder="+15551234567"
                />
                <p className="text-xs text-slate-500">Include country code without '+'. Example: 15551234567</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street_address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" /> Full Physical Address
              </Label>
              <Textarea 
                id="street_address" 
                name="street_address" 
                value={formData.street_address} 
                onChange={handleChange} 
                placeholder="123 Equine Lane&#10;Middleburg, VA 20117"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_maps_url" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" /> Google Maps Embed URL (Optional)
              </Label>
              <Input 
                id="google_maps_url" 
                name="google_maps_url" 
                value={formData.google_maps_url} 
                onChange={handleChange} 
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white min-w-[150px]">
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Details</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminContactInfoPage;