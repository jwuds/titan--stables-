import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * InternalLink component for SEO-optimized internal linking
 * Ensures consistent link structure and keyword-rich anchor text
 */
const InternalLink = ({ 
  to, 
  children, 
  className,
  title,
  variant = 'default' 
}) => {
  const baseStyles = 'transition-colors duration-200';
  
  const variants = {
    default: 'text-primary hover:text-primary/80 font-medium',
    inline: 'text-primary hover:underline',
    button: 'bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-semibold inline-block',
    subtle: 'text-slate-600 hover:text-primary underline decoration-dotted underline-offset-4'
  };

  return (
    <Link 
      to={to} 
      className={cn(baseStyles, variants[variant], className)}
      title={title || children}
    >
      {children}
    </Link>
  );
};

export default InternalLink;