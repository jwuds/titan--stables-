/**
 * IndexNow API Integration for Instant Search Engine Indexing
 * Supports Google, Bing, Yandex, and other IndexNow participants
 */

const INDEXNOW_KEY = '8f3c4a2b9e1d6f7a5c8b4e2d9f1a7c6b'; // Generate unique key for production
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_URL = 'https://titanstables.com';

/**
 * Submit URLs to IndexNow for immediate crawling
 * @param {string|string[]} urls - Single URL or array of URLs to submit
 * @returns {Promise<boolean>} Success status
 */
export async function submitToIndexNow(urls) {
  const urlList = Array.isArray(urls) ? urls : [urls];
  
  const payload = {
    host: 'titanstables.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urlList.map(url => url.startsWith('http') ? url : `${SITE_URL}${url}`)
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error('IndexNow submission failed:', error);
    return false;
  }
}

/**
 * URLs to submit for immediate indexing
 * Call this after content updates or new page creation
 */
export const PRIORITY_URLS = [
  '/',
  '/horses',
  '/about',
  '/facility',
  '/services',
  '/contact',
  '/reviews',
  '/faq',
  '/blog',
  '/store'
];

/**
 * Submit all priority pages to IndexNow
 */
export async function submitPriorityPages() {
  return await submitToIndexNow(PRIORITY_URLS);
}