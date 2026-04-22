import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient.js';
import { Mail, Phone } from 'lucide-react';
import LazyImage from '@/components/LazyImage.jsx';

const MeetTheTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('display_order', { ascending: true })
          .limit(4);

        if (error) throw error;
        setTeamMembers(data || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#0A1128] mb-6">
            Meet the <span className="text-[#D4AF37]">Experts</span>
          </h2>
          <p className="text-lg text-slate-600 font-montserrat leading-relaxed">
            Our internationally recognized team brings decades of combined expertise in Friesian breeding, dressage training, and global equine logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                <div className="aspect-[3/4] bg-slate-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-slate-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-[#D4AF37]/30 animate-pulse rounded mb-4"></div>
                  <div className="h-20 w-full bg-slate-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))
          ) : (
            teamMembers.map((member) => (
              <div key={member.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                  <LazyImage 
                    src={member.image_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Contact Overlay on Hover */}
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-3">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-white hover:text-[#D4AF37] transition-colors font-montserrat text-sm">
                        <Mail className="w-4 h-4" /> {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-white hover:text-[#D4AF37] transition-colors font-montserrat text-sm">
                        <Phone className="w-4 h-4" /> {member.phone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow text-center">
                  <h3 className="text-2xl font-playfair font-bold text-[#0A1128] mb-1">{member.name}</h3>
                  <p className="text-sm font-montserrat text-[#D4AF37] font-bold uppercase tracking-wider mb-4">
                    {member.position || member.role || 'Equine Specialist'}
                  </p>
                  <p className="text-slate-600 font-montserrat font-light text-sm leading-relaxed line-clamp-4">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;