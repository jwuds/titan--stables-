import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const VisitorAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Enhanced Mock data
  const trafficData = [
    { name: 'Mon', visits: 1200, pageviews: 2400, unique: 980 },
    { name: 'Tue', visits: 1350, pageviews: 2800, unique: 1100 },
    { name: 'Wed', visits: 1600, pageviews: 3600, unique: 1350 },
    { name: 'Thu', visits: 1400, pageviews: 2900, unique: 1150 },
    { name: 'Fri', visits: 1900, pageviews: 4200, unique: 1600 },
    { name: 'Sat', visits: 2100, pageviews: 4800, unique: 1800 },
    { name: 'Sun', visits: 1800, pageviews: 3900, unique: 1500 },
  ];

  const funnelData = [
    { name: 'Homepage Visit', value: 12500, dropoff: 0 },
    { name: 'View Horse List', value: 8500, dropoff: 32 },
    { name: 'View Horse Detail', value: 4200, dropoff: 50 },
    { name: 'Contact Inquiry', value: 350, dropoff: 91 },
    { name: 'Purchase/Reserve', value: 45, dropoff: 87 },
  ];

  const sourceData = [
    { name: 'Direct', value: 4000 },
    { name: 'Google Search', value: 3000 },
    { name: 'Social Media', value: 2000 },
    { name: 'Referrals', value: 1000 },
    { name: 'Email', value: 500 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const exportCSV = () => {
    const headers = ['Day,Visits,Pageviews,Unique Users'];
    const rows = trafficData.map(d => `${d.name},${d.visits},${d.pageviews},${d.unique}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "traffic_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Advanced Analytics">
      <Helmet>
        <title>Analytics - Titan Admin</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border">
            <Button 
                variant={timeRange === '24h' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setTimeRange('24h')}
            >
                24h
            </Button>
            <Button 
                variant={timeRange === '7d' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setTimeRange('7d')}
            >
                7 Days
            </Button>
            <Button 
                variant={timeRange === '30d' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setTimeRange('30d')}
            >
                30 Days
            </Button>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <div className="flex items-center text-sm text-slate-500 px-2 cursor-pointer hover:text-slate-800">
                <CalendarIcon className="w-4 h-4 mr-2" /> Custom
            </div>
        </div>

        <Button onClick={exportCSV} variant="outline" className="ml-auto">
            <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-md">
            <CardContent className="pt-6">
              <div className="text-blue-100 text-sm font-medium mb-1">Total Visits</div>
              <div className="text-3xl font-bold">11,350</div>
              <div className="text-blue-100 text-xs mt-2 bg-white/20 inline-block px-2 py-0.5 rounded">
                +12.5% vs prev
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-slate-500 text-sm font-medium mb-1">Conversion Rate</div>
              <div className="text-3xl font-bold text-slate-900">2.1%</div>
              <div className="text-green-500 text-xs mt-2 font-medium">
                +0.4% improvement
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-slate-500 text-sm font-medium mb-1">Avg. Session</div>
              <div className="text-3xl font-bold text-slate-900">3m 45s</div>
              <div className="text-slate-400 text-xs mt-2">
                User engagement steady
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-slate-500 text-sm font-medium mb-1">Sales Revenue</div>
              <div className="text-3xl font-bold text-slate-900">$42.5k</div>
              <div className="text-green-500 text-xs mt-2 font-medium">
                +18% this month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Traffic Analysis</CardTitle>
                <CardDescription>Comparing visits vs unique users over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Area type="monotone" dataKey="visits" name="Total Visits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisits)" />
                    <Area type="monotone" dataKey="unique" name="Unique Users" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUnique)" />
                </AreaChart>
                </ResponsiveContainer>
            </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Where your users are coming from</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sourceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {sourceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey from landing to conversion</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} layout="vertical" barSize={30}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]}>
                            {funnelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === funnelData.length - 1 ? '#10b981' : '#cbd5e1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default VisitorAnalyticsPage;