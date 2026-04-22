import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const AnalyticsTab = () => {
  const [deviceData, setDeviceData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('site_analytics_events').select('device_type');
        if (data) {
          const counts = data.reduce((acc, curr) => {
            acc[curr.device_type] = (acc[curr.device_type] || 0) + 1;
            return acc;
          }, {});
          setDeviceData(Object.keys(counts).map(key => ({ name: key, value: counts[key] })));
        }
      } catch (err) {
        console.error("Error fetching analytics", err);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Traffic Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Visitors by device category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={deviceData.length ? deviceData : [{name: 'No data', value: 1}]} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={80} 
                    outerRadius={110} 
                    paddingAngle={5} 
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600"><Monitor className="w-4 h-4 text-blue-500"/> Desktop</div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><Smartphone className="w-4 h-4 text-emerald-500"/> Mobile</div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><Tablet className="w-4 h-4 text-amber-500"/> Tablet</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Page Views Overview</CardTitle>
            <CardDescription>Views by platform source</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[calc(100%-5rem)]">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;