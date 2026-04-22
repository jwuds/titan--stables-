import React, { useState, useEffect } from 'react';
import { useAdminSections } from '@/hooks/useAdminSections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

const DeliveryReachVideoEditor = () => {
  const { getDeliveryReachVideos, addDeliveryReachVideo, deleteDeliveryReachVideo, loading } = useAdminSections();
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ youtube_url: '', title: '' });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const data = await getDeliveryReachVideos();
    setVideos(data);
  };

  const handleAdd = async () => {
    if (!newVideo.youtube_url) return;
    await addDeliveryReachVideo({ ...newVideo, display_order: videos.length });
    setNewVideo({ youtube_url: '', title: '' });
    loadVideos();
  };

  const handleDelete = async (id) => {
    await deleteDeliveryReachVideo(id);
    loadVideos();
  };

  // Helper to extract youtube ID for thumbnail
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="container mx-auto p-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">Edit Delivery Reach Videos</h1>
      
      <div className="space-y-4 mb-8 max-w-xl">
        <Input placeholder="Video Title" value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} />
        <Input placeholder="YouTube URL (e.g., https://youtube.com/watch?v=...)" value={newVideo.youtube_url} onChange={(e) => setNewVideo({...newVideo, youtube_url: e.target.value})} />
        <Button onClick={handleAdd} disabled={loading || !newVideo.youtube_url}>Add Video</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => {
          const videoId = getYouTubeId(video.youtube_url);
          const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://via.placeholder.com/320x180?text=No+Thumbnail';
          
          return (
            <Card key={video.id}>
              <CardContent className="p-4 relative">
                <img src={thumbnailUrl} alt={video.title} className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="font-bold truncate">{video.title || 'Untitled Video'}</h3>
                <Button variant="destructive" size="icon" className="absolute top-6 right-6" onClick={() => handleDelete(video.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryReachVideoEditor;