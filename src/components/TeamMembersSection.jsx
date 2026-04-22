import React from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import TeamMemberCard from '@/components/TeamMemberCard';
import FadeIn from '@/components/animations/FadeIn';
import { useQueryCache } from '@/hooks/useQueryCache';

const fetchTeamMembers = async () => {
  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role, bio, image_url, credentials, specialization, years_experience')
    .order('display_order', { ascending: true })
    .limit(6);
  if (error) throw error;
  return data || [];
};

const TeamMembersSection = () => {
  const { data: teamMembers, loading } = useQueryCache(
    'team_members',
    fetchTeamMembers,
    { ttl: 60 * 60 * 1000 } // Cache for 1 hour
  );

  if (loading) {
    return (
      <div className="py-24 bg-slate-50 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4">
          {[1, 2, 3].map(i => (
             <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-slate-100 shadow-sm w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">Meet The Team</h2>
          <p className="text-lg text-slate-600">
            Our dedicated professionals bring decades of combined experience in equine care, training, and management.
          </p>
        </div>

        {teamMembers && teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <FadeIn key={member.id} delay={index * 0.1}>
                <TeamMemberCard member={member} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-12">
            <p>Our team is currently being updated. Please check back soon.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(TeamMembersSection);