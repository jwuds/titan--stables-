export function validateFocusKeyword(keyword, content) {
  if (!keyword || keyword.trim() === '') {
    return { score: 0, status: 'fail', message: 'Focus keyword is missing.' };
  }
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  const regex = new RegExp(keyword, 'gi');
  const matches = textContent.match(regex);
  const count = matches ? matches.length : 0;
  
  if (count === 0) {
    return { score: 0, status: 'fail', message: 'Focus keyword not found in content.' };
  } else if (count > 0 && count < 3) {
    return { score: 50, status: 'warning', message: 'Focus keyword appears, but could be used more.' };
  } else {
    return { score: 100, status: 'pass', message: 'Focus keyword usage is good.' };
  }
}

export function validateMetaDescription(description) {
  if (!description) return { score: 0, status: 'fail', message: 'Meta description is missing.' };
  const len = description.length;
  if (len < 50) return { score: 30, status: 'warning', message: 'Meta description is too short (aim for 120-160 chars).' };
  if (len > 160) return { score: 70, status: 'warning', message: 'Meta description is slightly too long.' };
  return { score: 100, status: 'pass', message: 'Meta description length is optimal.' };
}

export function validateCanonicalURL(url) {
  if (!url) return { score: 0, status: 'fail', message: 'Canonical URL is recommended.' };
  try {
    new URL(url);
    return { score: 100, status: 'pass', message: 'Canonical URL is valid.' };
  } catch (e) {
    return { score: 0, status: 'fail', message: 'Invalid URL format.' };
  }
}

export function checkKeywordDensity(keyword, content) {
  if (!keyword || !content) return { score: 0, status: 'fail', message: 'Missing keyword or content.' };
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  const words = textContent.split(/\s+/).length;
  if (words === 0) return { score: 0, status: 'fail', message: 'Content is empty.' };
  
  const regex = new RegExp(keyword, 'gi');
  const matches = textContent.match(regex);
  const count = matches ? matches.length : 0;
  const density = (count / words) * 100;
  
  if (density === 0) return { score: 0, status: 'fail', message: '0% density.' };
  if (density > 3) return { score: 50, status: 'warning', message: `Density is too high (${density.toFixed(1)}%). Risk of keyword stuffing.` };
  return { score: 100, status: 'pass', message: `Good keyword density (${density.toFixed(1)}%).` };
}

export function calculateReadabilityScore(content) {
  const textContent = typeof content === 'string' ? content : JSON.stringify(content);
  // Basic Flesch-Kincaid estimation for demonstration
  const words = textContent.split(/\s+/).length;
  const sentences = textContent.split(/[.!?]+/).length;
  const syllables = textContent.length / 3; // Rough approximation
  
  if (words === 0 || sentences === 0) return { score: 0, status: 'fail', message: 'Not enough content.' };
  
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  const normalized = Math.max(0, Math.min(100, score));
  
  if (normalized < 30) return { score: normalized, status: 'fail', message: 'Very difficult to read.' };
  if (normalized < 60) return { score: normalized, status: 'warning', message: 'Fairly difficult to read.' };
  return { score: normalized, status: 'pass', message: 'Good readability.' };
}

export function calculateSEOScore(post) {
  let totalScore = 0;
  let checks = 0;
  
  const kw = validateFocusKeyword(post.focus_keyword, post.content_json);
  totalScore += kw.score; checks++;
  
  const meta = validateMetaDescription(post.meta_description);
  totalScore += meta.score; checks++;
  
  if (post.canonical_url) {
    const can = validateCanonicalURL(post.canonical_url);
    totalScore += can.score; checks++;
  }
  
  const read = calculateReadabilityScore(post.content_json);
  totalScore += read.score; checks++;
  
  return Math.round(totalScore / checks);
}