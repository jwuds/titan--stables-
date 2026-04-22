import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AdminHomepageEditor = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Homepage Editor | Titan Stables Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Homepage Editor</h2>
            <p className="text-muted-foreground">Manage content for the new homepage sections.</p>
          </div>
          <Link to="/" target="_blank">
             <Button variant="outline">
               <Eye className="mr-2 h-4 w-4" /> View Homepage
             </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card className="bg-blue-50/50 border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-blue-600 w-5 h-5" />
                <CardTitle className="text-blue-900">Interactive Editing Enabled</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                The new homepage sections are built with <strong>Inline Editing</strong> capabilities. 
                Instead of using a complex form here, you can simply:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 ml-4 mb-4">
                <li>Go to the <Link to="/" className="underline font-semibold hover:text-blue-600">Homepage</Link> while logged in as Admin.</li>
                <li>Hover over any text in the new sections (Welcome, Why Choose, etc.).</li>
                <li>Click the <span className="inline-block bg-slate-200 px-1 rounded text-xs">Pencil</span> icon that appears.</li>
                <li>Edit the text directly and click the <span className="inline-block bg-green-500 text-white px-1 rounded text-xs">Check</span> button to save.</li>
              </ol>
              <p className="text-sm text-blue-700">
                This "What You See Is What You Get" approach ensures your content looks exactly right on the live site.
              </p>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle>Section Overview</CardTitle>
                <CardDescription>The following sections have been added to your homepage and are fully editable.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                   <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h3 className="font-semibold text-lg mb-2">1. Welcome Section</h3>
                      <p className="text-sm text-slate-500 mb-2">Hero banner with large background image and introduction text.</p>
                      <div className="text-xs text-slate-400">Editable: Title, Subtitle, Description, CTA Buttons</div>
                   </div>
                   <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h3 className="font-semibold text-lg mb-2">2. Why Choose Titan</h3>
                      <p className="text-sm text-slate-500 mb-2">6 feature blocks highlighting your unique value propositions.</p>
                      <div className="text-xs text-slate-400">Editable: Main Title, Feature Titles & Descriptions</div>
                   </div>
                   <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h3 className="font-semibold text-lg mb-2">3. Black Pearl</h3>
                      <p className="text-sm text-slate-500 mb-2">Educational section about the Friesian breed.</p>
                      <div className="text-xs text-slate-400">Editable: Title, Paragraphs</div>
                   </div>
                   <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h3 className="font-semibold text-lg mb-2">4. Titan Guarantee</h3>
                      <p className="text-sm text-slate-500 mb-2">5 cards detailing your promises to clients.</p>
                      <div className="text-xs text-slate-400">Editable: Titles, Descriptions</div>
                   </div>
                   <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h3 className="font-semibold text-lg mb-2">5. Journey to Ownership</h3>
                      <p className="text-sm text-slate-500 mb-2">Step-by-step timeline of the purchase process.</p>
                      <div className="text-xs text-slate-400">Editable: Step Titles & Descriptions</div>
                   </div>
                   <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <h3 className="font-semibold text-lg mb-2">6. Navigation Hub</h3>
                      <p className="text-sm text-slate-500 mb-2">Quick links to major site areas.</p>
                      <div className="text-xs text-slate-400">Editable: Card Descriptions</div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHomepageEditor;