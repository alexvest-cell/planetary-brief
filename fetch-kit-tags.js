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
const API_SECRET = envVars.KIT_API_SECRET;

const url = 'https://api.convertkit.com/v3/tags?api_secret=' + API_SECRET;

console.log('Fetching Tags from Kit...');

try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        console.error('Error:', data);
    } else {
        console.log('\n--- AVAILABLE TAGS ---');
        if (data.tags.length === 0) {
            console.log('No tags found in your Kit account.');
            console.log('You need to create tags in Kit (Grow > Subscribers > + Create a Tag) for each category.');
        } else {
            console.table(data.tags.map(t => ({ ID: t.id, Name: t.name })));
            console.log('\nCopy these IDs into data/kitConfig.ts');
        }
    }
} catch (err) {
    console.error(err);
}
