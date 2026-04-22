/**
 * Generates content formatted for Featured Snippets/Citable answers.
 */
export const generateCitableContent = (title, tldr, details, sources = []) => {
  return {
    title,
    summary: tldr,
    content: details,
    references: sources,
    structuredHtml: `
      <div class="citable-answer" id="${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
        <h2>${title}</h2>
        <p class="summary font-bold"><strong>TL;DR:</strong> ${tldr}</p>
        <div class="details">${details}</div>
        ${sources.length ? `<ul class="sources">${sources.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
      </div>
    `
  };
};

/**
 * Creates a semantic outline structure for comprehensive topic coverage.
 */
export const generateSemanticDensity = (topic) => {
  return [
    { section: "Definition", focus: `What is a ${topic}? Core characteristics.` },
    { section: "History & Origins", focus: `Where did ${topic} originate? Evolution over time.` },
    { section: "Physical Characteristics", focus: `Size, color, conformation of ${topic}.` },
    { section: "Temperament & Behavior", focus: `Personality traits, suitability for different riders.` },
    { section: "Applications & Uses", focus: `Dressage, driving, pleasure riding applications for ${topic}.` },
    { section: "Health & Care", focus: `Specific dietary, veterinary, and care needs.` },
    { section: "Frequently Asked Questions", focus: `Common queries regarding ${topic}.` },
    { section: "Related Topics", focus: `Comparisons to other breeds, associated equestrian disciplines.` }
  ];
};

/**
 * Generates location-based long-tail keyword variations.
 */
export const generateLocalKeywords = (city, state, service) => {
  return [
    `${service} in ${city} ${state}`,
    `best ${service} near ${city}`,
    `top rated ${service} ${state}`,
    `${city} ${service} services`,
    `where to find ${service} around ${city}`,
    `affordable ${service} ${city} area`
  ];
};

/**
 * Validates Name, Address, Phone consistency.
 */
export const validateNAP = (name, address, phone) => {
  const issues = [];
  if (!name || name.length < 3) issues.push("Business name is missing or too short.");
  if (!address || address.length < 10) issues.push("Address appears incomplete.");
  const phoneRegex = /^\+?[\d\s-]{10,15}$/;
  if (!phoneRegex.test(phone)) issues.push("Phone number format is invalid.");
  
  return {
    isValid: issues.length === 0,
    issues,
    normalized: {
      name: name?.trim(),
      address: address?.trim(),
      phone: phone?.replace(/[^\d+]/g, '')
    }
  };
};

/**
 * Generates conversational query variations for Voice Search optimization.
 */
export const generateVoiceSearchQueries = (topic) => {
  return [
    `Hey Google, what is the average cost of a ${topic}?`,
    `Alexa, find the best place to buy a ${topic} near me.`,
    `Siri, how long do ${topic}s usually live?`,
    `Can a beginner ride a ${topic}?`,
    `What do I need to know before buying a ${topic}?`,
    `Where is the closest ${topic} breeder?`
  ];
};