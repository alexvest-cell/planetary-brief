
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compare = async () => {
    try {
        console.log("Fetching current articles from API...");
        const response = await fetch('http://localhost:3000/api/articles');
        const dbArticles = await response.json();

        console.log(`\n--- CURRENT API CONTENT (${dbArticles.length}) ---`);
        dbArticles.slice(0, 5).forEach(a => console.log(`[API] ${a.title} (${a.source || 'No Source'})`));

        // 2. Get Feb 15 Backup
        const feb15Path = 'C:\\Users\\alexv\\Downloads\\greenshift-backup-2026-02-15T18-13-42.json';
        if (fs.existsSync(feb15Path)) {
            const raw = JSON.parse(fs.readFileSync(feb15Path, 'utf8'));
            const feb15Articles = (raw.articles || []).filter(a => a.title); // Ensure title exists

            console.log(`\n--- FEB 15 BACKUP CONTENT (${feb15Articles.length}) ---`);
            feb15Articles.slice(0, 5).forEach(a => console.log(`[FEB15] ${a.title}`));

            // Find diff
            const dbTitles = new Set(dbArticles.map(a => a.title.trim().toLowerCase()));
            const uniqueToFeb15 = feb15Articles.filter(a => !dbTitles.has(a.title.trim().toLowerCase()));

            console.log(`\n--- ARTICLES IN FEB 15 BUT NOT IN API (${uniqueToFeb15.length}) ---`);
            uniqueToFeb15.forEach(a => console.log(`[MISSING] ${a.title}`));

        } else {
            console.log("Feb 15 backup not found.");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
};

compare();
