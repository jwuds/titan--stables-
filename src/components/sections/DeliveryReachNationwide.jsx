import React, { useState, useEffect } from 'react';
import { PlayCircle, Edit, ChevronDown } from 'lucide-react';
import LazyImage from '@/components/LazyImage.jsx';
import { useAdmin } from '@/contexts/AdminContext';
import { Link } from 'react-router-dom';
import { useAdminSections } from '@/hooks/useAdminSections';
import { Button } from '@/components/ui/button';

const DeliveryReachNationwide = () => {
  const { isAdmin } = useAdmin();
  const { getDeliveryReachVideos } = useAdminSections();
  const [demos, setDemonstrations] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const data = await getDeliveryReachVideos();
        if (data && data.length > 0) {
          setDemonstrations(data);
          setActiveVideo(data[0]);
        }
      } catch (error) {
        console.error('Error fetching delivery demonstrations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemos();
  }, []);

  const getYouTubeId = (url) => {
    if(!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const displayedDemos = showAll ? demos : demos.slice(0, 3);

  return (
    <section className="section-container bg-slate-100 text-slate-900 border-y border-slate-200 relative group">
      {isAdmin && (
        <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to="/admin/delivery-reach">
            <Button variant="secondary" size="sm" className="gap-2 shadow-lg">
              <Edit className="w-4 h-4" /> Edit Videos
            </Button>
          </Link>
        </div>
      )}
      <div className="section-content">
        <div className="section-header">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#0A1128]">
            Our Delivery Reach — <span className="text-[#D4AF37]">Nationwide</span> Horse Transport
          </h2>
          <p className="text-lg text-slate-600 font-montserrat leading-relaxed font-light max-w-3xl mx-auto">
            Watch our seamless domestic and nationwide transportation process. From specialized trailers to stress-free unloading, we ensure your Titan arrives in pristine condition.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="aspect-video w-full bg-slate-200 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-video bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        ) : (
          demos.length > 0 && (
            <div className="flex flex-col gap-12">
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl p-4 md:p-6 lg:p-8">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black mb-6 shadow-inner">
                  {activeVideo && getYouTubeId(activeVideo.youtube_url) && (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtube_url)}`}
                      title={activeVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                
                {activeVideo && (
                  <div className="max-w-4xl">
                    <h3 className="text-3xl font-playfair font-bold text-slate-900 mb-3">{activeVideo.title}</h3>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedDemos.map((demo) => {
                  const videoId = getYouTubeId(demo.youtube_url);
                  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://via.placeholder.com/600x400';
                  return (
                    <button
                      key={demo.id}
                      onClick={() => setActiveVideo(demo)}
                      className={`group/btn relative rounded-xl overflow-hidden aspect-video border-2 transition-all duration-300 text-left ${
                        activeVideo?.id === demo.id 
                          ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                          : 'border-transparent hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <LazyImage 
                        src={thumbnailUrl} 
                        alt={demo.title}
                        className="w-full h-full object-cover group-hover/btn:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-[#0A1128]/40 group-hover/btn:bg-[#0A1128]/20 transition-colors duration-300"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className={`w-12 h-12 transition-all duration-300 ${
                          activeVideo?.id === demo.id ? 'text-[#D4AF37]' : 'text-white/80 group-hover/btn:text-white group-hover/btn:scale-110'
                        }`} />
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <h4 className="font-playfair font-bold text-white text-lg truncate group-hover/btn:text-[#D4AF37] transition-colors">{demo.title}</h4>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {demos.length > 3 && (
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAll(!showAll)}
                    className="gap-2"
                  >
                    {showAll ? 'Show Less' : `Show ${demos.length - 3} More Videos`}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default DeliveryReachNationwide;