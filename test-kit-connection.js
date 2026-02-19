import 'dotenv/config'; // Load env vars if running with --env-file or similar, but we will pass them manually or rely on node's --env-file
// Or just hardcode for this test script to be 100% sure, then delete it. 
// Actually, safer to read from .env.local

import fs from 'fs';
import path from 'path';

// Manual env parsing since we might run this with 'node' directly and want to be sure
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

console.log('Testing Kit API Connection...');
console.log('API_KEY Length:', API_KEY ? API_KEY.length : 'MISSING');
console.log('API_SECRET Length:', API_SECRET ? API_SECRET.length : 'MISSING');

const testEndpoint = 'https://api.convertkit.com/v3/subscribers?api_secret=' + API_SECRET;

console.log('Fetching:', testEndpoint.replace(API_SECRET, 'REDACTED'));

try {
    const res = await fetch(testEndpoint);
    const data = await res.json();

    if (!res.ok) {
        console.error('FAILED:', res.status, res.statusText);
        console.error('Error Data:', JSON.stringify(data, null, 2));
    } else {
        console.log('SUCCESS!');
        console.log('Total Subscribers:', data.total_subscribers);
        console.log('Sample Data:', JSON.stringify(data.subscribers?.[0] || 'No subscribers', null, 2));
    }
} catch (error) {
    console.error('Network/Script Error:', error);
}
