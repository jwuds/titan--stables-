import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, User, TrendingUp, Users, Eye, ArrowRight, FileText, Settings, BarChart3, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Link } from 'react-router-dom';
import SeoHead from '@/components/SeoHead.jsx';

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ articles: 0, horses: 0, views: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: aCount }, { count: hCount }, { data: viewsData }] = await Promise.all([
        supabase.from('blog_articles').select('*', { count: 'exact', head: true }),
        supabase.from('horses').select('*', { count: 'exact', head: true }),
        supabase.from('blog_articles').select('view_count')
      ]);
      const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;
      setStats({ articles: aCount || 0, horses: hCount || 0, views: totalViews });
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-body">
      <SeoHead pageKey="admin" />
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen relative">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-[#0A1128]" />
            </Button>
            <h1 className="text-2xl font-heading font-bold text-[#0A1128] hidden sm:block">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-[#D4AF37]" />
              {user?.email}
            </div>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-10 custom-scrollbar relative z-0">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="bg-[#0A1128] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
              <h2 className="text-3xl font-heading font-bold mb-2">Welcome back, Admin.</h2>
              <p className="text-slate-300 max-w-xl">Manage your premium content, oversee the horse directory, and configure global settings from your control center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Total Articles</h3>
                <p className="text-3xl font-bold text-[#0A1128]">{stats.articles}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-50 text-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Article Views</h3>
                <p className="text-3xl font-bold text-[#0A1128]">{stats.views}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Horses Cataloged</h3>
                <p className="text-3xl font-bold text-[#0A1128]">{stats.horses}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-heading font-bold text-[#0A1128] border-b border-slate-100 pb-4 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/admin/blog/editor" className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-[#0A1128] hover:text-white transition-colors group">
                    <span className="font-medium">Write New Article</span>
                    <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/admin/horses" className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-[#0A1128] hover:text-white transition-colors group">
                    <span className="font-medium">Add New Horse</span>
                    <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/admin/horse-facts" className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-[#0A1128] hover:text-white transition-colors group">
                    <span className="font-medium">Manage Facts Library</span>
                    <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                 <div className="w-16 h-16 bg-[#0A1128] rounded-full flex items-center justify-center text-[#D4AF37] mb-4">
                    <Users className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-heading font-bold text-[#0A1128] mb-2">System Status: Optimal</h3>
                 <p className="text-slate-500 mb-6">All services and databases are running smoothly.</p>
                 <Link to="/admin/settings">
                    <Button variant="outline" className="border-[#0A1128] text-[#0A1128] hover:bg-[#0A1128] hover:text-white">
                       System Settings
                    </Button>
                 </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}