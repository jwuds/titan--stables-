import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SocialMediaManager from '@/components/admin/SocialMediaManager';

const SocialMediaManagerPage = () => {
  return (
    <AdminLayout title="Social Media Management">
      <div className="container mx-auto py-6">
        <SocialMediaManager />
      </div>
    </AdminLayout>
  );
};

export default SocialMediaManagerPage;