import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2, Navigation } from 'lucide-react';
import SEO from '@/components/SEO';
import { useGlobalSettings } from '@/hooks/useGlobalSettings';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPhoneNumber, getPhoneLink } from '@/lib/phoneFormatter';
import { validateEmail } from '@/lib/inputValidation';
import { supabase } from '@/lib/customSupabaseClient';

const ContactPage = () => {
  const { getSettingByKey, loading: settingsLoading } = useGlobalSettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fallbacks if global settings not loaded
  const primaryMobile = getSettingByKey('primary_mobile') || '+1 434 253 5844';
  const primaryWhatsApp = getSettingByKey('primary_whatsapp') || '+1 314 940 3139';
  const whatsappLink = getSettingByKey('whatsapp_link') || 'https://wa.me/13149403139';
  const companyName = getSettingByKey('company_name') || 'Titan Stables';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectChange = (value) => {
    setFormData(prev => ({ ...prev, subject: value }));
    if (errors.subject) {
      setErrors(prev => ({ ...prev, subject: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('site_messages').insert([{
        sender_name: formData.name,
        sender_email: formData.email,
        sender_phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        status: 'new'
      }]);

      if (error) throw error;

      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting Titan Stables. We will get back to you shortly.",
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      toast({
        title: "Submission Failed",
        description: "There was an issue sending your message. Please try again or use our WhatsApp support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Titan Stables - KFPS Friesian Experts"
        description="Get in touch with Titan Stables. For inquiries regarding our premium Friesian horses, international buyer support, and facility tours."
        keywords="contact Titan Stables, Friesian horse inquiry, international buyer support, equestrian business standards"
        url="/contact"
      />

      <div className="bg-slate-50 min-h-screen pb-16 font-body">
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1563773157-d78e37794bd4?q=80&w=2000" 
               alt="Friesian Horse Background" 
               className="w-full h-full object-cover opacity-20"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white tracking-tight">
                Get in Touch with<br/>
                <span className="text-[#D4AF37]">Titan Stables</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed">
                Whether you're looking for your dream KFPS Friesian, seeking international importation support, or exploring partnership opportunities, our experts are here to assist.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 -mt-10 lg:-mt-16 relative z-20">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Contact Form Container (Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-3/5 bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold text-primary mb-3">Send Us a Message</h2>
                <p className="text-slate-600">Fill out the form below and a member of our team will respond within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">Full Name *</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className={`bg-slate-50 border-slate-200 focus-visible:ring-[#D4AF37] ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email Address *</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className={`bg-slate-50 border-slate-200 focus-visible:ring-[#D4AF37] ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700">Phone Number (Optional)</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="bg-slate-50 border-slate-200 focus-visible:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700">Subject *</Label>
                    <Select value={formData.subject} onValueChange={handleSubjectChange}>
                      <SelectTrigger className={`bg-slate-50 border-slate-200 focus-visible:ring-[#D4AF37] ${errors.subject ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales">Horse Sales Inquiry</SelectItem>
                        <SelectItem value="Support">International Buyer Support</SelectItem>
                        <SelectItem value="Partnership">Partnership / Affiliation</SelectItem>
                        <SelectItem value="Other">Other Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700">Your Message *</Label>
                  <Textarea 
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we assist you today?"
                    className={`bg-slate-50 border-slate-200 focus-visible:ring-[#D4AF37] resize-none ${errors.message ? 'border-red-500' : ''}`}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8962E] text-white font-semibold py-6 px-10 rounded-full shadow-lg shadow-[#D4AF37]/20 transition-all hover:-translate-y-1 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Information (Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full lg:w-2/5 space-y-6"
            >
              {/* Primary Mobile */}
              <div className="bg-primary text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group hover:shadow-[#D4AF37]/10 transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-bl-full opacity-10 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10 flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                    <Phone className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Master Phone Number</h3>
                    <p className="text-sm text-[#D4AF37] mb-2">(Local Support)</p>
                    <a 
                      href={getPhoneLink(primaryMobile)} 
                      className="text-2xl font-heading font-semibold hover:text-[#D4AF37] transition-colors block"
                    >
                      {settingsLoading ? 'Loading...' : formatPhoneNumber(primaryMobile)}
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-100 hover:shadow-lg transition-shadow group">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100 group-hover:bg-green-500 transition-colors duration-300">
                    <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">WhatsApp Direct</h3>
                    <p className="text-sm text-slate-600 mb-2">(International Buyer Support)</p>
                    <a 
                      href={whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xl font-heading font-semibold text-primary hover:text-green-600 transition-colors block"
                    >
                      {settingsLoading ? 'Loading...' : formatPhoneNumber(primaryWhatsApp)}
                    </a>
                    <p className="text-sm text-slate-500 mt-2 italic">Fastest response for global clients</p>
                  </div>
                </div>
              </div>

              {/* General Inquiries */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-100">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">General Email</h3>
                    <a href="mailto:sales@titanstables.org" className="text-slate-600 hover:text-[#D4AF37] transition-colors">sales@titanstables.org</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Facility Address</h3>
                    <p className="text-slate-600 leading-relaxed">
                      13486 Cedar View Rd<br />
                      Drewryville, VA 23844<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-4 mt-16 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row"
          >
            {/* Location Card */}
            <div className="w-full lg:w-1/3 bg-primary text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37] rounded-bl-full opacity-5"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-8">
                  <MapPin className="w-8 h-8 text-[#D4AF37]" />
                </div>
                
                <h2 className="text-3xl font-heading font-bold mb-4">Visit Us</h2>
                
                <div className="space-y-4 mb-8">
                  <p className="text-lg text-slate-200 leading-relaxed font-light">
                    13486 Cedar View Rd<br />
                    Drewryville, VA 23844<br />
                    United States
                  </p>
                </div>

                <a 
                  href="https://www.google.com/maps/search/13486+Cedar+View+Rd,+Drewryville,+VA+23844,+USA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#B8962E] text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-[#D4AF37]/20 transition-all hover:-translate-y-1 w-full sm:w-auto"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Google Map iframe */}
            <div className="w-full lg:w-2/3 h-[300px] lg:h-[400px] relative">
              <iframe
                title="Titan Stables Location"
                src="https://maps.google.com/maps?q=13486+Cedar+View+Rd,+Drewryville,+VA+23844,+USA&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full object-cover"
              ></iframe>
            </div>
          </motion.div>
        </section>
        
      </div>
    </>
  );
};

export default ContactPage;