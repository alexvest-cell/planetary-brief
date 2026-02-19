
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Schema
const articleSchema = new mongoose.Schema({}, { strict: false });
const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);

const restore = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const lostPath = path.join(__dirname, 'lost_articles.json');
        if (!fs.existsSync(lostPath)) {
            console.error("lost_articles.json not found!");
            process.exit(1);
        }

        const articles = JSON.parse(fs.readFileSync(lostPath, 'utf8'));
        console.log(`Loaded ${articles.length} articles to restore.`);

        // Clean up data before insert
        const cleanArticles = articles.map(a => {
            const clean = { ...a };
            delete clean._id; // Let Mongo generate new ID or use existing string if it's custom
            if (a.id) clean.id = a.id; // Keep the custom ID string
            return clean;
        });

        // Upsert logic (update if exists, insert if new)
        for (const article of cleanArticles) {
            await Article.updateOne(
                { id: article.id }, // Match by custom ID
                { $set: article },
                { upsert: true }
            );
            console.log(`Restored/Updated: ${article.title} (${article.id})`);
        }

        console.log("\nRestoration of specific user content complete.");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
};

restore();
