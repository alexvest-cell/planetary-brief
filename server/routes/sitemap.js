import express from 'express';
import Article from '../models/Article.js';

const router = express.Router();

// Cache sitemap for 1 hour to reduce DB load
let cachedSitemap = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Generate XML sitemap dynamically from published articles
 * Accessible at /sitemap.xml
 */
router.get('/sitemap.xml', async (req, res) => {
    try {
        // Check if cache is valid
        const now = Date.now();
        if (cachedSitemap && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
            console.log('Serving cached sitemap');
            res.header('Content-Type', 'application/xml');
            return res.send(cachedSitemap);
        }

        // Fetch all published articles
        const articles = await Article.find({
            $or: [
                { status: 'published' },
                { status: 'scheduled', scheduledPublishDate: { $lte: new Date() } },
                { status: { $exists: false } } // Backward compatibility
            ]
        }).select('slug id updatedAt createdAt').sort({ updatedAt: -1 });

        // Build XML sitemap
        const baseUrl = 'https://planetarybrief.com';
        const urls = [];

        // Add homepage
        urls.push({
            loc: baseUrl,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'daily',
            priority: '1.0'
        });

        // Add static pages
        urls.push({
            loc: `${baseUrl}/dashboard`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.8'
        });

        urls.push({
            loc: `${baseUrl}/about`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.7'
        });

        urls.push({
            loc: `${baseUrl}/guides`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.8'
        });

        // Add article pages
        articles.forEach(article => {
            const slug = article.slug || article.id;
            const lastmod = article.updatedAt || article.createdAt || new Date();

            urls.push({
                loc: `${baseUrl}/article/${slug}`,
                lastmod: new Date(lastmod).toISOString().split('T')[0],
                changefreq: 'weekly',
                priority: '0.9'
            });
        });

        // Generate XML
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        // Cache the result
        cachedSitemap = xml;
        cacheTimestamp = now;

        console.log(`Generated sitemap with ${urls.length} URLs (${articles.length} articles)`);

        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
});

export default router;
