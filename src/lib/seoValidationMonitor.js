/**
 * SEO Validation Monitor
 * Runs client-side checks for common SEO issues in development.
 * Refactored to remove Node.js 'process' globals for browser compatibility.
 */
export const runSEOMonitor = () => {
  // Use Vite's import.meta.env instead of Node's process.env
  if (!import.meta.env.DEV) return;

  setTimeout(() => {
    const issues = [];
    const path = window.location.pathname;

    // 1. Check H1 tags
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) issues.push('Missing H1 tag');
    if (h1s.length > 1) issues.push(`Multiple H1 tags found (${h1s.length})`);

    // 2. Check Canonical
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) issues.push('Missing canonical tag');
    else if (!canonical.href.startsWith('https://titanstables.org')) {
      issues.push(`Invalid canonical domain: ${canonical.href}`);
    }

    // 3. Check Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) issues.push('Missing meta description');
    else {
      const len = metaDesc.content.length;
      if (len < 50) issues.push(`Meta description too short (${len} chars)`);
      if (len > 165) issues.push(`Meta description too long (${len} chars)`);
    }

    // 4. Check Word Count (rough estimate of body content)
    const mainContent = document.querySelector('main') || document.body;
    const wordCount = mainContent.innerText.split(/\s+/).filter(w => w.length > 1).length;
    if (wordCount < 300) {
      issues.push(`Low word count (${wordCount} words) - Aim for 300+`);
    }

    if (issues.length > 0) {
      console.warn(`[SEO Monitor] Issues found on ${path}:`, issues);
    } else {
      console.log(`[SEO Monitor] Page ${path} looks good!`);
    }
  }, 2000); // Wait for React/Helmet to mount
};