import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Award, User } from 'lucide-react';

const TeamMemberCard = ({ member }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white group rounded-xl">
        <div className="aspect-[3/4] overflow-hidden relative">
          <img
            src={member.image_url || 'https://via.placeholder.com/400x500?text=No+Image'}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 right-4 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold font-serif mb-1">{member.name}</h3>
            <p className="text-primary font-bold text-sm uppercase tracking-wider">{member.role}</p>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
              {member.bio}
            </p>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {member.specialization && (
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-primary shrink-0 mt-1" />
                <div className="text-sm">
                   <span className="font-bold text-slate-900 block">Specialization</span>
                   <span className="text-slate-500">{member.specialization}</span>
                </div>
              </div>
            )}
            
            {member.credentials && (
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-primary shrink-0 mt-1" />
                <div className="text-sm">
                   <span className="font-bold text-slate-900 block">Credentials</span>
                   <span className="text-slate-500">{member.credentials}</span>
                </div>
              </div>
            )}

             {member.years_experience && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-1" />
                <div className="text-sm">
                   <span className="font-bold text-slate-900 block">Experience</span>
                   <span className="text-slate-500">{member.years_experience}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeamMemberCard;