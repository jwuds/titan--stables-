
import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateEmail, validatePhone } from '@/lib/inputValidation';
import { prepareFormData, checkRateLimit } from '@/lib/formSubmissionHelper';
import { useContactInfo } from '@/hooks/useContactInfo';
import { safeQuery } from '@/lib/supabaseErrorHandler';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { contactInfo } = useContactInfo();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry',
    deliveryOption: 'delivery',
    deliveryAddress: '',
    requestViewing: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'deliveryOption' && value !== 'pickup' && { requestViewing: false }),
      ...(name === 'deliveryOption' && value !== 'delivery' && { deliveryAddress: '' }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkRateLimit('contact_form', 3, 60)) {
        toast({
            variant: "destructive",
            title: "Too many attempts",
            description: "Please wait a moment before sending another message.",
        });
        return;
    }

    setLoading(true);

    if (!formData.name.trim()) {
        toast({ variant: "destructive", title: "Name Required", description: "Please enter your name." });
        setLoading(false);
        return;
    }
    if (!validateEmail(formData.email)) {
        toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." });
        setLoading(false);
        return;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
        toast({ variant: "destructive", title: "Invalid Phone", description: "Please check your phone number format." });
        setLoading(false);
        return;
    }
    if (!formData.message.trim()) {
        toast({ variant: "destructive", title: "Message Required", description: "Please enter a message." });
        setLoading(false);
        return;
    }
    if (formData.message.length > 5000) {
        toast({ variant: "destructive", title: "Message Too Long", description: "Please limit your message to 5000 characters." });
        setLoading(false);
        return;
    }

    const sanitizedData = prepareFormData({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        delivery_address: formData.deliveryAddress,
        subject: formData.subject,
        delivery_option: formData.deliveryOption
    });

    const submissionData = {
      ...sanitizedData,
      request_viewing: formData.requestViewing,
      status: 'new',
      created_at: new Date().toISOString()
    };

    try {
      const insertQuery = supabase
        .from('contact_submissions')
        .insert([submissionData]);

      const { error } = await safeQuery(insertQuery, null);

      if (error) {
        console.error('Error submitting contact form:', error);
        throw error;
      }

      trackEvent('contact_form_submission', {
          event_category: 'Contact',
          event_label: `Main Form - ${sanitizedData.subject}`
      });

      toast({
        title: "Message sent successfully",
        description: "We will reply to you shortly.",
        duration: 5000,
      });

      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        message: '', 
        subject: 'General Inquiry',
        deliveryOption: 'delivery',
        deliveryAddress: '',
        requestViewing: false,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later or contact us directly via email or phone.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name <span className="text-red-500">*</span></Label>
          <Input 
            id="name" 
            name="name"
            required 
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe" 
            maxLength={100}
            className="text-slate-900 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
          <Input 
            id="email" 
            type="email" 
            name="email"
            required 
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            maxLength={100}
            className="text-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000" 
          maxLength={20}
          className="text-slate-900 bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select name="subject" value={formData.subject} onValueChange={(value) => handleSelectChange('subject', value)}>
          <SelectTrigger id="subject" className="bg-white text-slate-900">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
            <SelectItem value="Horse Sales Inquiry">Horse Sales Inquiry</SelectItem>
            <SelectItem value="Horse Sourcing / Custom Request">Horse Sourcing / Custom Request</SelectItem>
            <SelectItem value="Horse Transport & Export">Horse Transport & Export</SelectItem>
            <SelectItem value="Training Services">Training Services</SelectItem>
            <SelectItem value="Boarding Services">Boarding Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryOption">Delivery/Pickup Option</Label>
        <Select name="deliveryOption" value={formData.deliveryOption} onValueChange={(value) => handleSelectChange('deliveryOption', value)}>
          <SelectTrigger id="deliveryOption" className="bg-white text-slate-900">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="pickup">Pick Up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.deliveryOption === 'delivery' && (
        <div className="space-y-2">
          <Label htmlFor="deliveryAddress">Delivery Address <span className="text-red-500">*</span></Label>
          <Textarea 
            id="deliveryAddress" 
            name="deliveryAddress"
            required 
            value={formData.deliveryAddress}
            onChange={handleChange}
            placeholder="Full delivery address, including city, state, and zip code." 
            className="min-h-[80px] text-slate-900 bg-white"
            maxLength={500}
          />
        </div>
      )}

      {formData.deliveryOption === 'pickup' && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="requestViewing"
            name="requestViewing"
            checked={formData.requestViewing}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
          />
          <Label htmlFor="requestViewing" className="flex items-center text-sm">
            Request a Viewing (for Pick Up)
          </Label>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Your Message <span className="text-red-500">*</span></Label>
        <Textarea 
          id="message" 
          name="message"
          required 
          value={formData.message}
          onChange={handleChange}
          placeholder="Please provide details about your inquiry." 
          className="min-h-[120px] text-slate-900 bg-white"
          maxLength={5000}
        />
        <div className="text-xs text-slate-400 text-right">{formData.message.length}/5000</div>
      </div>

      <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
        ) : (
          <><Send className="w-4 h-4 mr-2" /> Send Message</>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;
