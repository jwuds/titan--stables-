import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image as ImageIcon, Menu, Settings2, PlusCircle, LayoutTemplate } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentManagementTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Content Management System</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pages Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-blue-500">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <CardTitle>Pages & Routing</CardTitle>
            <CardDescription>Create and edit website pages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-500 mb-4">Manage your site's structure, create new landing pages, and update SEO metadata.</p>
            <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <LayoutTemplate className="w-4 h-4 mr-2" /> Manage Pages
            </Button>
            <Button variant="outline" className="w-full">
              <PlusCircle className="w-4 h-4 mr-2" /> Add New Page
            </Button>
          </CardContent>
        </Card>

        {/* Media Library Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-emerald-500">
          <CardHeader>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <ImageIcon className="w-6 h-6" />
            </div>
            <CardTitle>Media Library</CardTitle>
            <CardDescription>Images, videos, and documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-500 mb-4">Upload and organize assets used across your website. Supports bulk uploads.</p>
            <Button variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
               Open Library
            </Button>
            <Button variant="outline" className="w-full">
               Upload Assets
            </Button>
          </CardContent>
        </Card>

        {/* Navigation Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-amber-500">
          <CardHeader>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <Menu className="w-6 h-6" />
            </div>
            <CardTitle>Navigation Menus</CardTitle>
            <CardDescription>Header and footer links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-500 mb-4">Customize the main navigation menu and footer links to guide your visitors.</p>
            <Button variant="default" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
               Edit Menus
            </Button>
          </CardContent>
        </Card>
        
        {/* Global Settings Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-purple-500">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Settings2 className="w-6 h-6" />
            </div>
            <CardTitle>Global Content</CardTitle>
            <CardDescription>Sitewide variables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-500 mb-4">Manage contact information, social links, and other global site settings.</p>
            <Link to="/admin/content" className="block w-full">
              <Button variant="outline" className="w-full">
                 Edit Global Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentManagementTab;