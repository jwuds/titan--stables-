import React from 'react';
import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SocialShare = ({ url, title }) => {
  const { toast } = useToast();
  const fullUrl = `https://titanstables.com${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast({ title: "Link Copied", description: "URL copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-6">
      <span className="text-sm font-semibold text-slate-500 mr-2">Share:</span>
      
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
        target="_blank" 
        rel="noreferrer noopener"
        aria-label="Share on Facebook"
      >
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-slate-200 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]">
          <Facebook className="w-4 h-4" />
        </Button>
      </a>

      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} 
        target="_blank" 
        rel="noreferrer noopener"
        aria-label="Share on Twitter"
      >
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-slate-200 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]">
          <Twitter className="w-4 h-4" />
        </Button>
      </a>

      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} 
        target="_blank" 
        rel="noreferrer noopener"
        aria-label="Share on LinkedIn"
      >
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-slate-200 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]">
          <Linkedin className="w-4 h-4" />
        </Button>
      </a>

      <Button 
        size="icon" 
        variant="outline" 
        className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-100"
        onClick={handleCopy}
        aria-label="Copy Link"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default SocialShare;