import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import Article from './server/models/Article.js';

// Fix DNS resolution issues on Windows
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function listPlaceholders() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('MONGODB_URI not found in .env.local');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected.');

        console.log('Searching for articles missing "subheadline"...');
        const placeholders = await Article.find({
            $or: [
                { subheadline: { $exists: false } },
                { subheadline: '' },
                { subheadline: null }
            ]
        }).select('title id slug');

        console.log(`\nFound ${placeholders.length} articles without a subheadline:\n`);

        placeholders.forEach((art, index) => {
            console.log(`${index + 1}. Title: "${art.title}"`);
            console.log(`   ID: ${art.id}`);
            console.log(`   Slug: ${art.slug || 'N/A'}`);
            console.log('---');
        });

        if (placeholders.length === 0) {
            console.log('No placeholder articles found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB.');
    }
}

listPlaceholders();
