
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extract = async () => {
    try {
        console.log("Fetching current articles from API...");
        const response = await fetch('http://localhost:3000/api/articles');
        const dbArticles = await response.json();
        const dbTitles = new Set(dbArticles.map(a => a.title.trim().toLowerCase()));

        // Path to backup
        const feb15Path = 'C:\\Users\\alexv\\Downloads\\greenshift-backup-2026-02-15T18-13-42.json';

        if (fs.existsSync(feb15Path)) {
            const raw = JSON.parse(fs.readFileSync(feb15Path, 'utf8'));
            const feb15Articles = (raw.articles || []).filter(a => a.title);

            // Filter for missing
            const missingArticles = feb15Articles.filter(a => !dbTitles.has(a.title.trim().toLowerCase()));

            console.log(`Found ${missingArticles.length} missing articles.`);

            // Save to file
            const outPath = path.join(__dirname, 'lost_articles.json');
            fs.writeFileSync(outPath, JSON.stringify(missingArticles, null, 2));
            console.log(`Saved missing articles to ${outPath}`);

            // Log sample
            if (missingArticles.length > 0) {
                console.log("Sample Missing Article Titles:");
                missingArticles.slice(0, 5).forEach(a => console.log(`- ${a.title}`));
            }
        } else {
            console.log("Backup file not found.");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
};

extract();
