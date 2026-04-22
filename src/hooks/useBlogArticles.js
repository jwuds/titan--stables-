
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { safeQuery } from '@/lib/supabaseErrorHandler';
import { 
  cacheGet, 
  cacheSet, 
  deduplicateRequest, 
  invalidateCache, 
  CACHE_KEYS 
} from '@/lib/queryCache';
import { 
  fetchWithRetry, 
  withCircuitBreaker, 
  handleSupabaseError 
} from '@/lib/supabaseErrorRecovery';
import { validateBlogImageUrl, extractBlogImageUrl, DEFAULT_PLACEHOLDER } from '@/lib/blogImageOptimization';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const POSTS_PER_PAGE = 10;

/**
 * REQUIRED ARTICLE DATA STRUCTURE:
 * {
 *   id: string|number (REQUIRED),
 *   title: string (REQUIRED),
 *   slug: string (REQUIRED),
 *   excerpt: string (REQUIRED),
 *   featured_image_url: string,
 *   hero_image_url: string,
 *   image_url: string,
 *   category: string (REQUIRED - defaults to 'general' if missing),
 *   published_at: string (ISO date),
 *   created_at: string (ISO date),
 *   view_count: number,
 *   author: string,
 *   featured: boolean,
 *   status: string
 * }
 * 
 * DEFENSIVE PROGRAMMING:
 * - Validates all articles before returning
 * - Filters out articles missing required fields
 * - Provides default values for optional fields
 * - Logs warnings for debugging
 * - Always returns array (never undefined)
 * - Never crashes on invalid data
 */

/**
 * Validate that an article has all required properties
 * @param {Object} article - Article object to validate
 * @returns {boolean} - True if article is valid
 */
const isValidArticle = (article) => {
  if (!article || typeof article !== 'object') {
    console.warn('useBlogArticles: Invalid article object (null/undefined/non-object)', article);
    return false;
  }

  const required = ['id', 'title', 'slug'];
  const missing = required.filter(field => !article[field]);

  if (missing.length > 0) {
    console.warn(`useBlogArticles: Article missing required fields: ${missing.join(', ')}`, {
      id: article.id,
      title: article.title,
      slug: article.slug,
    });
    return false;
  }

  return true;
};

/**
 * Sanitize and validate blog article data
 * Provides defaults for missing optional fields
 * @param {Object} article - Raw article data from database
 * @returns {Object|null} - Sanitized article or null if invalid
 */
const sanitizeBlogArticle = (article) => {
  // DEFENSIVE CHECK #1: Null/undefined validation
  if (!article) {
    console.warn('useBlogArticles: sanitizeBlogArticle received null/undefined article');
    return null;
  }

  // DEFENSIVE CHECK #2: Validate required fields
  if (!isValidArticle(article)) {
    return null;
  }

  try {
    // Extract and validate image URL
    const imageUrl = extractBlogImageUrl(article);
    const validImageUrl = validateBlogImageUrl(imageUrl) ? imageUrl : DEFAULT_PLACEHOLDER;

    // DEFENSIVE CHECK #3: Provide defaults for all fields
    const sanitized = {
      id: article.id,
      title: article.title || 'Untitled Article',
      slug: article.slug || '',
      excerpt: article.excerpt || 'No description available.',
      featured_image_url: validImageUrl,
      hero_image_url: article.hero_image_url || validImageUrl,
      image_url: validImageUrl,
      category: article.category || 'general', // CRITICAL: Always provide category
      published_at: article.published_at || article.created_at || new Date().toISOString(),
      created_at: article.created_at || new Date().toISOString(),
      view_count: article.view_count || 0,
      author: article.author || 'Titan Stables',
      featured: article.featured || false,
      status: article.status || 'published',
    };

    // DEFENSIVE CHECK #4: Log warnings for missing optional fields
    if (!article.excerpt) {
      console.warn(`useBlogArticles: Missing excerpt for article "${sanitized.title}" (ID: ${sanitized.id})`);
    }
    if (!article.category) {
      console.warn(`useBlogArticles: Missing category for article "${sanitized.title}" (ID: ${sanitized.id}) - defaulting to 'general'`);
    }
    if (!article.featured_image_url && !article.image_url) {
      console.warn(`useBlogArticles: Missing image URL for article "${sanitized.title}" (ID: ${sanitized.id}) - using placeholder`);
    }

    return sanitized;
  } catch (error) {
    console.error('useBlogArticles: Error sanitizing article', error, article);
    return null;
  }
};

/**
 * Validate and filter array of articles
 * @param {Array} articles - Raw articles from database
 * @returns {Array} - Validated and sanitized articles
 */
const validateArticles = (articles) => {
  // DEFENSIVE CHECK #1: Ensure articles is an array
  if (!Array.isArray(articles)) {
    console.warn('useBlogArticles: validateArticles received non-array value', typeof articles);
    return [];
  }

  // DEFENSIVE CHECK #2: Filter and sanitize all articles
  const validated = articles
    .map(sanitizeBlogArticle)
    .filter(article => article !== null);

  // DEFENSIVE CHECK #3: Log statistics
  const invalidCount = articles.length - validated.length;
  if (invalidCount > 0) {
    console.warn(`useBlogArticles: Filtered out ${invalidCount} invalid articles from ${articles.length} total`);
  }

  return validated;
};

export const useBlogArticles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    const {
      status,
      category,
      featured,
      page = 1,
      limit = POSTS_PER_PAGE,
      sort = 'newest',
    } = filters;

    const cacheKey = `${CACHE_KEYS.BLOG_ARTICLES}_${JSON.stringify(filters)}`;

    try {
      // Check cache first
      const cached = cacheGet(cacheKey);
      if (cached) {
        setLoading(false);
        return cached;
      }

      // Deduplicate concurrent requests
      const data = await deduplicateRequest(
        cacheKey,
        () => withCircuitBreaker(
          'blog_articles',
          () => fetchWithRetry(
            async () => {
              // CRITICAL: Select ALL required fields including category
              let query = supabase
                .from('blog_articles')
                .select('id, title, slug, excerpt, featured_image_url, hero_image_url, image_url, category, published_at, created_at, view_count, author, featured, status', { count: 'exact' });

              // Apply filters
              if (status) query = query.eq('status', status);
              if (category) query = query.eq('category', category);
              if (featured !== undefined) query = query.eq('featured', featured);

              // Apply sorting
              switch (sort) {
                case 'popular':
                  query = query.order('view_count', { ascending: false });
                  break;
                case 'featured':
                  query = query.eq('featured', true).order('published_at', { ascending: false });
                  break;
                case 'oldest':
                  query = query.order('published_at', { ascending: true });
                  break;
                case 'newest':
                default:
                  query = query.order('published_at', { ascending: false });
              }

              // Pagination
              const from = (page - 1) * limit;
              const to = from + limit - 1;
              query = query.range(from, to);

              const { data, error: queryError, count } = await safeQuery(query, []);

              if (queryError) throw queryError;

              // DEFENSIVE: Validate and sanitize all articles
              const validatedArticles = validateArticles(data || []);

              return {
                articles: validatedArticles,
                total: count || 0,
                page,
                totalPages: Math.ceil((count || 0) / limit),
              };
            },
            { retries: 3, timeout: 10000, fallbackData: { articles: [], total: 0, page, totalPages: 0 } }
          ),
          { articles: [], total: 0, page, totalPages: 0 }
        )
      );

      // DEFENSIVE CHECK: Ensure data structure is valid
      if (!data || typeof data !== 'object') {
        console.error('useBlogArticles: Invalid data structure returned', data);
        setLoading(false);
        return { articles: [], total: 0, page, totalPages: 0 };
      }

      // DEFENSIVE CHECK: Ensure articles is always an array
      const safeData = {
        articles: Array.isArray(data.articles) ? data.articles : [],
        total: data.total || 0,
        page: data.page || page,
        totalPages: data.totalPages || 0,
      };

      // Cache the result
      cacheSet(cacheKey, safeData, CACHE_TTL);

      setLoading(false);
      return safeData;
    } catch (err) {
      console.error('useBlogArticles: Fetch error', err);
      const errorInfo = handleSupabaseError(err, 'fetchArticles');
      setError(errorInfo.message);
      setLoading(false);
      
      // DEFENSIVE: Always return valid structure on error
      return { articles: [], total: 0, page, totalPages: 0 };
    }
  }, []);

  const fetchArticleBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);

    // DEFENSIVE CHECK: Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      console.warn('useBlogArticles: Invalid slug provided to fetchArticleBySlug', slug);
      setLoading(false);
      return null;
    }

    const cacheKey = `${CACHE_KEYS.BLOG_ARTICLES}_slug_${slug}`;

    try {
      const cached = cacheGet(cacheKey);
      if (cached) {
        setLoading(false);
        return cached;
      }

      const data = await deduplicateRequest(
        cacheKey,
        () => withCircuitBreaker(
          'blog_article_detail',
          () => fetchWithRetry(
            async () => {
              const query = supabase
                .from('blog_articles')
                .select('*')
                .eq('slug', slug);

              const { data, error: queryError } = await safeQuery(query.single(), null);

              if (queryError) throw queryError;

              // Increment view count (non-blocking)
              if (data && data.id) {
                supabase
                  .from('blog_articles')
                  .update({ view_count: (data.view_count || 0) + 1 })
                  .eq('id', data.id)
                  .then(() => {})
                  .catch(() => {});
              }

              // DEFENSIVE: Sanitize single article
              return sanitizeBlogArticle(data);
            },
            { retries: 3, timeout: 10000, fallbackData: null }
          ),
          null
        )
      );

      if (data) {
        cacheSet(cacheKey, data, CACHE_TTL);
      }

      setLoading(false);
      return data;
    } catch (err) {
      console.error('useBlogArticles: Error fetching article by slug', err);
      const errorInfo = handleSupabaseError(err, 'fetchArticleBySlug');
      setError(errorInfo.message);
      setLoading(false);
      return null;
    }
  }, []);

  const createArticle = async (data) => {
    setError(null);

    try {
      // DEFENSIVE: Validate required fields before creating
      if (!data.title || !data.slug) {
        throw new Error('Missing required fields: title and slug are required');
      }

      // Validate image URL before creating
      const imageUrl = data.featured_image_url || data.image_url;
      if (imageUrl && !validateBlogImageUrl(imageUrl)) {
        throw new Error('Invalid image URL provided');
      }

      // DEFENSIVE: Ensure category is set
      const articleData = {
        ...data,
        category: data.category || 'general',
      };

      const result = await fetchWithRetry(
        async () => {
          const insertQuery = supabase
            .from('blog_articles')
            .insert([articleData])
            .select();

          const { data: result, error: queryError } = await safeQuery(insertQuery.single(), null);

          if (queryError) throw queryError;
          return sanitizeBlogArticle(result);
        },
        { retries: 2, timeout: 15000 }
      );

      // Invalidate cache
      invalidateCache(CACHE_KEYS.BLOG_ARTICLES);

      return result;
    } catch (err) {
      console.error('useBlogArticles: Error creating article', err);
      const errorInfo = handleSupabaseError(err, 'createArticle');
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  };

  const updateArticle = async (id, data) => {
    setError(null);

    try {
      // DEFENSIVE: Validate ID
      if (!id) {
        throw new Error('Article ID is required for update');
      }

      // Validate image URL if updating
      if (data.featured_image_url && !validateBlogImageUrl(data.featured_image_url)) {
        throw new Error('Invalid image URL provided');
      }

      const result = await fetchWithRetry(
        async () => {
          const updateQuery = supabase
            .from('blog_articles')
            .update({ ...data, updated_at: new Date() })
            .eq('id', id)
            .select();

          const { data: result, error: queryError } = await safeQuery(updateQuery.single(), null);

          if (queryError) throw queryError;
          return sanitizeBlogArticle(result);
        },
        { retries: 2, timeout: 15000 }
      );

      // Invalidate cache
      invalidateCache(CACHE_KEYS.BLOG_ARTICLES);

      return result;
    } catch (err) {
      console.error('useBlogArticles: Error updating article', err);
      const errorInfo = handleSupabaseError(err, 'updateArticle');
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  };

  const deleteArticle = async (id) => {
    setError(null);

    try {
      // DEFENSIVE: Validate ID
      if (!id) {
        throw new Error('Article ID is required for deletion');
      }

      await fetchWithRetry(
        async () => {
          const deleteQuery = supabase
            .from('blog_articles')
            .delete()
            .eq('id', id);

          const { error: queryError } = await safeQuery(deleteQuery, null);

          if (queryError) throw queryError;
        },
        { retries: 2, timeout: 15000 }
      );

      // Invalidate cache
      invalidateCache(CACHE_KEYS.BLOG_ARTICLES);
    } catch (err) {
      console.error('useBlogArticles: Error deleting article', err);
      const errorInfo = handleSupabaseError(err, 'deleteArticle');
      setError(errorInfo.message);
      throw new Error(errorInfo.message);
    }
  };

  const publishArticle = async (id) => updateArticle(id, { status: 'published', published_at: new Date() });
  const unpublishArticle = async (id) => updateArticle(id, { status: 'draft', published_at: null });

  return {
    loading,
    error,
    fetchArticles,
    fetchArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    unpublishArticle,
  };
};
