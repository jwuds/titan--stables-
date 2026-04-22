import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminTestimonialsPage = () => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Not Implemented",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <AdminLayout title="Testimonials Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
            <p className="text-muted-foreground">Manage client reviews and testimonials.</p>
          </div>
          <Button onClick={handleAction}>
            <Plus className="mr-2 h-4 w-4" /> Add Testimonial
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Client Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-slate-500">
              Testimonials grid will be displayed here.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonialsPage;