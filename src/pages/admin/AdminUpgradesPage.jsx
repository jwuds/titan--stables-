import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, ShieldCheck, Search, Globe, FileText, Database } from 'lucide-react';

const UpgradeItem = ({ title, status, description }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    {status === 'complete' ? (
      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
    )}
    <div>
      <h4 className="font-medium text-slate-900 text-sm">{title}</h4>
      <p className="text-slate-500 text-xs mt-0.5">{description}</p>
    </div>
  </div>
);

const AdminUpgradesPage = () => {
  return (
    <AdminLayout title="System Upgrades Status">
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Security & Tech */}
        <div className="grid md:grid-cols-2 gap-6">
           <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                 <ShieldCheck className="w-5 h-5 text-primary" />
                 <CardTitle className="text-lg">Security & Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                 <UpgradeItem status="complete" title="ModSecurity Fixes" description="Patched vulnerabilities in API endpoints and file uploaders." />
                 <UpgradeItem status="complete" title="Miqka Crawler Optimization" description="Added proper robots.txt and sitemap directives for correct indexing." />
                 <UpgradeItem status="complete" title="Input Sanitization" description="Applied DOMPurify to all rich text rendering to prevent XSS." />
                 <UpgradeItem status="complete" title="Geo-Blocking" description="Configured restricted access for unauthorized regions." />
              </CardContent>
           </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                 <Search className="w-5 h-5 text-primary" />
                 <CardTitle className="text-lg">SEO Enhancements</CardTitle>
              </CardHeader>
              <CardContent>
                 <UpgradeItem status="complete" title="Meta Tag Optimization" description="Unique titles and descriptions for all pages." />
                 <UpgradeItem status="complete" title="Schema Markup" description="Implemented Organization, Product, and Breadcrumb schema." />
                 <UpgradeItem status="complete" title="Canonical URLs" description="Fixed self-referencing canonicals on dynamic routes." />
                 <UpgradeItem status="complete" title="Internal Linking" description="Established breadcrumbs and cross-linking structure." />
              </CardContent>
           </Card>
        </div>

        {/* Content Upgrades */}
        <Card>
           <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Content & Pages Expansion</CardTitle>
           </CardHeader>
           <CardContent className="grid md:grid-cols-2 gap-x-8">
              <div>
                  <h5 className="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wider">New Pages</h5>
                  <UpgradeItem status="complete" title="Policies Page" description="Full legal and operational policies implemented." />
                  <UpgradeItem status="complete" title="Breed History" description="Comprehensive educational page on Friesian origins." />
                  <UpgradeItem status="complete" title="Pricing Guide" description="Transparent breakdown of cost factors." />
                  <UpgradeItem status="complete" title="Care & Training" description="Guide for owners on maintenance and health." />
                  <UpgradeItem status="complete" title="Export Guide" description="Step-by-step international shipping process." />
              </div>
              <div>
                  <h5 className="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wider">Core Updates</h5>
                  <UpgradeItem status="complete" title="About Page Rewrite" description="Luxury branding text with professional sign-off." />
                  <UpgradeItem status="complete" title="Team Management" description="Dynamic team section with Supabase integration." />
                  <UpgradeItem status="complete" title="Facility Gallery" description="Masonry grid with lightbox and admin management." />
              </div>
           </CardContent>
        </Card>

        {/* Database */}
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Database Integration</CardTitle>
           </CardHeader>
            <CardContent>
                 <UpgradeItem status="complete" title="Supabase Storage" description="Buckets configured for facility, team, and horse images." />
                 <UpgradeItem status="complete" title="Dynamic Policies" description="Policies table created and connected to admin editor." />
                 <UpgradeItem status="complete" title="Team Members Table" description="CRUD operations fully functional." />
            </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
};

export default AdminUpgradesPage;