
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, 'server/server.js');
let content = fs.readFileSync(serverPath, 'utf8');

// The replacement - Update to force reset for placeholders
// We look for the previous threshold block we added
const oldStr = "if (count < 110) {";
const newStr = "if (true) { // FORCE RESET FOR DESIGN DEMO";

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(serverPath, content);
    console.log("Successfully updated server.js to force reset.");
} else {
    console.log("Could not find exact string to replace. Checking if already updated...");
    if (content.includes("FORCE RESET")) {
        console.log("Already updated.");
    } else {
        console.log("Pattern not found!");
    }
}
