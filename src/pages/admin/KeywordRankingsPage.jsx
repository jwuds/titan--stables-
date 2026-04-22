import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const KeywordRankingsPage = () => {
  // Mock data for keyword rankings
  const rankings = [
    { keyword: "friesian horses for sale", position: 3, change: 2, volume: "12.5K", difficulty: "High" },
    { keyword: "friesian stallions", position: 1, change: 0, volume: "8.2K", difficulty: "Med" },
    { keyword: "buy friesian horse", position: 5, change: -1, volume: "5.4K", difficulty: "High" },
    { keyword: "friesian horse breeders", position: 2, change: 1, volume: "3.1K", difficulty: "Med" },
    { keyword: "black horses for sale", position: 12, change: 4, volume: "22K", difficulty: "Very High" },
    { keyword: "dressage horses usa", position: 8, change: 0, volume: "6.5K", difficulty: "High" },
    { keyword: "friesian boarding facility", position: 1, change: 0, volume: "800", difficulty: "Low" },
  ];

  const getChangeIcon = (change) => {
    if (change > 0) return <span className="text-green-500 flex items-center text-xs"><ArrowUp className="w-3 h-3 mr-1" /> {change}</span>;
    if (change < 0) return <span className="text-red-500 flex items-center text-xs"><ArrowDown className="w-3 h-3 mr-1" /> {Math.abs(change)}</span>;
    return <span className="text-slate-400 flex items-center text-xs"><Minus className="w-3 h-3 mr-1" /> -</span>;
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
        case 'Low': return 'bg-green-100 text-green-800';
        case 'Med': return 'bg-yellow-100 text-yellow-800';
        case 'High': return 'bg-orange-100 text-orange-800';
        case 'Very High': return 'bg-red-100 text-red-800';
        default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <AdminLayout title="SEO & Keyword Rankings">
      <Helmet>
        <title>Keyword Rankings - Titan Admin</title>
      </Helmet>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none shadow-lg">
           <CardHeader>
             <CardTitle className="text-white/80 text-sm font-medium">Average Position</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold">4.2</div>
             <p className="text-white/60 text-sm mt-1">Across top 20 keywords</p>
           </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle className="text-slate-500 text-sm font-medium">Keywords in Top 3</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold text-slate-900">8</div>
             <p className="text-green-500 text-sm mt-1">+2 this month</p>
           </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle className="text-slate-500 text-sm font-medium">Organic Traffic Value</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold text-slate-900">$4.2k</div>
             <p className="text-slate-400 text-sm mt-1">Estimated monthly</p>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Tracked Keywords</CardTitle>
            <CardDescription>Current Google SERP positions for your target keywords</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Change (24h)</TableHead>
                            <TableHead>Volume</TableHead>
                            <TableHead>Difficulty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rankings.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{item.keyword}</TableCell>
                                <TableCell className="font-bold text-lg">{item.position}</TableCell>
                                <TableCell>{getChangeIcon(item.change)}</TableCell>
                                <TableCell>{item.volume}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`border-0 ${getDifficultyColor(item.difficulty)}`}>
                                        {item.difficulty}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default KeywordRankingsPage;