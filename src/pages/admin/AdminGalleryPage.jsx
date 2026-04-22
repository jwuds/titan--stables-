import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import FacilityGalleryManager from '@/components/FacilityGalleryManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminGalleryPage = () => {
  return (
    <AdminLayout title="Gallery Management">
       <Tabs defaultValue="facility">
          <TabsList>
             <TabsTrigger value="facility">Facility Tour</TabsTrigger>
             <TabsTrigger value="success">Success Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="facility" className="space-y-4">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-2">Facility Images</h2>
                <p className="text-slate-500 mb-6">Manage images for the "Tour Our Grounds" section on the Facility page.</p>
                <FacilityGalleryManager />
             </div>
          </TabsContent>

          <TabsContent value="success">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center py-12">
                <p className="text-slate-500">Success Gallery Management module coming soon.</p>
             </div>
          </TabsContent>
       </Tabs>
    </AdminLayout>
  );
};

export default AdminGalleryPage;