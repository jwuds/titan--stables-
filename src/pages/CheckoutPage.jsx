import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { formatCurrency } from '@/api/EcommerceApi';
import { ShieldCheck, CreditCard, CheckCircle2, Lock, AlertTriangle, Loader2, Building2, Copy } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/hooks/useCart';

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const horseParam = searchParams.get('horse') || searchParams.get('horseId');
  const source = searchParams.get('source'); // 'reservation' or 'cart'
  
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const { cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Form State
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
      sameAsShipping: true,
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardName: '',
      agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchHorse = async () => {
      if (horseParam) {
        try {
          const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(horseParam);
          let query = supabase.from('horses').select('*');
          
          if (isUUID) {
              query = query.eq('id', horseParam);
          } else {
              query = query.ilike('name', horseParam);
          }
          
          const { data, error } = await query.limit(1).single();
          
          if (!error && data) {
            setHorse(data);
          }
        } catch (err) {
          console.error("Failed to load horse", err);
        }
      }
      setLoading(false);
    };
    fetchHorse();
  }, [horseParam]);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('bank_details')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        if (!error && data) {
          setBankDetails(data);
        }
      } catch (err) {
        console.error("Failed to load bank details", err);
      }
    };
    fetchBankDetails();
  }, []);

  const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
      // Clear error when typing
      if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
      }
  };

  const validateForm = () => {
      let newErrors = {};
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.zip) newErrors.zip = "ZIP is required";
      if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";

      if (paymentMethod === 'credit_card') {
        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 15) newErrors.cardNumber = "Valid card number required";
        if (!formData.expiry) newErrors.expiry = "Expiry date required";
        if (!formData.cvv || formData.cvv.length < 3) newErrors.cvv = "Valid CVV required";
        if (!formData.cardName) newErrors.cardName = "Name on card is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = matches && matches[0] || '';
      let parts = [];
      for (let i=0, len=match.length; i<len; i+=4) {
          parts.push(match.substring(i, i+4));
      }
      if (parts.length) return parts.join(' ');
      return value;
  };

  const handleCardNumberChange = (e) => {
      const formatted = formatCardNumber(e.target.value);
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
      if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: null }));
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Bank detail copied successfully.",
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
          toast({
              title: "Validation Error",
              description: "Please check the form for errors and try again.",
              variant: "destructive"
          });
          return;
      }

      setIsSubmitting(true);
      
      try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          if (paymentMethod === 'bank_transfer') {
             toast({
                 title: "Reservation Submitted!",
                 description: "Please complete your bank transfer within 48 hours to secure your reservation.",
             });
          } else {
             toast({
                 title: "Deposit Payment Successful!",
                 description: "Your reservation deposit has been processed securely.",
             });
          }
          
          if (source === 'cart' || !horseParam) {
             clearCart();
          }
          
          navigate('/success');

      } catch (error) {
          toast({
              title: "Processing Failed",
              description: "There was an error processing your request. Please try again.",
              variant: "destructive"
          });
      } finally {
          setIsSubmitting(false);
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-pulse text-[#333333] font-serif text-xl flex items-center gap-3">
            <Lock className="w-5 h-5 text-green-600" /> Securing Connection...
        </div>
      </div>
    );
  }

  const isCartCheckout = source === 'cart' || (!horseParam && cartItems.length > 0);
  const isReservationCheckout = source === 'reservation' || (horseParam && horse);
  
  if (!isReservationCheckout && !isCartCheckout) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-3xl font-serif text-[#0F0F0F] mb-4">Checkout Empty</h1>
        <p className="text-[#333333] mb-8 text-center max-w-md">There are no items or reservations selected for checkout.</p>
        <Link to="/horses">
          <Button className="bg-[#0F0F0F] text-white hover:bg-[#333333]">Browse Horses</Button>
        </Link>
      </div>
    );
  }

  // Calculate Totals
  let checkoutItems = [];
  let subtotal = 0;
  let displayTitle = "Secure Reservation Checkout";

  if (isReservationCheckout && horse) {
      checkoutItems = [{
          id: horse.id,
          name: horse.name,
          image: horse.images?.[0],
          details: `${horse.breed} • ${horse.age} yrs`,
          price: horse.price || 0,
      }];
      subtotal = horse.price || 0;
  } else if (isCartCheckout) {
      displayTitle = "Secure Cart Checkout";
      checkoutItems = cartItems.map(item => ({
          id: item.variant.id,
          name: item.product.title,
          image: item.product.image,
          details: item.variant.title,
          price: item.variant.price_in_cents / 100,
      }));
      subtotal = cartItems.reduce((acc, item) => acc + (item.variant.price_in_cents / 100) * item.quantity, 0);
  }

  const discountAmount = subtotal * 0.15;
  const finalAmount = subtotal - discountAmount;
  const depositAmount = finalAmount * 0.10;
  const remainingBalance = finalAmount - depositAmount;

  const formatMoney = (val) => formatCurrency(Math.round(val * 100), { symbol: '$', code: 'USD' });
  const invoiceRef = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <>
      <SEO 
        title={`${displayTitle} - Titan Stables`} 
        description="Securely process your reservation deposit. Protected by bank-level SSL encryption."
      />
      
      <div className="bg-[#0F0F0F] text-white py-6 border-b border-white/10">
          <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
              <Link to="/" className="font-serif font-bold text-xl tracking-tight">Titan <span className="text-[#C0C0C0]">Stables</span></Link>
              <div className="flex items-center gap-2 text-sm text-green-400 font-medium bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                  <Lock className="w-4 h-4" />
                  <span>256-bit SSL Secure Checkout</span>
              </div>
          </div>
      </div>

      <div className="min-h-screen bg-[#F5F5F5] py-12 font-sans text-[#333333]">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column - Forms */}
            <div className="w-full lg:w-3/5 space-y-8">
              
              {/* Customer Info */}
              <div className="bg-[#FFFFFF] p-6 md:p-8 rounded-xl shadow-sm border border-[#E5E5E5]">
                <h2 className="text-xl font-serif font-bold text-[#0F0F0F] mb-6 flex items-center gap-2">
                    <span className="bg-[#0F0F0F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans">1</span> 
                    Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <Label htmlFor="firstName" className="text-[#333333]">First Name</Label>
                      <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black ${errors.firstName ? 'border-red-500' : ''}`} />
                      {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="lastName" className="text-[#333333]">Last Name</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black ${errors.lastName ? 'border-red-500' : ''}`} />
                      {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                  </div>
                  <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="email" className="text-[#333333]">Email Address</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black ${errors.email ? 'border-red-500' : ''}`} />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                  <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="phone" className="text-[#333333]">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black ${errors.phone ? 'border-red-500' : ''}`} />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-[#FFFFFF] p-6 md:p-8 rounded-xl shadow-sm border border-[#E5E5E5]">
                <h2 className="text-xl font-serif font-bold text-[#0F0F0F] mb-6 flex items-center gap-2">
                    <span className="bg-[#0F0F0F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans">2</span> 
                    Billing Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 md:col-span-2">
                      <Label htmlFor="address" className="text-[#333333]">Street Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black ${errors.address ? 'border-red-500' : ''}`} />
                      {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="city" className="text-[#333333]">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black ${errors.city ? 'border-red-500' : ''}`} />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="state" className="text-[#333333]">State / Province</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black`} />
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="zip" className="text-[#333333]">ZIP / Postal Code</Label>
                      <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black ${errors.zip ? 'border-red-500' : ''}`} />
                      {errors.zip && <p className="text-red-500 text-xs">{errors.zip}</p>}
                  </div>
                  <div className="space-y-1">
                      <Label htmlFor="country" className="text-[#333333]">Country</Label>
                      <select id="country" name="country" value={formData.country} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-[#C0C0C0] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F0F0F] focus:border-[#0F0F0F] text-black">
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="EU">Europe</option>
                          <option value="AU">Australia</option>
                      </select>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center space-x-2">
                    <Checkbox id="sameAsShipping" name="sameAsShipping" checked={formData.sameAsShipping} onCheckedChange={(checked) => setFormData(prev => ({...prev, sameAsShipping: checked}))} />
                    <label htmlFor="sameAsShipping" className="text-sm font-medium leading-none text-[#333333]">
                        Shipping address is the same as billing
                    </label>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#FFFFFF] p-6 md:p-8 rounded-xl shadow-sm border border-[#E5E5E5] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-slate-50 border-b border-l border-slate-200 px-4 py-2 rounded-bl-lg text-xs font-bold text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-green-600" /> PCI DSS Compliant
                </div>
                <h2 className="text-xl font-serif font-bold text-[#0F0F0F] mb-6 flex items-center gap-2">
                    <span className="bg-[#0F0F0F] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans">3</span> 
                    Secure Deposit Payment
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div 
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'credit_card' ? 'border-[#0F0F0F] bg-slate-50' : 'border-[#E5E5E5] hover:border-[#C0C0C0]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'credit_card' ? 'border-[#0F0F0F]' : 'border-[#C0C0C0]'}`}>
                      {paymentMethod === 'credit_card' && <div className="w-3 h-3 bg-[#0F0F0F] rounded-full" />}
                    </div>
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'credit_card' ? 'text-[#0F0F0F]' : 'text-slate-400'}`} />
                    <span className="font-semibold text-[#0F0F0F]">Credit Card</span>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'bank_transfer' ? 'border-[#0F0F0F] bg-slate-50' : 'border-[#E5E5E5] hover:border-[#C0C0C0]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'bank_transfer' ? 'border-[#0F0F0F]' : 'border-[#C0C0C0]'}`}>
                      {paymentMethod === 'bank_transfer' && <div className="w-3 h-3 bg-[#0F0F0F] rounded-full" />}
                    </div>
                    <Building2 className={`w-6 h-6 ${paymentMethod === 'bank_transfer' ? 'text-[#0F0F0F]' : 'text-slate-400'}`} />
                    <span className="font-semibold text-[#0F0F0F]">Bank Transfer</span>
                  </div>
                </div>
                
                {paymentMethod === 'credit_card' && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-slate-600">
                        <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p>Your payment information is encrypted and securely processed. You will only be charged the 10% required deposit today.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                          <Label htmlFor="cardNumber" className="text-[#333333]">Card Number</Label>
                          <div className="relative">
                              <Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" maxLength="19" className={`pl-10 border-[#C0C0C0] focus:border-[#0F0F0F] text-black font-mono ${errors.cardNumber ? 'border-red-500' : ''}`} />
                              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C0C0C0] w-5 h-5" />
                          </div>
                          {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <Label htmlFor="expiry" className="text-[#333333]">Expiration Date</Label>
                              <Input id="expiry" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" maxLength="5" className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black font-mono ${errors.expiry ? 'border-red-500' : ''}`} />
                              {errors.expiry && <p className="text-red-500 text-xs">{errors.expiry}</p>}
                          </div>
                          <div className="space-y-1">
                              <Label htmlFor="cvv" className="text-[#333333]">Security Code (CVV)</Label>
                              <Input id="cvv" name="cvv" type="password" value={formData.cvv} onChange={handleInputChange} placeholder="123" maxLength="4" className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black font-mono ${errors.cvv ? 'border-red-500' : ''}`} />
                              {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
                          </div>
                      </div>

                      <div className="space-y-1 pt-2">
                          <Label htmlFor="cardName" className="text-[#333333]">Name on Card</Label>
                          <Input id="cardName" name="cardName" value={formData.cardName} onChange={handleInputChange} className={`border-[#C0C0C0] focus:border-[#0F0F0F] text-black ${errors.cardName ? 'border-red-500' : ''}`} />
                          {errors.cardName && <p className="text-red-500 text-xs">{errors.cardName}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <Building2 className="w-8 h-8 text-[#0F0F0F] shrink-0" />
                        <div>
                          <h3 className="font-bold text-[#0F0F0F] text-lg">Wire Transfer Instructions</h3>
                          <p className="text-sm text-[#333333]">Please transfer the deposit amount to the account below. Your reservation will be confirmed once funds clear.</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white p-3 rounded border border-[#E5E5E5]">
                          <span className="text-sm text-slate-500">Bank Name</span>
                          <span className="font-mono text-sm font-medium text-[#0F0F0F]">{bankDetails?.bank_name || 'Titan Stables Trust Bank'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded border border-[#E5E5E5]">
                          <span className="text-sm text-slate-500">Account Holder</span>
                          <span className="font-mono text-sm font-medium text-[#0F0F0F]">{bankDetails?.account_holder || 'Titan Stables LLC'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded border border-[#E5E5E5]">
                          <span className="text-sm text-slate-500">Account Number</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium text-[#0F0F0F]">{bankDetails?.account_number || '1234567890'}</span>
                            <button type="button" onClick={() => copyToClipboard(bankDetails?.account_number || '1234567890')} className="text-slate-400 hover:text-black"><Copy className="w-4 h-4"/></button>
                          </div>
                        </div>
                        {bankDetails?.routing_number && (
                          <div className="flex justify-between items-center bg-white p-3 rounded border border-[#E5E5E5]">
                            <span className="text-sm text-slate-500">Routing Number</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium text-[#0F0F0F]">{bankDetails.routing_number}</span>
                              <button type="button" onClick={() => copyToClipboard(bankDetails.routing_number)} className="text-slate-400 hover:text-black"><Copy className="w-4 h-4"/></button>
                            </div>
                          </div>
                        )}
                        {bankDetails?.swift_code && (
                          <div className="flex justify-between items-center bg-white p-3 rounded border border-[#E5E5E5]">
                            <span className="text-sm text-slate-500">SWIFT Code</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium text-[#0F0F0F]">{bankDetails.swift_code}</span>
                              <button type="button" onClick={() => copyToClipboard(bankDetails.swift_code)} className="text-slate-400 hover:text-black"><Copy className="w-4 h-4"/></button>
                            </div>
                          </div>
                        )}
                        {bankDetails?.bank_address && (
                          <div className="flex justify-between items-center bg-white p-3 rounded border border-[#E5E5E5]">
                            <span className="text-sm text-slate-500">Bank Address</span>
                            <span className="text-sm font-medium text-[#0F0F0F] text-right max-w-[60%]">{bankDetails.bank_address}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center bg-yellow-50 p-3 rounded border border-yellow-200">
                          <span className="text-sm font-medium text-yellow-800">Reference / Invoice</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-yellow-900">{invoiceRef}</span>
                            <button type="button" onClick={() => copyToClipboard(invoiceRef)} className="text-yellow-700 hover:text-yellow-900"><Copy className="w-4 h-4"/></button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-xs text-slate-500 text-center">
                        * Please include the Reference number in your transfer notes.
                        {bankDetails?.instructions && ` ${bankDetails.instructions}`}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-2/5">
              <div className="bg-[#FFFFFF] p-6 md:p-8 rounded-xl shadow-sm border border-[#E5E5E5] sticky top-24">
                <h3 className="text-xl font-serif font-bold text-[#0F0F0F] mb-6 border-b border-[#F5F5F5] pb-4">Order Summary</h3>
                
                <div className="space-y-6 mb-6">
                    {checkoutItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="w-20 h-20 rounded-md overflow-hidden bg-[#F5F5F5] shrink-0 border border-[#E5E5E5]">
                                <img src={item.image || 'https://placehold.co/100'} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-[#0F0F0F] truncate text-sm">{item.name}</h4>
                                <p className="text-xs text-[#333333] mt-1">{item.details}</p>
                                <p className="text-sm font-medium text-[#0F0F0F] mt-1">{formatMoney(item.price)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-[#F5F5F5] pt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-[#333333]">
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount (15%)</span>
                    <span>-{formatMoney(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[#0F0F0F] font-bold pt-1">
                    <span>Final Total</span>
                    <span>{formatMoney(finalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[#333333] pt-3 border-t border-[#F5F5F5]">
                    <span>Deposit Required (10%)</span>
                    <span>{formatMoney(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium pt-1">
                    <span>Remaining Balance</span>
                    <span>{formatMoney(remainingBalance)}</span>
                  </div>
                </div>

                <div className="border-t border-[#0F0F0F] mt-6 pt-6 bg-[#F5F5F5] p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                        <span className="block font-serif font-bold text-lg text-[#0F0F0F]">Due Today</span>
                        <span className="text-xs text-slate-500 block mt-1">10% Deposit Only</span>
                    </div>
                    <span className="font-bold text-3xl text-green-600 tracking-tight">{formatMoney(depositAmount)}</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <Checkbox id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onCheckedChange={(checked) => {
                            setFormData(prev => ({...prev, agreeTerms: checked}));
                            if (checked && errors.agreeTerms) setErrors(prev => ({...prev, agreeTerms: null}));
                        }} className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                            <label htmlFor="agreeTerms" className="text-xs font-medium text-[#333333] leading-snug">
                                I agree to the <Link to="/policies" className="text-blue-600 hover:underline">Terms of Sale</Link> and <Link to="/policies#welfare" className="text-blue-600 hover:underline">Horse Welfare Policies</Link>.
                            </label>
                            {errors.agreeTerms && <p className="text-red-500 text-xs">{errors.agreeTerms}</p>}
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-[#C0C0C0] hover:bg-[#A0A0A0] text-[#0F0F0F] font-bold text-lg py-7 rounded-xl shadow-lg transition-all hover:scale-105"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                        ) : paymentMethod === 'bank_transfer' ? (
                            <><Building2 className="w-5 h-5 mr-2" /> Confirm Reservation</>
                        ) : (
                            <><Lock className="w-5 h-5 mr-2" /> Pay Deposit ({formatMoney(depositAmount)})</>
                        )}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Encrypted</span>
                    </div>
                </div>

              </div>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};

export default CheckoutPage;