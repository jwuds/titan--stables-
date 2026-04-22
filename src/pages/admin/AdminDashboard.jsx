import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';

const AdminDashboard = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return <div>Access Denied</div>;

  const sections = [
    { title: 'Global Standard', desc: 'Manage images for the Global Standard section.', path: '/admin/global-standard' },
    { title: 'Meet the Experts', desc: 'Manage team members and their profiles.', path: '/admin/meet-experts' },
    { title: 'Global Delivery Excellence', desc: 'Manage images for the Delivery Excellence section.', path: '/admin/global-delivery' },
    { title: 'Delivery Reach Videos', desc: 'Manage YouTube videos for the Delivery Reach section.', path: '/admin/delivery-reach' },
  ];

  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Homepage Sections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.desc}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to={section.path} className="w-full">
                <Button className="w-full">Edit Section</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;