import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useContent } from '@/contexts/ContentContext';
import { Save, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const ContactInfoPage = () => {
  const { getContent, updateContent } = useContent();
  const [loading, setLoading] = useState(false);

  // Defaults from requirements
  const [formData, setFormData] = useState({
    contact_email: getContent('contact_email', 'sales@titanstables.org'),
    contact_mobile: getContent('contact_mobile', '515 705 4429'),
    contact_whatsapp: getContent('contact_whatsapp', '+1 (276) 329 8032'),
    contact_address: getContent('contact_address', 'Titan Stables, 13486 Cedar View Rd, Drewryville, VA 23844, United States'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all([
        updateContent('contact_email', formData.contact_email),
        updateContent('contact_mobile', formData.contact_mobile),
        updateContent('contact_whatsapp', formData.contact_whatsapp),
        updateContent('contact_address', formData.contact_address),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Contact Information Management">
      <Helmet><title>Contact Info - Admin</title></Helmet>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Company Contact Details</CardTitle>
                <CardDescription>
                    Update the contact information displayed in the footer and contact page. 
                    Changes reflect immediately across the site.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="contact_email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-500" /> Primary Email (Sales)
                    </Label>
                    <Input 
                        id="contact_email" 
                        name="contact_email"
                        value={formData.contact_email} 
                        onChange={handleChange}
                    />
                    <p className="text-xs text-slate-500">All contact form submissions will be routed to this email.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contact_mobile" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500" /> Mobile Phone
                    </Label>
                    <Input 
                        id="contact_mobile" 
                        name="contact_mobile"
                        value={formData.contact_mobile} 
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contact_whatsapp" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-slate-500" /> WhatsApp Business
                    </Label>
                    <Input 
                        id="contact_whatsapp" 
                        name="contact_whatsapp"
                        value={formData.contact_whatsapp} 
                        onChange={handleChange}
                    />
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="contact_address" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" /> Physical Address
                    </Label>
                    <Input 
                        id="contact_address" 
                        name="contact_address"
                        value={formData.contact_address} 
                        onChange={handleChange}
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button onClick={handleSave} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ContactInfoPage;