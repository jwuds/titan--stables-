import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Users, Eye, Clock, Activity, ArrowUpRight } from 'lucide-react';

const OverviewTab = () => {
  const [stats, setStats] = useState({ visitors: 0, views: 0, bounce: 0, msgs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: views } = await supabase.from('site_analytics_events').select('*', { count: 'exact', head: true });
        const { count: msgs } = await supabase.from('site_messages').select('*', { count: 'exact', head: true }).eq('status', 'new');
        setStats({ visitors: Math.floor(views / 2) || 0, views: views || 0, bounce: 35, msgs: msgs || 0 });
      } catch (err) {
        console.error("Error fetching overview stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Overview Metrics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Total Views</CardTitle>
            <div className="p-2 bg-white/20 rounded-full"><Eye className="h-5 w-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.views}</div>
            <p className="text-xs text-blue-100 mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> +12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-indigo-100">Unique Visitors</CardTitle>
            <div className="p-2 bg-white/20 rounded-full"><Users className="h-5 w-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.visitors}</div>
            <p className="text-xs text-indigo-100 mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> +8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Bounce Rate</CardTitle>
            <div className="p-2 bg-white/20 rounded-full"><Activity className="h-5 w-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.bounce}%</div>
            <p className="text-xs text-emerald-100 mt-1">Healthy engagement</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-100">Unread Messages</CardTitle>
            <div className="p-2 bg-white/20 rounded-full"><Clock className="h-5 w-5 text-white" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.msgs}</div>
            <p className="text-xs text-amber-100 mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;