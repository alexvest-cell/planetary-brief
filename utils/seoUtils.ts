import { Article } from '../types';

/**
 * Generate Article structured data (JSON-LD) for SEO
 * Follows schema.org NewsArticle specification
 */
export function generateArticleSchema(article: Article): object {
    const baseUrl = 'https://planetarybrief.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.seoDescription || article.excerpt,
        image: article.imageUrl ? [article.imageUrl] : [],
        datePublished: article.createdAt || article.date,
        dateModified: article.updatedAt || article.createdAt || article.date,
        author: {
            '@type': 'Organization',
            name: 'Planetary Brief Editorial Team',
            url: `${baseUrl}/about`
        },
        publisher: {
            '@type': 'Organization',
            name: 'Planetary Brief',
            url: baseUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/favicon.svg`
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/article/${article.slug || article.id}`
        },
        articleSection: Array.isArray(article.category) ? article.category[0] : article.category,
        keywords: article.keywords?.join(', ') || '',
        ...(article.imageAttribution && {
            creditText: article.imageAttribution
        })
    };
}

/**
 * Update document meta tags for SEO
 */
export function updateMetaTags(config: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
}) {
    // Update title
    if (config.title) {
        document.title = config.title;
    }

    // Update or create meta description
    if (config.description) {
        updateMetaTag('name', 'description', config.description);
    }

    // Update canonical URL
    if (config.canonicalUrl) {
        updateLinkTag('canonical', config.canonicalUrl);
    }

    // OpenGraph tags
    if (config.ogTitle) {
        updateMetaTag('property', 'og:title', config.ogTitle);
    }
    if (config.ogDescription) {
        updateMetaTag('property', 'og:description', config.ogDescription);
    }
    if (config.ogImage) {
        updateMetaTag('property', 'og:image', config.ogImage);
    }
    if (config.canonicalUrl) {
        updateMetaTag('property', 'og:url', config.canonicalUrl);
    }

    // Twitter Card tags
    if (config.twitterCard) {
        updateMetaTag('name', 'twitter:card', config.twitterCard);
    }
    if (config.ogTitle) {
        updateMetaTag('name', 'twitter:title', config.ogTitle);
    }
    if (config.ogDescription) {
        updateMetaTag('name', 'twitter:description', config.ogDescription);
    }
    if (config.ogImage) {
        updateMetaTag('name', 'twitter:image', config.ogImage);
    }
}

/**
 * Helper to update or create a meta tag
 */
function updateMetaTag(attribute: 'name' | 'property', attributeValue: string, content: string) {
    let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
    }

    element.setAttribute('content', content);
}

/**
 * Helper to update or create a link tag
 */
function updateLinkTag(rel: string, href: string) {
    let element = document.querySelector(`link[rel="${rel}"]`);

    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }

    element.setAttribute('href', href);
}

/**
 * Inject JSON-LD structured data into the page
 */
export function injectStructuredData(schema: object): () => void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema, null, 2);
    script.id = 'structured-data';

    // Remove existing structured data if present
    const existing = document.getElementById('structured-data');
    if (existing) {
        existing.remove();
    }

    document.head.appendChild(script);

    // Return cleanup function
    return () => {
        script.remove();
    };
}
