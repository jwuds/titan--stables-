import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { getHorses } from '@/data/horses';
import HorseAdminEditor from '@/components/admin/HorseAdminEditor';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminHorsesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHorses = async () => {
    setLoading(true);
    const horsesData = await getHorses();
    setHorses(horsesData);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchHorses();
    }
  }, [user]);

  const handleAddNewHorse = async () => {
    const { data, error } = await supabase
      .from('horses')
      .insert([
        { 
          name: 'New Horse', 
          breed: 'Friesian', 
          age: 0,
          height: 'TBD',
          gender: 'TBD',
          discipline: 'Future Prospect',
          price: 0,
          description: 'Enter description here.',
          features: [],
          images: [],
        },
      ])
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Could not create new horse. ' + error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'New horse added. You can now edit its details.',
      });
      // Manually add empty images array if not returned to avoid crashes
      const newHorse = { ...data, images: [] };
      setHorses(prev => [newHorse, ...prev]);
    }
  };

  const onHorseUpdate = (updatedHorse) => {
    setHorses(prevHorses => prevHorses.map(h => h.id === updatedHorse.id ? updatedHorse : h));
  };
  
  const onHorseDelete = (deletedHorseId) => {
    setHorses(prevHorses => prevHorses.filter(h => h.id !== deletedHorseId));
  };

  if (authLoading) return null; // Or a spinner
  if (!user) return <Navigate to="/auth" />;

  return (
    <AdminLayout title="Horse Management">
      <Helmet>
        <title>Manage Horses - Admin Dashboard</title>
      </Helmet>
      
      <div className="mb-8 flex justify-end">
        <Button onClick={handleAddNewHorse} size="lg" className="shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Horse
        </Button>
      </div>

      {loading ? (
          <div className="text-center text-slate-600 text-lg py-16">Loading horse data...</div>
      ) : (
        <div className="space-y-8">
          {horses.map((horse, index) => (
            <motion.div
              key={horse.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <HorseAdminEditor horse={horse} onUpdate={onHorseUpdate} onDelete={onHorseDelete} />
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminHorsesPage;