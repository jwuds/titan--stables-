
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import RecentMatchesManager from '@/components/admin/RecentMatchesManager';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminRecentMatchesPage = () => {
  return (
    <>
      <Helmet>
        <title>Recent Matches Manager | Admin - Titan Stables</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/admin" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">Recent Matches</span>
          </nav>

          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Recent Matches Carousel</h1>
            <p className="text-slate-600">
              Manage success stories and recent matches displayed on the homepage and testimonials page. 
              Add photos, stories, and details about happy clients and their new horses.
            </p>
          </div>

          {/* Manager Component */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <RecentMatchesManager />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminRecentMatchesPage;
