import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    // Fallback if .env.local isn't found
    dotenv.config();
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'PlanetaryBrief2026!';

async function login() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: ADMIN_PASSWORD })
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Login error:', error.message);
        process.exit(1);
    }
}

async function listDrafts() {
    console.log('🔐 Authenticating...');
    const token = await login();
    console.log('✅ Login successful.');

    console.log('📥 Fetching all articles (including drafts)...');
    try {
        const response = await fetch('http://localhost:3000/api/articles?includeUnpublished=true', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.statusText}`);
        }

        const articles = await response.json();
        const drafts = articles.filter(a => a.status !== 'published');

        console.log(`\nFound ${drafts.length} content items that are NOT published (Draft/Scheduled):`);
        console.log('===================================================');

        const draftsByCategory = {};

        drafts.forEach(a => {
            const cats = Array.isArray(a.category) ? a.category.join(', ') : a.category;
            console.log(`[${a.status?.toUpperCase() || 'DRAFT'}] ${a.title}`);
            console.log(`   Categories: ${cats}`);
            console.log(`   ID: ${a.id}`);
            console.log('---');

            // Count by new category to see impact
            if (Array.isArray(a.category)) {
                a.category.forEach(c => {
                    draftsByCategory[c] = (draftsByCategory[c] || 0) + 1;
                });
            }
        });

        console.log('\n📊 Drafts per Category (Potential Empty Pages):');
        Object.entries(draftsByCategory).forEach(([cat, count]) => {
            console.log(`- ${cat}: ${count} unpublished`);
        });

        // Fetch Public Articles to see what IS visible
        console.log('\n📥 Fetching public articles...');
        const publicResponse = await fetch('http://localhost:3000/api/articles');
        const publicArticles = await publicResponse.json();

        const publicByCategory = {};
        publicArticles.forEach(a => {
            if (Array.isArray(a.category)) {
                a.category.forEach(c => {
                    publicByCategory[c] = (publicByCategory[c] || 0) + 1;
                });
            } else if (typeof a.category === 'string') {
                publicByCategory[a.category] = (publicByCategory[a.category] || 0) + 1;
            }
        });

        console.log('\n✅ Public Articles per Category (Visible on Site):');
        Object.entries(publicByCategory).forEach(([cat, count]) => {
            console.log(`- ${cat}: ${count} articles`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

listDrafts();
