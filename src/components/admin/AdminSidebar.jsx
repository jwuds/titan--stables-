import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Home, FileText, Settings, Users, X, LayoutDashboard, 
  Image as ImageIcon, BookOpen, Star, HelpCircle
} from 'lucide-react';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  
  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/horses', icon: Star, label: 'Horse Management' },
    { to: '/admin/blog', icon: BookOpen, label: 'Blog & Articles' },
    { to: '/admin/faqs', icon: HelpCircle, label: 'FAQ Management' },
    { to: '/admin/settings', icon: Settings, label: 'Site Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#0A1128] text-white flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link to="/admin" className="font-serif font-bold text-xl tracking-wider text-[#D4AF37]">
            TITAN<span className="text-white">ADMIN</span>
          </Link>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-[#D4AF37] text-white shadow-md' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'}
              `}
              onClick={() => setIsOpen(false)}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.user_metadata?.role || 'Admin'}</p>
            </div>
          </div>
          <Link 
            to="/" 
            className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" /> Return to Site
          </Link>
        </div>
      </aside>
    </>
  );
}