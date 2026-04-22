import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2, Play, Loader2, Pencil, Upload, FileVideo, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VideoCarousel = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [addMethod, setAddMethod] = useState('upload'); // 'upload' or 'url'
  
  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editVideoTitle, setEditVideoTitle] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Ref to hold multiple video elements
  const videoRefs = useRef({});
  const fileInputRef = useRef(null);

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('home_videos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Could not load videos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  // Auto-advance slide every 8 seconds
  useEffect(() => {
    if (videos.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentIndex, videos.length]);

  // Ensure current video plays explicitly when index changes
  useEffect(() => {
    const currentVideoEl = videoRefs.current[currentIndex];
    
    if (currentVideoEl) {
        currentVideoEl.currentTime = 0;
        const playPromise = currentVideoEl.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Auto-play was prevented:", error);
            });
        }
    }

    Object.keys(videoRefs.current).forEach(key => {
        const idx = parseInt(key);
        if (idx !== currentIndex && videoRefs.current[idx]) {
             videoRefs.current[idx].pause();
        }
    });

  }, [currentIndex]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please select a valid video file (MP4, WebM)",
          variant: "destructive"
        });
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    
    let finalUrl = '';

    if (addMethod === 'upload') {
        if (!selectedFile) {
            toast({ title: "Required", description: "Please select a video file", variant: "destructive" });
            return;
        }
    } else {
        if (!videoUrl) {
             toast({ title: "Required", description: "Please enter a video URL", variant: "destructive" });
             return;
        }
        finalUrl = videoUrl;
    }

    setIsSubmitting(true);
    try {
      if (addMethod === 'upload') {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(fileName, selectedFile, {
              cacheControl: '3600',
              upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('site-assets')
            .getPublicUrl(fileName);
        
        finalUrl = publicUrl;
      }

      const { data, error: dbError } = await supabase
        .from('home_videos')
        .insert([{ url: finalUrl, title: newVideoTitle || 'Featured Video' }])
        .select();

      if (dbError) throw dbError;

      setVideos([...videos, data[0]]);
      setIsAddDialogOpen(false);
      setSelectedFile(null);
      setNewVideoTitle('');
      setVideoUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      toast({
        title: "Success",
        description: "Video added to carousel",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to add video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (video) => {
    setEditingVideo(video);
    setEditVideoTitle(video.title || '');
    setEditVideoUrl(video.url || '');
    setIsEditDialogOpen(true);
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('home_videos')
        .update({ title: editVideoTitle, url: editVideoUrl })
        .eq('id', editingVideo.id)
        .select();

      if (error) throw error;

      const updatedVideos = videos.map(v => (v.id === editingVideo.id ? data[0] : v));
      setVideos(updatedVideos);
      setIsEditDialogOpen(false);
      setEditingVideo(null);
      toast({
        title: "Success",
        description: "Video details updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update video",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('home_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const newVideos = videos.filter(v => v.id !== id);
      setVideos(newVideos);
      if (currentIndex >= newVideos.length) {
        setCurrentIndex(Math.max(0, newVideos.length - 1));
      }
      
      toast({
        title: "Success",
        description: "Video removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] min-h-[500px] bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (videos.length === 0 && !user) {
    return null; 
  }

  const currentVideo = videos[currentIndex];

  return (
    <section className="relative h-[60vh] min-h-[500px] bg-slate-950 overflow-hidden flex items-center justify-center group">
      
      {videos.length > 0 ? (
        <div className="absolute inset-0 w-full h-full">
           <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" /> 
           {videos.map((video, index) => (
               <div 
                  key={video.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
               >
                   {(index === currentIndex || index === (currentIndex + 1) % videos.length || index === (currentIndex - 1 + videos.length) % videos.length) && (
                       <video
                           ref={(el) => (videoRefs.current[index] = el)}
                           autoPlay
                           loop
                           muted
                           playsInline
                           preload="auto"
                           itemProp="video"
                           className="w-full h-full object-cover"
                           src={video.url}
                           onContextMenu={(e) => e.preventDefault()}
                       />
                   )}
               </div>
           ))}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
           <div className="text-center p-6">
                <FileVideo className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No videos available</p>
                {user && <p className="text-slate-600 text-sm mt-2">Click "Add Video" to get started</p>}
           </div>
        </div>
      )}

      {videos.length > 0 && (
        <div className="relative z-20 container mx-auto px-4 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentVideo.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-2xl">
                <Play className="w-8 h-8 text-white fill-white ml-1 opacity-90" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                {currentVideo.title || "Poetry in Motion"}
              </h2>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto font-light drop-shadow-md">
                Witness the breathtaking grace and power that defines the Titan Stables lineage.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {videos.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-primary/90 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            aria-label="Previous Video"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-primary/90 hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            aria-label="Next Video"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {videos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex 
                    ? 'bg-primary w-8 h-2' 
                    : 'bg-white/40 w-2 h-2 hover:bg-white/60'
                }`}
                aria-label={`Go to video ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {user && (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 shadow-lg">
                <Plus className="w-4 h-4 mr-2" /> Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Carousel Video</DialogTitle>
                <DialogDescription>
                  Upload a video file or provide a direct URL.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="upload" onValueChange={setAddMethod} className="w-full">
                 <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                    <TabsTrigger value="url">Video URL</TabsTrigger>
                 </TabsList>
                 
                 <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input 
                            id="title" 
                            value={newVideoTitle}
                            onChange={(e) => setNewVideoTitle(e.target.value)}
                            placeholder="e.g., Morning Gallop" 
                            className="col-span-3" 
                        />
                    </div>
                    
                    <TabsContent value="upload" className="mt-0">
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">File</Label>
                        <div className="col-span-3">
                            <Input 
                            id="file" 
                            type="file"
                            accept="video/*"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="cursor-pointer"
                            />
                        </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-right">Supported formats: MP4, WebM</p>
                    </TabsContent>
                    
                    <TabsContent value="url" className="mt-0">
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">URL</Label>
                            <Input 
                                id="url" 
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://..." 
                                className="col-span-3" 
                            />
                        </div>
                    </TabsContent>
                 </div>
                 
                 <div className="flex justify-end mt-4">
                    <Button onClick={handleAddVideo} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                        </>
                    ) : (
                        <>
                        {addMethod === 'upload' ? <Upload className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                        Add Video
                        </>
                    )}
                    </Button>
                 </div>
              </Tabs>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
             <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Video Details</DialogTitle>
                <DialogDescription>Update title and source URL.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateVideo} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">Title</Label>
                  <Input 
                    id="edit-title" 
                    value={editVideoTitle}
                    onChange={(e) => setEditVideoTitle(e.target.value)}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-url" className="text-right">URL</Label>
                  <Input 
                    id="edit-url" 
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                    className="col-span-3" 
                  />
                </div>
                 <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save Changes
                    </Button>
                 </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {videos.length > 0 && (
            <>
              <Button
                 size="sm"
                 variant="secondary"
                 onClick={() => openEditDialog(currentVideo)}
                 className="opacity-80 hover:opacity-100 bg-white/10 text-white hover:bg-white/30 border border-white/20 backdrop-blur-sm"
              >
                <Pencil className="w-4 h-4" />
              </Button>

              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => handleDeleteVideo(currentVideo.id)}
                className="opacity-80 hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default VideoCarousel;