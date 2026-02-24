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

async function deletePlaceholders() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('MONGODB_URI not found in .env.local');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected.');

        const filter = { id: { $regex: /^placeholder-/ } };

        console.log('Counting placeholder articles to be deleted...');
        const count = await Article.countDocuments(filter);
        console.log(`Target: ${count} articles.`);

        if (count === 0) {
            console.log('No placeholder articles found to delete.');
            return;
        }

        console.log('Deleting articles...');
        const result = await Article.deleteMany(filter);
        console.log(`Successfully deleted ${result.deletedCount} placeholder articles.`);

    } catch (error) {
        console.error('Error during deletion:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

deletePlaceholders();
