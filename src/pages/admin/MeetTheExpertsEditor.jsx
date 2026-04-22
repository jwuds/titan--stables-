import React, { useState, useEffect } from 'react';
import { useAdminSections } from '@/hooks/useAdminSections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

const MeetTheExpertsEditor = () => {
  const { getTeamMembers, addTeamMember, deleteTeamMember, loading } = useAdminSections();
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', bio: '', image_url: '' });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await getTeamMembers();
    setMembers(data);
  };

  const handleAdd = async () => {
    if (!newMember.name) return;
    await addTeamMember({ ...newMember, display_order: members.length });
    setNewMember({ name: '', role: '', bio: '', image_url: '' });
    loadMembers();
  };

  const handleDelete = async (id) => {
    await deleteTeamMember(id);
    loadMembers();
  };

  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">Edit Meet the Experts</h1>
      
      <div className="space-y-4 mb-8 max-w-xl">
        <Input placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} />
        <Input placeholder="Role/Title" value={newMember.role} onChange={(e) => setNewMember({...newMember, role: e.target.value})} />
        <Input placeholder="Image URL" value={newMember.image_url} onChange={(e) => setNewMember({...newMember, image_url: e.target.value})} />
        <Textarea placeholder="Bio" value={newMember.bio} onChange={(e) => setNewMember({...newMember, bio: e.target.value})} />
        <Button onClick={handleAdd} disabled={loading || !newMember.name}>Add Expert</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <Card key={member.id}>
            <CardContent className="p-4 relative">
              <img src={member.image_url || 'https://via.placeholder.com/150'} alt={member.name} className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <Button variant="destructive" size="icon" className="absolute top-6 right-6" onClick={() => handleDelete(member.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MeetTheExpertsEditor;