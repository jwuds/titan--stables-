import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Search, UserCog, Shield, User, MoreHorizontal, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    // In a real app, this would fetch from a secure edge function or auth admin API
    // Here we fetch from our public profiles table we created
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    // MOCK DATA for demonstration since we can't easily populate auth users in this demo environment
    if (!data || data.length === 0) {
      setUsers([
        { id: '1', email: 'admin@titanstables.org', role: 'admin', status: 'active', last_active: new Date().toISOString(), created_at: '2023-01-01' },
        { id: '2', email: 'staff@titanstables.org', role: 'moderator', status: 'active', last_active: new Date().toISOString(), created_at: '2023-02-15' },
        { id: '3', email: 'john.doe@example.com', role: 'user', status: 'active', last_active: '2023-11-20', created_at: '2023-11-01' },
        { id: '4', email: 'jane.smith@example.com', role: 'user', status: 'inactive', last_active: '2023-10-05', created_at: '2023-09-12' },
      ]);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    // Optimistic update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    // Actual update (simulated for mock data, real for db data)
    await supabase.from('user_profiles').upsert({ id: userId, role: newRole });
    toast({ title: "Role Updated", description: `User role changed to ${newRole}` });
    
    // Also notify system
    await supabase.from('notifications').insert({
        type: 'user',
        title: 'User Role Changed',
        message: `User ${userId} role was updated to ${newRole} by admin.`,
    });
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast({ title: "Status Updated", description: `User is now ${newStatus}` });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <Badge className="bg-purple-600 hover:bg-purple-700">Admin</Badge>;
      case 'moderator': return <Badge className="bg-blue-600 hover:bg-blue-700">Moderator</Badge>;
      default: return <Badge variant="outline" className="text-slate-600">User</Badge>;
    }
  };

  return (
    <AdminLayout title="User Management">
      <Helmet><title>Users - Titan Admin</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-4 flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search users by email..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
              <SelectItem value="user">Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Export Users
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.email}</div>
                      <div className="text-xs text-slate-500">ID: {user.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'} className="capitalize">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(user.last_active).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                        <Shield className="w-4 h-4 mr-2" /> Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'moderator')}>
                        <UserCog className="w-4 h-4 mr-2" /> Make Moderator
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')}>
                        <User className="w-4 h-4 mr-2" /> Make User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleStatusToggle(user.id, user.status)}>
                         {user.status === 'active' ? 'Ban User' : 'Unban User'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;