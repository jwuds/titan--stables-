import React from 'react';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A secure, reusable anchor component for external links.
 * 
 * CRITICAL SECURITY FEATURE:
 * This component automatically enforces `rel="noreferrer noopener"` when `target="_blank"`
 * is present. This prevents reverse tabnapping vulnerabilities and ensures compliance
 * with modern security standards.
 */
const ExternalLink = ({ 
  href, 
  children, 
  className, 
  showIcon = false,
  ...props 
}) => {
  const isExternal = props.target === '_blank';
  
  // Calculate appropriate rel attributes
  // Always preserve existing rel props, but enforce noreferrer noopener for external links
  let rel = props.rel || '';
  
  if (isExternal) {
    if (!rel.includes('noreferrer')) rel = `${rel} noreferrer`;
    if (!rel.includes('noopener')) rel = `${rel} noopener`;
  }

  // Clean up whitespace
  rel = rel.trim();

  return (
    <a 
      href={href}
      className={cn(
        "inline-flex items-center transition-colors hover:text-primary",
        className
      )}
      rel={rel || undefined}
      {...props}
    >
      {children}
      {showIcon && isExternal && (
        <ExternalLinkIcon className="ml-1 h-3 w-3" aria-hidden="true" />
      )}
    </a>
  );
};

export default ExternalLink;