import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Rabbit as Horse, 
  FileText, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  ExternalLink, 
  MessageSquare, 
  Globe, 
  Mail, 
  BarChart,
  ShieldAlert,
  Users,
  Menu,
  BookOpen,
  MapPin,
  Image as ImageIcon,
  Heart,
  Activity,
  Building2,
  PhoneCall,
  Star,
  Library
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NotificationCenter from '@/components/admin/NotificationCenter';

const AdminLayout = ({ children, title }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { section: 'Dashboard' },
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    
    { section: 'Content Management' },
    { name: 'Blog Management', path: '/admin/blog', icon: FileText },
    { name: 'Horse Management', path: '/admin/horses', icon: Horse },
    { name: 'Horse Facts Library', path: '/admin/horse-facts', icon: Library },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Services', path: '/admin/services', icon: Star },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Team', path: '/admin/team', icon: Users },
    { name: 'Affiliates', path: '/admin/affiliates', icon: Globe },
    
    { section: 'Site Settings' },
    { name: 'Global Settings', path: '/admin/global-settings', icon: Globe },
    { name: 'General Settings', path: '/admin/settings', icon: Settings },
    
    { section: 'System & Tools' },
    { name: 'Users & Roles', path: '/admin/users', icon: Users },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-800 bg-slate-950">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">TS</div>
             <div className="flex flex-col">
               <span className="font-bold text-lg tracking-tight text-white leading-tight">Admin Portal</span>
             </div>
           </div>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item, index) => {
            if (item.section) return <div key={`section-${index}`} className="px-4 pt-5 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.section}</div>;
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)}>
                <div className={cn("flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all mb-1 text-sm font-medium group", isActive ? "bg-blue-600/10 text-blue-500" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
                  <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-white")} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800 bg-slate-950 shrink-0">
          <Link to="/" target="_blank">
             <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 mb-2 h-9 text-sm">
               <ExternalLink className="w-4 h-4 mr-2" /> View Live Site
             </Button>
          </Link>
          <Button variant="destructive" className="w-full justify-start h-9 text-sm bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-0" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />}
      <div className={cn("fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl", isSidebarOpen ? "translate-x-0" : "-translate-x-full")}><SidebarContent /></div>
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col h-screen sticky top-0 overflow-hidden border-r border-slate-800"><SidebarContent /></aside>
      <main className="flex-1 overflow-auto flex flex-col h-screen relative w-full">
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 px-4 md:px-8 py-3.5 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-slate-600 hover:bg-slate-100" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu className="w-5 h-5" /></Button>
            <h1 className="text-xl font-bold text-slate-800 hidden md:block">{title || "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 w-full max-w-[1600px] mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;