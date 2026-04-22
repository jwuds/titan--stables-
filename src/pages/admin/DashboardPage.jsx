import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  Mail,
  AlertCircle,
  BarChart,
  ShieldAlert,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    horses: 0,
    unreadMessages: 0,
    products: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [horses, messages, products, reviews] = await Promise.all([
          supabase.from('horses').select('id', { count: 'exact' }),
          supabase.from('contact_submissions').select('id', { count: 'exact' }).eq('status', 'new'),
          supabase.from('site_content').select('key', { count: 'exact' }).eq('type', 'product'), 
          supabase.from('reviews').select('id', { count: 'exact' }).eq('approved', false)
        ]);

        setStats({
          horses: horses.count || 0,
          unreadMessages: messages.count || 0,
          products: products.count || 0,
          reviews: reviews.count || 0
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <Helmet>
        <title>Dashboard - Titan Admin</title>
      </Helmet>

      {/* Alert Section for New Messages */}
      {stats.unreadMessages > 0 && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">You have {stats.unreadMessages} new message{stats.unreadMessages !== 1 && 's'}!</h3>
              <p className="text-sm text-amber-700">Check your inbox for new inquiries and orders.</p>
            </div>
          </div>
          <Button asChild variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-100">
            <Link to="/admin/inbox">View Inbox</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Horses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.horses}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbox</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviews}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">Items available</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="hover:bg-slate-50 transition-colors">
          <Link to="/admin/analytics">
             <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                   <BarChart className="mr-2 h-5 w-5 text-blue-500" /> Visitor Analytics
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-sm text-muted-foreground mb-4">View detailed traffic reports, user demographics, and engagement metrics.</div>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                   View Reports <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
             </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:bg-slate-50 transition-colors">
          <Link to="/admin/rankings">
             <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                   <TrendingUp className="mr-2 h-5 w-5 text-purple-500" /> Keyword Rankings
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-sm text-muted-foreground mb-4">Track SEO performance and Google search position for key terms.</div>
                 <div className="flex items-center text-purple-600 text-sm font-medium">
                   Check Rankings <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
             </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-slate-50 transition-colors">
          <Link to="/admin/security">
             <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                   <ShieldAlert className="mr-2 h-5 w-5 text-green-500" /> Security Center
                </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-sm text-muted-foreground mb-4">Monitor login attempts, firewall blocks, and system health status.</div>
                 <div className="flex items-center text-green-600 text-sm font-medium">
                   Security Status <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
             </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
             <Button asChild className="h-20 text-lg" variant="outline">
                <Link to="/admin/horses" className="flex flex-col gap-1">
                    <span>Manage Horses</span>
                    <span className="text-xs font-normal text-muted-foreground">Add or edit listings</span>
                </Link>
             </Button>
             <Button asChild className="h-20 text-lg" variant="outline">
                <Link to="/admin/inbox" className="flex flex-col gap-1">
                    <span>Check Messages</span>
                    <span className="text-xs font-normal text-muted-foreground">View inquiries & orders</span>
                </Link>
             </Button>
             <Button asChild className="h-20 text-lg" variant="outline">
                <Link to="/admin/contact" className="flex flex-col gap-1">
                    <span>Update Contact Info</span>
                    <span className="text-xs font-normal text-muted-foreground">Change phone, email, address</span>
                </Link>
             </Button>
             <Button asChild className="h-20 text-lg" variant="outline">
                <Link to="/admin/blog" className="flex flex-col gap-1">
                    <span>Blog Posts</span>
                    <span className="text-xs font-normal text-muted-foreground">Write new articles</span>
                </Link>
             </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>All systems operational</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div> Connected
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div> Available
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm">API</span>
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div> Online
                    </span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;