import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Save, Loader2, Info } from 'lucide-react';
import SEO from '@/components/SEO';

const AdminBankDetailsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState(null);
  
  const [formData, setFormData] = useState({
    bank_name: '',
    account_holder: '',
    account_number: '',
    routing_number: '',
    swift_code: '',
    bank_address: '',
    instructions: ''
  });

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_details')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRecordId(data.id);
        setFormData({
          bank_name: data.bank_name || '',
          account_holder: data.account_holder || '',
          account_number: data.account_number || '',
          routing_number: data.routing_number || '',
          swift_code: data.swift_code || '',
          bank_address: data.bank_address || '',
          instructions: data.instructions || ''
        });
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast({
        title: "Error",
        description: "Failed to load bank details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

    try {
      const payload = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      let error;

      if (recordId) {
        const { error: updateError } = await supabase
          .from('bank_details')
          .update(payload)
          .eq('id', recordId);
        error = updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('bank_details')
          .insert([payload])
          .select()
          .single();
        
        if (data) setRecordId(data.id);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bank details have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast({
        title: "Error",
        description: "Failed to save bank details.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Bank Details - Admin" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            Bank Transfer Details
          </h1>
          <p className="text-slate-600 mt-2">
            Manage the bank account details shown to customers during checkout when they select the "Bank Transfer" payment method.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-3 text-blue-800">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            These details will be displayed securely to buyers on the checkout confirmation step. Ensure all information is accurate to avoid payment delays.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSave} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input 
                  id="bank_name" 
                  name="bank_name" 
                  value={formData.bank_name} 
                  onChange={handleChange} 
                  placeholder="e.g., Chase Bank, Wells Fargo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_holder">Account Holder Name</Label>
                <Input 
                  id="account_holder" 
                  name="account_holder" 
                  value={formData.account_holder} 
                  onChange={handleChange} 
                  placeholder="e.g., Titan Stables LLC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_number">Account Number</Label>
                <Input 
                  id="account_number" 
                  name="account_number" 
                  value={formData.account_number} 
                  onChange={handleChange} 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="routing_number">Routing Number (Domestic)</Label>
                <Input 
                  id="routing_number" 
                  name="routing_number" 
                  value={formData.routing_number} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="swift_code">SWIFT / BIC Code (International)</Label>
                <Input 
                  id="swift_code" 
                  name="swift_code" 
                  value={formData.swift_code} 
                  onChange={handleChange} 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bank_address">Bank Address</Label>
                <Input 
                  id="bank_address" 
                  name="bank_address" 
                  value={formData.bank_address} 
                  onChange={handleChange} 
                  placeholder="Street, City, State, ZIP, Country"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea 
                  id="instructions" 
                  name="instructions" 
                  value={formData.instructions} 
                  onChange={handleChange} 
                  placeholder="e.g., Please include your invoice number in the transfer reference notes."
                  className="min-h-[100px]"
                />
              </div>

            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]">
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

export default AdminBankDetailsPage;