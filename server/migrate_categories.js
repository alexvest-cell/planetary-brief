import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Category mapping: old category -> new category
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

const NEW_CATEGORIES = [
    'Climate & Energy Systems',
    'Planetary Health & Society',
    'Policy, Governance & Finance',
    'Biodiversity & Oceans',
    'Technology & Innovation'
];

// Article schema (minimal definition for migration)
const articleSchema = new mongoose.Schema({
    id: String,
    title: String,
    category: mongoose.Schema.Types.Mixed,
    status: String
}, { strict: false });

const Article = mongoose.model('Article', articleSchema);

async function migrateCategories() {
    try {
        console.log('🔄 Starting category migration...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all articles
        const articles = await Article.find({});
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
                // No mapping found - leave unchanged
                console.log(`⚠️  No mapping for "${article.title}" (${oldCategories.join(', ')})`);
                unchangedCount++;
                continue;
            }

            if (newCategories.length === 1) {
                // Single category - migrate normally
                article.category = newCategories;
                await article.save();
                console.log(`✅ Migrated: "${article.title}"`);
                console.log(`   ${oldCategories.join(', ')} → ${newCategories[0]}\n`);
                migratedCount++;
            } else {
                // Multiple categories - set to first one and mark as draft
                article.category = [newCategories[0]];
                article.status = 'draft';
                await article.save();

                draftedArticles.push({
                    title: article.title,
                    oldCategories: oldCategories,
                    possibleNew: newCategories
                });

                console.log(`📝 DRAFTED (multiple matches): "${article.title}"`);
                console.log(`   Old: ${oldCategories.join(', ')}`);
                console.log(`   Possible: ${newCategories.join(', ')}`);
                console.log(`   Assigned to: ${newCategories[0]} (as draft)\n`);
                draftedCount++;
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

        console.log('\n' + '='.repeat(60));
        console.log('📋 NEW CATEGORY STRUCTURE');
        console.log('='.repeat(60));
        for (const cat of NEW_CATEGORIES) {
            const count = await Article.countDocuments({ category: cat });
            console.log(`${cat}: ${count} articles`);
        }

        await mongoose.disconnect();
        console.log('\n✅ Migration complete!\n');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

migrateCategories();
