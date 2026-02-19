import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Manual env parsing
const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const API_KEY = envVars.KIT_API_KEY;
const API_SECRET = envVars.KIT_API_SECRET; // Not strictly needed for creating tags usually, but good to have context

const TAGS_TO_CREATE = [
    'Climate & Energy Systems',
    'Biodiversity & Oceans',
    'Policy, Governance & Finance',
    'Science & Data',
    'Technology & Innovation',
    'Planetary Health & Society'
];

const createTag = async (tagName) => {
    const url = 'https://api.convertkit.com/v3/tags';
    const body = {
        api_secret: API_SECRET,
        tag: { name: tagName }
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) {
            console.error(`Failed to create "${tagName}":`, data);
            return null;
        }
        return data.tag;
    } catch (e) {
        console.error(`Error creating "${tagName}":`, e);
        return null;
    }
};

console.log('Creating Tags in Kit...');

const results = {};

for (const tag of TAGS_TO_CREATE) {
    process.stdout.write(`Creating: ${tag}... `);
    const result = await createTag(tag);
    if (result) {
        console.log(`DONE (ID: ${result.id})`);
        results[tag] = result.id;
    } else {
        console.log('FAILED');
    }
    // Small delay to be nice to API
    await new Promise(r => setTimeout(r, 500));
}

console.log('\n--- EXTRACTED CONFIG ---');
console.log('// Copy this into data/kitConfig.ts');
console.log('export const KIT_CONFIG = {');
console.log('    FORM_ID: \'YOUR_FORM_ID\',');
console.log('    TAGS: {');
for (const [name, id] of Object.entries(results)) {
    console.log(`        '${name}': '${id}',`);
}
console.log('    }');
console.log('};');
