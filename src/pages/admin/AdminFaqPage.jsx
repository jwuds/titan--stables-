import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import FaqManager from '@/components/admin/FaqManager';

const AdminFaqPage = () => {
  return (
    <AdminLayout title="FAQ Management">
      <FaqManager />
    </AdminLayout>
  );
};

export default AdminFaqPage;