import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContentManagerPage from '@/pages/admin/ContentManagerPage';

const AdminSettingsPage = () => {
  return (
    <AdminLayout title="General Settings">
      {/* Reusing existing Content Manager for general settings layout */}
      <ContentManagerPage />
    </AdminLayout>
  );
};

export default AdminSettingsPage;