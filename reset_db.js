import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Fix DNS resolution issues on Windows (same as server.js)
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

// Define simple Article schema just for deletion
const articleSchema = new mongoose.Schema({}, { strict: false });
const Article = mongoose.model('Article', articleSchema);

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Count before
        const count = await Article.countDocuments();
        console.log(`Found ${count} articles.`);

        // Delete all
        const res = await Article.deleteMany({});
        console.log(`Deleted ${res.deletedCount} articles.`);

        mongoose.connection.close();
        console.log('Database cleared. Restart server to re-seed with correct IDs.');
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
