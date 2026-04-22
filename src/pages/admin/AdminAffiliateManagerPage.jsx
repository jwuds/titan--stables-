import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminAffiliateManagerPage = () => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Not Implemented",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <AdminLayout title="Affiliate Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Affiliates</h2>
            <p className="text-muted-foreground">Manage your business partners and affiliates.</p>
          </div>
          <Button onClick={handleAction}>
            <Plus className="mr-2 h-4 w-4" /> Add Affiliate
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Active Affiliates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500">
              Affiliate directory will be displayed here.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAffiliateManagerPage;