import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Server, Database, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress.jsx';

const PerformanceTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">System Performance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">API Status</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">Operational</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <Server className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
              <CheckCircle className="w-4 h-4 mr-1" /> 100% Uptime
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Database</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">Connected</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <Database className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              Latency: <span className="font-bold text-slate-700 ml-1">24ms</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Avg Load Time</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">0.8s</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              Optimal performance
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> Resource Usage</CardTitle>
            <CardDescription>Current server resource allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">CPU Usage</span>
                <span className="text-slate-500">24%</span>
              </div>
              <Progress value={24} className="h-2 bg-slate-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Memory Allocation</span>
                <span className="text-slate-500">4.2 GB / 8 GB</span>
              </div>
              <Progress value={52} className="h-2 bg-slate-100 [&>div]:bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Storage</span>
                <span className="text-slate-500">12%</span>
              </div>
              <Progress value={12} className="h-2 bg-slate-100 [&>div]:bg-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-500" /> Recent Error Logs</CardTitle>
            <CardDescription>System errors and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
               <CheckCircle className="w-10 h-10 text-emerald-400 mb-3" />
               <h4 className="font-medium text-slate-800">System Healthy</h4>
               <p className="text-sm text-slate-500 max-w-[250px] mt-1">No significant errors or warnings logged in the last 24 hours.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceTab;