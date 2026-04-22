import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Music } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const iconMap = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  TikTok: Music
};

const defaultLinks = [
  { 
    platform: 'Facebook', 
    url: 'https://www.facebook.com/share/1AtuzRi5oB/', 
    active: true 
  },
  { 
    platform: 'Instagram', 
    url: 'https://www.instagram.com/titanstables?igsh=eHF6OGduaTI5Z2Ri', 
    active: true 
  }
];

const SocialMediaLinks = ({ className, iconSize = "w-5 h-5", containerClass = "" }) => {
  const { getContent } = useContent();
  
  // Try to get dynamic links, fall back to default if not set or empty
  let socialLinks = [];
  try {
    const storedLinks = getContent('social_media_links');
    if (storedLinks) {
      socialLinks = typeof storedLinks === 'string' ? JSON.parse(storedLinks) : storedLinks;
    }
  } catch (e) {
    console.error("Error parsing social links", e);
  }

  // Use defaults if nothing in DB
  if (!socialLinks || socialLinks.length === 0) {
    socialLinks = defaultLinks;
  }

  return (
    <div className={cn("flex items-center gap-4", containerClass)}>
      {socialLinks.filter(link => link.active !== false).map((link, index) => {
        const Icon = iconMap[link.platform] || Facebook;
        
        return (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer" // Ensures dofollow by omitting nofollow
            aria-label={`Follow Titan Stables on ${link.platform}`}
            title={`Visit our official ${link.platform} page for updates`}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
              "bg-slate-900 text-slate-300 border border-slate-700",
              "hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]",
              "group relative overflow-hidden",
              className
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
             <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
            <Icon className={cn("relative z-10", iconSize)} aria-hidden="true" />
          </motion.a>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;