const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Quick and dirty regex to replace fetch('http://localhost:3000/api/...') 
    // Need to make sure we inject API_URL if not present
    let orig = content;

    // Pattern for template literals: fetch(`http://localhost:3000/api/...`)
    content = content.replace(/fetch\(`http:\/\/localhost:3000\/api(.*?)`\)/g, "fetch(`${API_URL}$1`)");

    // Pattern for strings: fetch('http://localhost:3000/api/...')
    content = content.replace(/fetch\('http:\/\/localhost:3000\/api(.*?)'\)/g, "fetch(`${API_URL}$1`)");

    // Pattern for URLs passed as variables
    content = content.replace(/'http:\/\/localhost:3000\/api(.*?)/g, "`${API_URL}$1");
    content = content.replace(/`http:\/\/localhost:3000\/api(.*?)/g, "`${API_URL}$1");

    if (orig !== content) {
        // If we replaced something, ensure API_URL is defined if it's missing (import.meta.env...)
        if (!content.includes('const API_URL =')) {
            // Find a good place to inject it - usually right after imports
            const importMatch = content.match(/import .*?;?\n+(?!import )/);
            if (importMatch) {
                const insertPos = importMatch.index + importMatch[0].length;
                const declareStr = "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';\n";
                content = content.slice(0, insertPos) + declareStr + content.slice(insertPos);
            } else {
                // Just put it at the top
                const declareStr = "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';\n";
                content = declareStr + content;
            }
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist') {
                traverseDir(fullPath);
            }
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

console.log('Starting global replace...');
traverseDir(frontendDir);
console.log('Finished.');
