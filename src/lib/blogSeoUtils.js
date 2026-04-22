export const generateSlug = (title) => {
  try {
    if (!title || typeof title !== 'string') return '';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  } catch (err) {
    console.error('Error generating slug:', err);
    return '';
  }
};

export const calculateReadTime = (content) => {
  try {
    if (!content || typeof content !== 'string') return '1 min read';
    const wordsPerMinute = 200;
    const textLength = content.split(/\s+/).length;
    const readTime = Math.ceil(textLength / wordsPerMinute);
    return `${readTime} min read`;
  } catch (err) {
    console.error('Error calculating read time:', err);
    return '1 min read';
  }
};

export const generateMetaTags = (post, seoData) => {
  try {
    const title = seoData?.meta_title || post?.title || 'Blog Post';
    const description = seoData?.meta_description || post?.excerpt || '';
    return { title, description, keywords: seoData?.meta_keywords || '' };
  } catch (err) {
    console.error('Error generating meta tags:', err);
    return { title: 'Blog Post', description: '', keywords: '' };
  }
};

export const generateSchemaMarkup = (post, seoData, canonicalUrl) => {
  try {
    if (!post) return null;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl || 'https://titanstables.com'
      },
      "headline": seoData?.meta_title || post.title || 'Untitled',
      "description": seoData?.meta_description || post.excerpt || '',
      "image": post.featured_image || post.image_url || '',
      "author": {
        "@type": "Person",
        "name": post.author || "Titan Stables"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Titan Stables",
        "logo": {
          "@type": "ImageObject",
          "url": "https://titanstables.com/logo.png"
        }
      },
      "datePublished": post.published_at || post.created_at || new Date().toISOString(),
      "dateModified": post.updated_at || new Date().toISOString()
    });
  } catch (err) {
    console.error('Error generating schema markup:', err);
    return null;
  }
};

export const validateSeoScore = (post, seoData) => {
  try {
    let score = 0;
    if (seoData?.meta_title?.length >= 50 && seoData?.meta_title?.length <= 60) score += 20;
    if (seoData?.meta_description?.length >= 150 && seoData?.meta_description?.length <= 160) score += 20;
    if (seoData?.focus_keyword && post?.title?.toLowerCase().includes(seoData.focus_keyword.toLowerCase())) score += 20;
    if (seoData?.h1_tag) score += 10;
    if (seoData?.meta_keywords) score += 10;
    if (post?.content?.length > 300) score += 20;
    return score;
  } catch (err) {
    console.error('Error validating SEO score:', err);
    return 0;
  }
};

export const generateRobots = () => {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /private
Sitemap: https://titanstables.com/sitemap.xml`;
};

export const generateSitemap = (posts = [], pages = []) => {
  try {
    const baseUrl = 'https://titanstables.com';
    const postUrls = posts.map(post => `
      <url>
        <loc>${baseUrl}/blog/${post.slug || ''}</loc>
        <lastmod>${new Date(post.updated_at || post.created_at || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl}/</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>${baseUrl}/blog</loc>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
        ${postUrls}
      </urlset>`;
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return '';
  }
};