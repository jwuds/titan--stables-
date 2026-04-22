import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Truck, Edit2, Plus, Trash2, Save, X, Plane, MapPin } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditableImage from '@/components/EditableImage';

const MonthlyShipmentSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('air');

  // Admin State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    month: 'January',
    departure_date: '',
    year: 2026,
    transport_type: 'air',
    route: '', // Only used for road typically
    is_active: true
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('shipment_schedules')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;
      
      // Sort months chronologically
      const sortedData = (data || []).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return months.indexOf(a.month) - months.indexOf(b.month);
      });

      setSchedules(sortedData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.departure_date) {
      toast({ title: "Date Required", description: "Please enter a departure date", variant: "destructive" });
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('shipment_schedules')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: "Updated", description: "Shipment schedule updated." });
      } else {
        const { error } = await supabase
          .from('shipment_schedules')
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Added", description: "New shipment scheduled." });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save schedule." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this scheduled departure?")) return;
    try {
      const { error } = await supabase.from('shipment_schedules').delete().eq('id', id);
      if (error) throw error;
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast({ title: "Removed", description: "Schedule removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to remove." });
    }
  };

  const openEdit = (schedule) => {
    setEditingId(schedule.id);
    setFormData({
      month: schedule.month,
      departure_date: schedule.departure_date,
      year: schedule.year,
      transport_type: schedule.transport_type || 'air',
      route: schedule.route || '',
      is_active: schedule.is_active
    });
    // Set the tab to the type being edited so context isn't lost
    setActiveTab(schedule.transport_type || 'air');
    setIsDialogOpen(true);
  };

  const openAdd = () => {
    resetForm();
    // Default to adding for the current active tab
    setFormData(prev => ({ ...prev, transport_type: activeTab }));
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      month: 'January',
      departure_date: '',
      year: 2026,
      transport_type: 'air',
      route: '',
      is_active: true
    });
  };

  const filteredSchedules = schedules.filter(s => (s.transport_type || 'air') === activeTab);

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-2xl w-full h-full bg-slate-900 border border-slate-800 flex flex-col">
        {/* Dynamic Background based on Tab */}
        <div className="absolute inset-0 transition-opacity duration-1000">
             <AnimatePresence mode="wait">
                {activeTab === 'air' ? (
                     <motion.div 
                        key="bg-air"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                     >
                        <EditableImage 
                            name="home_shipment_img_air"
                            defaultValue="https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1000&auto=format&fit=crop"
                            alt="Air Transport"
                            className="w-full h-full object-cover opacity-50"
                            containerClassName="w-full h-full"
                        />
                     </motion.div>
                ) : (
                    <motion.div 
                        key="bg-road"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                     >
                        <EditableImage 
                            name="home_shipment_img_road"
                            defaultValue="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1000&auto=format&fit=crop"
                            alt="Road Transport"
                            className="w-full h-full object-cover opacity-50"
                            containerClassName="w-full h-full"
                        />
                     </motion.div>
                )}
             </AnimatePresence>
             <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95" />
        </div>

        <div className="relative z-10 p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary backdrop-blur-md border border-primary/30 shadow-lg shadow-primary/10">
                        {activeTab === 'air' ? <Plane className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-xl leading-none">Global Logistics</h3>
                        <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Upcoming Departures</p>
                    </div>
                </div>
                
                {user && (
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-900" onClick={openAdd}>
                                <Plus className="w-4 h-4 mr-2" /> Schedule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingId ? 'Edit Departure' : 'Schedule Departure'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Transport Type</Label>
                                    <Select 
                                        value={formData.transport_type} 
                                        onValueChange={(val) => setFormData(prev => ({...prev, transport_type: val}))}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="air">Air Freight (International)</SelectItem>
                                            <SelectItem value="road">Road Transport (USA/Domestic)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Month</Label>
                                        <Select 
                                            value={formData.month} 
                                            onValueChange={(val) => setFormData(prev => ({...prev, month: val}))}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Year</Label>
                                        <Input 
                                            type="number" 
                                            value={formData.year} 
                                            onChange={(e) => setFormData(prev => ({...prev, year: parseInt(e.target.value)}))} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Departure Date (e.g. 15th, Late October)</Label>
                                    <Input 
                                        value={formData.departure_date} 
                                        onChange={(e) => setFormData(prev => ({...prev, departure_date: e.target.value}))} 
                                        placeholder="e.g. 25th"
                                    />
                                </div>
                                
                                {formData.transport_type === 'road' && (
                                    <div className="space-y-2">
                                        <Label>Route / Cities (Optional)</Label>
                                        <Input 
                                            value={formData.route} 
                                            onChange={(e) => setFormData(prev => ({...prev, route: e.target.value}))} 
                                            placeholder="e.g. East Coast Run (NY, VA, FL)"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSave}>Save Schedule</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 mb-4 p-1 rounded-lg">
                    <TabsTrigger 
                        value="air"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-slate-400 transition-all"
                    >
                        Air Freight
                    </TabsTrigger>
                    <TabsTrigger 
                        value="road"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-slate-400 transition-all"
                    >
                        Road Transport
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="air" className="flex-1 overflow-visible mt-0">
                   <div className="space-y-3">
                     {loading ? (
                        <div className="text-center text-slate-500 py-8">Loading...</div>
                     ) : filteredSchedules.length === 0 ? (
                        <EmptyState type="Air Freight" icon={Plane} />
                     ) : (
                        filteredSchedules.slice(0, 3).map((schedule, idx) => (
                            <ScheduleCard 
                                key={schedule.id} 
                                schedule={schedule} 
                                index={idx} 
                                onEdit={() => openEdit(schedule)} 
                                onDelete={() => handleDelete(schedule.id)}
                                user={user}
                            />
                        ))
                     )}
                   </div>
                </TabsContent>

                <TabsContent value="road" className="flex-1 overflow-visible mt-0">
                    <div className="space-y-3">
                     {loading ? (
                        <div className="text-center text-slate-500 py-8">Loading...</div>
                     ) : filteredSchedules.length === 0 ? (
                        <EmptyState type="Road Transport" icon={Truck} />
                     ) : (
                        filteredSchedules.slice(0, 3).map((schedule, idx) => (
                            <ScheduleCard 
                                key={schedule.id} 
                                schedule={schedule} 
                                index={idx} 
                                onEdit={() => openEdit(schedule)} 
                                onDelete={() => handleDelete(schedule.id)}
                                user={user}
                                isRoad={true}
                            />
                        ))
                     )}
                   </div>
                </TabsContent>
            </Tabs>
            
            <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>{activeTab === 'air' ? 'USA • Canada • Europe • Asia' : 'Coast to Coast • USA • Canada'}</span>
                {activeTab === 'air' ? <Plane className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
            </div>
        </div>
    </div>
  );
};

const ScheduleCard = ({ schedule, index, onEdit, onDelete, user, isRoad }) => (
    <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`flex items-center justify-between p-3 rounded-xl border backdrop-blur-sm ${index === 0 ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-white/10'}`}
    >
        <div className="flex items-center gap-3">
            <div className={`text-xl font-bold font-serif w-14 text-center ${index === 0 ? 'text-primary' : 'text-slate-300'}`}>
                {schedule.departure_date.split(' ')[0]}
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
                <div className={`font-bold flex items-center gap-2 ${index === 0 ? 'text-white' : 'text-slate-200'}`}>
                    {schedule.month} 
                    {schedule.route && isRoad && <span className="text-xs font-normal text-slate-400 border border-slate-700 rounded px-1.5 py-0.5">{schedule.route}</span>}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                   <span>{schedule.year}</span>
                   {isRoad && schedule.departure_date.includes(' ') && <span>• {schedule.departure_date.substring(schedule.departure_date.indexOf(' '))}</span>}
                </div>
            </div>
        </div>

        {user ? (
            <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white" onClick={onEdit}>
                    <Edit2 className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-400" onClick={onDelete}>
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        ) : (
            <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${index === 0 ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                {index === 0 ? 'Next' : 'Upcoming'}
            </div>
        )}
    </motion.div>
);

const EmptyState = ({ type, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-700 rounded-xl bg-slate-800/30 p-8">
        <Icon className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No {type.toLowerCase()} scheduled.</p>
    </div>
);

export default MonthlyShipmentSchedule;