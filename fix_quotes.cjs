const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;

    // Fix mismatched quotes: `${API_URL}/something' -> `${API_URL}/something`
    // And also for "" if any: `${API_URL}/something" -> `${API_URL}/something`

    // We use a regex that matches `${API_URL}` followed by any characters until a single or double quote.
    // Be careful not to replace legitimate quotes.
    // A safer regex: \$\{API_URL\}[^'`"]*['"]

    content = content.replace(/`\$\{API_URL\}([^'`"]*)['"]/g, "`\$\{API_URL\}$1`");

    if (orig !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed quotes in: ${filePath}`);
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

console.log('Starting quote fix...');
traverseDir(frontendDir);
console.log('Finished.');
