export function extractHeadings(content) {
  if (!content || !Array.isArray(content)) return [];
  const headings = [];
  
  content.forEach((block) => {
    if (block.type === 'heading' && block.data?.text) {
      if (block.data.level === 'H2' || block.data.level === 'H3') {
        headings.push({
          level: block.data.level,
          text: block.data.text,
          id: block.id
        });
      }
    }
  });
  
  return headings;
}

export function generateAnchorLinks(headings) {
  return headings.map(h => {
    const anchor = h.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return { ...h, anchor };
  });
}

export function generateToC(headings) {
  const headingsWithAnchors = generateAnchorLinks(headings);
  return headingsWithAnchors; // Returns structured array for UI rendering
}