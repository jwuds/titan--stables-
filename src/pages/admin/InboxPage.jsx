import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';
import { Mail, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error(error);
    } else {
        setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    await supabase.from('contact_submissions').update({ status: 'read' }).eq('id', id);
    setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    toast({ title: "Marked as read" });
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this message?')) return;
    await supabase.from('contact_submissions').delete().eq('id', id);
    setMessages(messages.filter(m => m.id !== id));
    toast({ title: "Message deleted" });
  };

  return (
    <AdminLayout title="Incoming Messages & Orders">
      <Helmet><title>Inbox - Titan Admin</title></Helmet>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" /> Recent Inquiries
            </h2>
            <span className="text-sm text-slate-500">
                {messages.filter(m => m.status === 'new').length} Unread
            </span>
         </div>

         <div className="divide-y divide-slate-100">
            {loading ? (
                <div className="p-8 text-center text-slate-500">Loading messages...</div>
            ) : messages.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No messages yet.</div>
            ) : (
                messages.map(msg => (
                    <div key={msg.id} className={`p-6 hover:bg-slate-50 transition-colors ${msg.status === 'new' ? 'bg-blue-50/50 border-l-4 border-l-primary' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-900">{msg.name}</h3>
                                <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                                    <span className="text-primary font-medium">{msg.email}</span>
                                    {msg.phone && <span>• {msg.phone}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(msg.created_at), 'MMM d, yyyy h:mm a')}
                                </span>
                                {msg.status === 'new' && (
                                    <Button size="sm" variant="ghost" onClick={() => handleMarkRead(msg.id)} title="Mark Read">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </Button>
                                )}
                                <Button size="sm" variant="ghost" onClick={() => handleDelete(msg.id)} title="Delete">
                                    <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-slate-700 mt-3 whitespace-pre-wrap text-sm bg-white/50 p-3 rounded border border-slate-100">
                            {msg.message}
                        </p>
                    </div>
                ))
            )}
         </div>
      </div>
    </AdminLayout>
  );
};

export default InboxPage;