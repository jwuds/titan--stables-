import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash, Plus, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useBlogArticles } from '@/hooks/useBlogArticles';
import { useToast } from '@/components/ui/use-toast';

export default function AdminBlogPage() {
  const { fetchArticles, deleteArticle, publishArticle, unpublishArticle } = useBlogArticles();
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const load = async () => {
    try {
      const data = await fetchArticles(filter !== 'all' ? { status: filter } : {});
      setArticles(data || []);
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id) => {
    if(!confirm('Are you sure?')) return;
    await deleteArticle(id);
    toast({ title: 'Deleted' });
    load();
  };

  const handleTogglePublish = async (a) => {
    if (a.status === 'published') await unpublishArticle(a.id);
    else await publishArticle(a.id);
    load();
  };

  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Blog Management">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-4">
          <Input placeholder="Search titles..." value={search} onChange={e => setSearch(e.target.value)} className="w-64 bg-white text-slate-900 border-slate-300" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px] bg-white text-slate-900 border-slate-300"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link to="/admin/blog/editor">
          <Button><Plus className="w-4 h-4 mr-2" /> New Article</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(a => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell>{a.category}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.status==='published'?'bg-green-100 text-green-800':'bg-amber-100 text-amber-800'}`}>
                    {a.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(a)} title={a.status==='published'?'Unpublish':'Publish'}>
                    {a.status === 'published' ? <XCircle className="w-4 h-4 text-amber-600" /> : <CheckCircle className="w-4 h-4 text-green-600" />}
                  </Button>
                  <Link to={`/admin/blog/editor/${a.id}`}>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4 text-blue-600" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash className="w-4 h-4 text-red-600" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!filtered.length && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">No articles found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}