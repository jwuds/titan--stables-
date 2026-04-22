import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, ShieldAlert, Lock, UserX, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SecurityAlertsPage = () => {
  // Mock security logs
  const alerts = [
    { type: 'warning', title: "Failed Login Attempt", desc: "Multiple failed attempts from IP 192.168.1.42 (Russia)", time: "10 mins ago", icon: UserX },
    { type: 'info', title: "Admin Login Success", desc: "User admin@titanstables.org logged in from VA, USA", time: "1 hour ago", icon: ShieldCheck },
    { type: 'error', title: "Firewall Block", desc: "Blocked SQL Injection attempt on /api/horses", time: "3 hours ago", icon: ShieldAlert },
    { type: 'info', title: "System Update", desc: "Security patches applied successfully", time: "1 day ago", icon: Lock },
  ];

  return (
    <AdminLayout title="Security Center">
      <Helmet>
        <title>Security Alerts - Titan Admin</title>
      </Helmet>

      <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
             <div className="p-3 bg-green-100 rounded-full text-green-600">
                <ShieldCheck className="w-8 h-8" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-green-900">System Secure</h2>
                <p className="text-green-700">No critical vulnerabilities detected. All systems operational.</p>
             </div>
        </div>
        <Button variant="outline" className="border-green-300 text-green-800 hover:bg-green-100 bg-white">
            Run Scan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity Log</CardTitle>
                    <CardDescription>Security events from the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {alerts.map((alert, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                            <div className={`p-2 rounded-full shrink-0 ${
                                alert.type === 'error' ? 'bg-red-100 text-red-600' : 
                                alert.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                                'bg-blue-100 text-blue-600'
                            }`}>
                                <alert.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                                    <span className="text-xs text-slate-400">{alert.time}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{alert.desc}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Threat Map</CardTitle>
                    <CardDescription>Top sources of blocked traffic</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium">China</span>
                            </div>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">142 blocks</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium">Russia</span>
                            </div>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">89 blocks</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium">Brazil</span>
                            </div>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">34 blocks</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                    <CardTitle className="text-amber-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> 
                        Action Required
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-amber-900 mb-4">
                        Your SSL certificate will expire in 14 days. Auto-renewal is active, but please monitor status.
                    </p>
                    <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none">
                        View Certificate
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SecurityAlertsPage;