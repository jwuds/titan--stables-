import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const SocialMediaIcons = ({
  facebookUrl = '#',
  instagramUrl = '#',
  linkedinUrl = '#',
  twitterUrl = '#',
  youtubeUrl = '#'
}) => {
  const icons = [
    { Icon: Facebook, url: facebookUrl, label: 'Facebook' },
    { Icon: Instagram, url: instagramUrl, label: 'Instagram' },
    { Icon: Linkedin, url: linkedinUrl, label: 'LinkedIn' },
    { Icon: Twitter, url: twitterUrl, label: 'Twitter' },
    { Icon: Youtube, url: youtubeUrl, label: 'YouTube' }
  ];

  return (
    <div className="flex items-center gap-[12px]">
      {icons.map(({ Icon, url, label }, index) => (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-white hover:text-[#D4AF37] transition-all duration-300 ease-out hover:scale-[1.15] p-2 -m-2"
        >
          <Icon size={24} strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
};

export default SocialMediaIcons;