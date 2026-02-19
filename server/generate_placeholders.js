
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_MAP = {
    "Climate & Energy Systems": ["Decarbonization", "Renewable Energy", "Extreme Weather", "Carbon Markets", "Methane"],
    "Planetary Health & Society": ["Air Quality", "Water Security", "Environmental Justice", "Urban Resilience", "Plastic Pollution"],
    "Policy, Governance & Finance": ["ESG & Reporting", "Global Treaties", "Green Finance", "Carbon Pricing", "Corporate Strategy"],
    "Biodiversity & Oceans": ["Marine Protected Areas", "Species Conservation", "Forests & Land Use", "Blue Economy", "Rewilding"],
    "Science & Data": ["Climate Modeling", "Remote Sensing", "Methodology", "Academic Research", "Data Visualization"],
    "Technology & Innovation": ["Carbon Capture", "Circular Economy", "AgriTech", "Clean Mobility", "Materials Science"]
};

// Also keep simple array for iteration if needed, or iterate keys
const CATEGORIES = Object.keys(CATEGORIES_MAP);

const IMAGES = {
    "Climate & Energy Systems": "https://placehold.co/1200x800/ef4444/ffffff?text=Energy",
    "Planetary Health & Society": "https://placehold.co/1200x800/8b5cf6/ffffff?text=Health",
    "Policy, Governance & Finance": "https://placehold.co/1200x800/3b82f6/ffffff?text=Policy",
    "Biodiversity & Oceans": "https://placehold.co/1200x800/06b6d4/ffffff?text=Oceans",
    "Science & Data": "https://placehold.co/1200x800/f59e0b/ffffff?text=Science",
    "Technology & Innovation": "https://placehold.co/1200x800/10b981/ffffff?text=Tech"
};

const generateArticles = () => {
    const articles = [];

    CATEGORIES.forEach(cat => {
        const subCats = CATEGORIES_MAP[cat];
        for (let i = 1; i <= 15; i++) {
            const cleanCat = cat.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const id = `placeholder-${cleanCat}-${i}`;
            const isFeatured = i === 1; // First one is featured in category
            const subTopic = subCats[(i - 1) % subCats.length]; // Cycle through sub-cats

            articles.push({
                id: id,
                title: `${subTopic}: Key Developments in ${cat} (Article ${i})`,
                excerpt: `Latest analysis on ${subTopic}. This is a placeholder excerpt for article ${i} in ${cat}. It demonstrates the typography and layout spacing.`,
                content: [
                    `Focusing on ${subTopic}, this article explores the implications for global environmental systems.`,
                    "## Key Findings",
                    "The data suggests a critical turning point...",
                    "//“The shift in policy regarding " + subTopic + " is unprecedented.”//",
                    "Final paragraph of the placeholder content."
                ],
                category: cat,
                topic: subTopic,
                keywords: [subTopic, "Environment", "Global", cat],
                date: "Feb 15, 2026",
                originalReadTime: `${3 + (i % 5)} min read`,
                imageUrl: IMAGES[cat] + `+${i}`,
                source: "Design Demo",
                isFeaturedCategory: isFeatured,
                isFeaturedDiscover: i <= 3, // Top 3 might appear in discover
                status: "published"
            });
        }
    });

    // Special Hero Article
    articles.push({
        id: "hero-demo-1",
        title: "GLOBAL HERO: Major Environmental Shift Observed",
        excerpt: "This is the main hero article for the design demo. It should have the most prominent placement and a high-impact image.",
        content: ["Main hero content..."],
        category: "Climate & Energy Systems", // or varied
        date: "Feb 15, 2026",
        imageUrl: "https://placehold.co/1600x900/1a1a1a/ffffff?text=HERO+IMAGE",
        isFeaturedCategory: true,
        source: "GreenShift Exclusive"
    });

    return articles;
};

const data = generateArticles();
const fileContent = `const seedArticles = ${JSON.stringify(data, null, 2)};\n\nexport default seedArticles;`;

fs.writeFileSync(path.join(__dirname, 'seed_data.js'), fileContent);
console.log(`Generated ${data.length} placeholder articles and overwrote seed_data.js`);
