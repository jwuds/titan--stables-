import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle2, Clock, Trash2, Reply } from 'lucide-react';

const MessagesTab = () => {
  const [messages, setMessages] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await supabase.from('site_messages').select('*').order('created_at', { ascending: false });
        if (data) setMessages(data);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };
    fetchMessages();
  }, []);

  const handleReply = async (msg) => {
    toast({ title: "Sending Reply...", description: "Processing via Edge Function" });
    try {
      const { data, error } = await supabase.functions.invoke('send-message-reply', {
        body: { to_email: msg.sender_email, subject: msg.subject, message: "Thank you for your message.", original_message_id: msg.id }
      });
      if (error) throw error;
      toast({ title: "Reply Sent", variant: "success" });
      
      // Update local state
      setMessages(messages.map(m => m.id === msg.id ? { ...m, status: 'replied' } : m));
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'new': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">New</Badge>;
      case 'replied': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Replied</Badge>;
      case 'read': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Read</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Inbox Management</h2>
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5"/> Recent Messages</CardTitle>
          <CardDescription>Manage your incoming site inquiries</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <p className="text-lg font-medium text-slate-700">All caught up!</p>
              <p>No new messages in your inbox.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map(msg => (
                <div key={msg.id} className={`transition-colors duration-200 ${msg.status === 'new' ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                  <div 
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  >
                    <div className="flex-1 min-w-0 flex items-start gap-4">
                      <div className="mt-1">{getStatusBadge(msg.status || 'new')}</div>
                      <div>
                        <h4 className={`text-base truncate ${msg.status === 'new' ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {msg.subject || 'No Subject provided'}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <span className="font-medium">{msg.sender_name || msg.sender_email}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" className="bg-white" onClick={(e) => { e.stopPropagation(); handleReply(msg); }}>
                        <Reply className="w-4 h-4 mr-1" /> Reply
                      </Button>
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {expandedId === msg.id && (
                    <div className="px-4 pb-4 pt-0 sm:pl-20">
                      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm text-sm text-slate-700">
                        <div className="mb-4 grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-md">
                           <div><span className="font-semibold block text-xs uppercase text-slate-500">Email</span> {msg.sender_email}</div>
                           {msg.sender_phone && <div><span className="font-semibold block text-xs uppercase text-slate-500">Phone</span> {msg.sender_phone}</div>}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.message || 'No message content.'}</div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
                           <Button onClick={() => handleReply(msg)} className="bg-blue-600 hover:bg-blue-700 text-white">Send Reply via Email</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesTab;