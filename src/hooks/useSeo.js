import { siteSeoConfig } from '@/config/seoConfig.js';

export const useSeo = (pageKey) => {
  const pageData = siteSeoConfig.pages[pageKey];

  if (!pageData) {
    console.warn(`SEO Config for page key "${pageKey}" not found. Falling back to site defaults.`);
    return {
      title: siteSeoConfig.name,
      description: siteSeoConfig.description,
      keywords: "",
      ogTitle: siteSeoConfig.name,
      ogDescription: siteSeoConfig.description,
      ogImage: "",
      ogType: "website",
      ogUrl: siteSeoConfig.domain,
      canonicalUrl: siteSeoConfig.domain,
    };
  }

  return {
    title: pageData.title || siteSeoConfig.name,
    description: pageData.description || siteSeoConfig.description,
    keywords: pageData.keywords || "",
    ogTitle: pageData.ogTitle || pageData.title || siteSeoConfig.name,
    ogDescription: pageData.ogDescription || pageData.description || siteSeoConfig.description,
    ogImage: pageData.ogImage || "",
    ogType: pageData.ogType || "website",
    ogUrl: pageData.ogUrl || siteSeoConfig.domain,
    canonicalUrl: pageData.ogUrl || siteSeoConfig.domain,
  };
};