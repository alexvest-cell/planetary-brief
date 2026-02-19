// Category migration via API (requires local server running)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORY_MAPPING = {
    'Climate Change': 'Climate & Energy Systems',
    'Energy': 'Climate & Energy Systems',
    'Pollution': 'Planetary Health & Society',
    'Policy & Economics': 'Policy, Governance & Finance',
    'Oceans': 'Biodiversity & Oceans',
    'Biodiversity': 'Biodiversity & Oceans',
    'Conservation': 'Biodiversity & Oceans',
    'Solutions': 'Technology & Innovation'
};

function getAdminPassword() {
    try {
        const envPath = path.join(__dirname, '..', '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/ADMIN_PASSWORD=(.*)/);
            if (match) return match[1].trim();
        }
    } catch (e) {
        console.warn('⚠️ Could not read .env.local, using default password');
    }
    return 'changeme123';
}

async function login() {
    const password = getAdminPassword();
    console.log(`🔐 Attempting login with password: ${password.replace(/./g, '*')}`);

    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });

    if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
}

async function migrateViaAPI() {
    try {
        console.log('🔄 Starting category migration via API...\n');

        const token = await login();
        console.log('✅ Login successful, token received.\n');

        // Fetch all articles
        // Note: GET /api/articles might not need auth, or maybe it does? 
        // server.js doesn't show requireAuth for GET /api/articles usually, but let's see.
        // If it fails, we'll know.
        const response = await fetch('http://localhost:3000/api/articles');
        const articles = await response.json();

        console.log(`📊 Found ${articles.length} articles to process\n`);

        let migratedCount = 0;
        let draftedCount = 0;
        let unchangedCount = 0;
        const draftedArticles = [];

        for (const article of articles) {
            const oldCategories = Array.isArray(article.category)
                ? article.category
                : [article.category];

            // Map old categories to new ones
            const newCategories = [...new Set(
                oldCategories
                    .map(cat => CATEGORY_MAPPING[cat])
                    .filter(cat => cat !== undefined)
            )];

            if (newCategories.length === 0) {
                // Check if already migrated
                const isAlreadyNew = oldCategories.some(cat => Object.values(CATEGORY_MAPPING).includes(cat));
                if (isAlreadyNew) {
                    // Already correct
                } else {
                    console.log(`⚠️  No mapping for "${article.title}" [${oldCategories.join(', ')}]`);
                }
                unchangedCount++;
                continue;
            }

            let updateData = {};

            if (newCategories.length === 1) {
                // Single category - migrate normally
                updateData = {
                    ...article,
                    category: newCategories
                };
                console.log(`✅ Migrating: "${article.title}"`);
                console.log(`   ${oldCategories.join(', ')} → ${newCategories[0]}\n`);
                migratedCount++;
            } else {
                // Multiple categories - set to first one and mark as draft
                updateData = {
                    ...article,
                    category: [newCategories[0]],
                    status: 'draft'
                };

                draftedArticles.push({
                    title: article.title,
                    oldCategories: oldCategories,
                    possibleNew: newCategories
                });

                console.log(`📝 DRAFTED (multiple matches): "${article.title}"`);
                console.log(`   Old: ${oldCategories.join(', ')}`);
                console.log(`   Assigned to: ${newCategories[0]} (as draft)\n`);
                draftedCount++;
            }

            // Clean updateData (remove _id, __v, and created/updatedAt if we want server to handle them)
            // But we need to keep 'id' (custom ID) because we use it for LOOKUP in PUT /:id
            // But server logic uses finding by 'id'.
            // Mongoose might complain if we try to update immutable fields like _id.
            delete updateData._id;
            delete updateData.__v;
            // updateData.updatedAt = new Date(); // Server handles this

            // Update via API
            const updateRes = await fetch(`http://localhost:3000/api/articles/${article.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (!updateRes.ok) {
                console.error(`❌ Failed to update ${article.title}: ${updateRes.statusText}`);
                const err = await updateRes.text();
                console.error('Error details:', err);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 MIGRATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Migrated: ${migratedCount} articles`);
        console.log(`📝 Drafted (multi-category): ${draftedCount} articles`);
        console.log(`⚠️  Unchanged: ${unchangedCount} articles`);
        console.log(`📦 Total processed: ${articles.length}`);

        if (draftedArticles.length > 0) {
            console.log('\n' + '='.repeat(60));
            console.log('📝 ARTICLES MARKED AS DRAFT (need manual review)');
            console.log('='.repeat(60));
            draftedArticles.forEach((art, idx) => {
                console.log(`\n${idx + 1}. "${art.title}"`);
                console.log(`   Old categories: ${art.oldCategories.join(', ')}`);
                console.log(`   Could belong to: ${art.possibleNew.join(' OR ')}`);
            });
        }

        console.log('\n✅ Migration complete!\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateViaAPI();
