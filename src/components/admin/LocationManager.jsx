import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, MapPin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const LocationManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationId, setLocationId] = useState(null);
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    map_code: '',
    hours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setLocationId(data.id);
        setFormData({
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip: data.zip || '',
          phone: data.phone || '',
          email: data.email || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          map_code: data.map_code || '',
          hours: data.hours || formData.hours
        });
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load location data." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHourChange = (day, value) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, updated_at: new Date() };
      let query;

      if (locationId) {
        query = supabase.from('locations').update(payload).eq('id', locationId);
      } else {
        query = supabase.from('locations').insert([payload]);
      }

      const { error } = await query;
      if (error) throw error;

      toast({ title: "Success", description: "Location information updated." });
      if (!locationId) fetchLocation(); // Refresh to get ID if it was an insert
    } catch (error) {
      console.error('Error saving location:', error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Location & Contact Info</h2>
          <p className="text-muted-foreground">Manage your business address, hours, and contact details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="hours">Business Hours</TabsTrigger>
            <TabsTrigger value="map">Map & GPS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>Publicly visible contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Public Email</Label>
                    <Input id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="info@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Horse Farm Ln" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
                <CardDescription>Set your standard opening hours.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor={day} className="capitalize font-medium">{day}</Label>
                    <Input 
                      id={day} 
                      className="col-span-2"
                      value={formData.hours[day] || ''} 
                      onChange={(e) => handleHourChange(day, e.target.value)} 
                      placeholder="e.g. 9:00 AM - 5:00 PM"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Map Configuration</CardTitle>
                <CardDescription>Configure how your location appears on maps.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="36.1234" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="-77.1234" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="map_code">Embed Code (Google Maps iframe src URL or full iframe)</Label>
                  <Textarea 
                    id="map_code" 
                    name="map_code" 
                    value={formData.map_code} 
                    onChange={handleInputChange} 
                    placeholder='<iframe src="..." ...></iframe>' 
                    className="h-32 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Paste the full iframe code from Google Maps share dialog.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving} className="min-w-[150px]">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationManager;