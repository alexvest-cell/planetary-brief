
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Schema (Simplified for restoration)
const articleSchema = new mongoose.Schema({}, { strict: false });
// Check if model exists, otherwise create
const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);

// Category Mapping (Old -> New 6 Pillars)
const categoryMap = {
    'Pollution': 'Planetary Health & Society',
    'Science': 'Earth System Boundaries', // Default for generic science
    'Climate Change': 'Climate & Energy Systems',
    'Energy': 'Climate & Energy Systems',
    'Policy': 'Planetary Health & Society',
    'Policy & Economics': 'Economy & Finance',
    'Economy': 'Economy & Finance',
    'Innovation': 'Tech & AI for Climate',
    'Action': 'Planetary Health & Society',
    'Oceans': 'Biodiversity & Oceans',
    'Biodiversity': 'Biodiversity & Oceans',
    'Conservation': 'Biodiversity & Oceans',
    'Solutions': 'Tech & AI for Climate'
};

const mapCategory = (oldCat) => {
    let cat = oldCat;
    if (Array.isArray(cat)) cat = cat[0]; // Take first if array

    return categoryMap[cat] || cat || 'Uncategorized';
};

const restore = async () => {
    try {
        console.log('Connecting to MongoDB...');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env.local');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // 1. Read Clean Articles (Silver - 80 count)
        const cleanPath = path.join(__dirname, 'temp_out/data/articles_clean.json');
        let cleanArticles = [];
        if (fs.existsSync(cleanPath)) {
            try {
                cleanArticles = JSON.parse(fs.readFileSync(cleanPath, 'utf8'));
                console.log(`Found ${cleanArticles.length} Clean/Silver articles (from content.ts).`);
            } catch (err) {
                console.error('Error parsing clean articles:', err.message);
            }
        } else {
            console.log('Warning: Clean articles file not found at', cleanPath);
        }

        // 2. Read Jan 28 Backup (Gold - 5 count)
        // Parent dir path relative to script location
        const goldPathRelative = path.join(__dirname, '../greenshift-backup-2026-01-28T09-19-09.json');
        const goldPathLocal = path.join(__dirname, 'greenshift-backup-2026-01-28T09-19-09.json');

        let goldArticles = [];
        let goldSource = null;

        if (fs.existsSync(goldPathRelative)) {
            goldSource = goldPathRelative;
        } else if (fs.existsSync(goldPathLocal)) {
            goldSource = goldPathLocal;
        }

        if (goldSource) {
            try {
                const rawGold = JSON.parse(fs.readFileSync(goldSource, 'utf8'));
                goldArticles = rawGold.articles || [];
                console.log(`Found ${goldArticles.length} Gold articles (Jan 28).`);
            } catch (err) {
                console.error('Error parsing gold articles:', err.message);
            }
        } else {
            console.log('Warning: Gold backup file not found.');
        }

        // 3. Process & Merge
        const finalArticles = [];
        const seenIds = new Set();
        const seenTitles = new Set();

        // Process Gold first (Priority)
        for (const art of goldArticles) {
            if (!art.id) art.id = 'gen-' + Date.now() + Math.random();
            if (seenIds.has(art.id)) continue;

            // Normalize title for dupe check
            const titleKey = (art.title || '').toLowerCase().trim();
            if (seenTitles.has(titleKey)) continue;

            // Map category
            art.category = mapCategory(art.category);
            art.source = 'GreenShift Original (restored)';

            seenIds.add(art.id);
            seenTitles.add(titleKey);
            finalArticles.push(art);
        }

        // Process Silver
        for (const art of cleanArticles) {
            if (!art.id) continue;
            if (seenIds.has(art.id)) continue;

            // Normalize title for dupe check
            const titleKey = (art.title || '').toLowerCase().trim();
            if (seenTitles.has(titleKey)) continue;

            // Map category
            art.category = mapCategory(art.category);

            seenIds.add(art.id);
            seenTitles.add(titleKey);
            finalArticles.push(art);
        }

        console.log(`Total unique articles to restore: ${finalArticles.length}`);

        if (finalArticles.length === 0) {
            console.log('No articles to restore.');
            process.exit(0);
        }

        // 4. Insert
        await Article.deleteMany({});
        console.log('Cleared existing database.');

        await Article.insertMany(finalArticles, { ordered: false });
        console.log(`Successfully restored articles.`);

        process.exit(0);

    } catch (error) {
        console.error('Restoration failed:', error);
        process.exit(1);
    }
};

restore();
