import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Activity, Zap, Server, Clock, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const PerformanceOptimizationPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('id, page_path, load_time, timestamp')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMetrics(data || []);
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group metrics simply by load_time threshold since check_type doesn't exist
  const slowMetrics = metrics.filter(m => m.load_time > 2000);
  const fastMetrics = metrics.filter(m => m.load_time <= 2000);

  const getAvgLoadTime = () => {
    if (metrics.length === 0) return 0;
    return (metrics.reduce((sum, item) => sum + Number(item.load_time || 0), 0) / metrics.length).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Performance Monitoring</h2>
        <p className="text-muted-foreground">
          Track application performance and slow metrics in real-time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Load Time (ms)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAvgLoadTime()}</div>
            <p className="text-xs text-muted-foreground">Overall application speed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fast Loads</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fastMetrics.length}</div>
            <p className="text-xs text-muted-foreground">&lt; 2000ms loads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slow Logs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{slowMetrics.length}</div>
            <p className="text-xs text-muted-foreground">Events taking &gt; 2000ms</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracked</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.length}</div>
            <p className="text-xs text-muted-foreground">Recent telemetry logs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-green-500"/> Optimization Checklist</CardTitle>
            <CardDescription>Implemented performance enhancements.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Route-level code splitting via React.lazy()</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> API Request deduplication and caching</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Image Lazy Loading & Blur-up strategy</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Component memoization (React.memo)</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> Supabase query field limiting</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-amber-500"/> Recent Slow Operations</CardTitle>
            <CardDescription>Monitor operations taking longer than 2 seconds.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="animate-pulse space-y-2"><div className="h-4 bg-slate-100 rounded"></div><div className="h-4 bg-slate-100 rounded"></div></div>
            ) : slowMetrics.length > 0 ? (
              <div className="space-y-4">
                {slowMetrics.slice(0, 5).map((q, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{q.page_path || 'Unknown Path'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(q.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="text-sm font-bold text-amber-600 shrink-0">{Number(q.load_time).toFixed(0)}ms</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">
                No slow operations logged recently. Great job!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceOptimizationPage;