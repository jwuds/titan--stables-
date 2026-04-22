import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import LocationManager from '@/components/admin/LocationManager';

const AdminLocationPage = () => {
  return (
    <AdminLayout title="Location & Contact Management">
      <LocationManager />
    </AdminLayout>
  );
};

export default AdminLocationPage;