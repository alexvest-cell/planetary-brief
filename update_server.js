
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, 'server/server.js');
let content = fs.readFileSync(serverPath, 'utf8');

// The replacement
const oldStr = "if (count < 80) {";
const newStr = "if (count < 110) {";

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(serverPath, content);
    console.log("Successfully updated server.js threshold.");
} else {
    console.log("Could not find exact string to replace. Checking if already updated...");
    if (content.includes("if (count < 110) {")) {
        console.log("Already updated.");
    } else {
        console.log("Pattern not found!");
        // Log the area to see what it is
        const idx = content.indexOf("const seedDatabase");
        if (idx !== -1) {
            console.log(content.substring(idx, idx + 300));
        }
    }
}
