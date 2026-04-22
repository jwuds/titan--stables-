export const generateQuickFactsTable = (article, blocks) => {
  if (!blocks || !blocks.length) return [];
  const words = blocks.reduce((acc, b) => acc + (b.content?.text || '').split(' ').length, 0);
  return [
    { label: 'Category', value: article.category || 'General' },
    { label: 'Read Time', value: `${Math.max(1, Math.ceil(words / 200))} min` },
    { label: 'Published', value: new Date(article.published_at || article.created_at).toLocaleDateString() }
  ];
};

export const formatBreedFacts = (breed) => {
  if (!breed) return null;
  return {
    origin: breed.origin,
    height: breed.height_range,
    weight: breed.weight_range,
    lifespan: breed.lifespan,
    characteristics: breed.characteristics || {},
    temperament: breed.temperament || [],
    uses: breed.primary_uses || []
  };
};

export const generateReadTime = (blocks) => {
  if (!blocks) return 1;
  const words = blocks.reduce((acc, b) => {
    let text = b.content?.text || b.content?.html || '';
    if (b.content?.items) text += JSON.stringify(b.content.items);
    return acc + text.split(/\s+/).length;
  }, 0);
  return Math.max(1, Math.ceil(words / 200));
};