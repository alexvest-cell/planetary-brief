import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './server/models/Article.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function cleanup() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const articles = await Article.find({});
        console.log(`Checking ${articles.length} articles...`);

        let updatedCount = 0;

        for (const article of articles) {
            let needsUpdate = false;

            // Trim ID and Slug
            if (article.id && article.id !== article.id.trim()) {
                console.log(`Trimming ID for: ${article.id}`);
                article.id = article.id.trim();
                needsUpdate = true;
            }

            if (article.slug && article.slug !== article.slug.trim()) {
                console.log(`Trimming Slug for: ${article.slug}`);
                article.slug = article.slug.trim();
                needsUpdate = true;
            }

            if (needsUpdate) {
                await article.save();
                updatedCount++;
            }
        }

        console.log(`Success: Cleanup complete. Updated ${updatedCount} articles.`);
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
}

cleanup();
