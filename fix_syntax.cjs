const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    let orig = content;

    // Fix the syntax error: import.meta.env.VITE_API_URL || `${API_URL}';
    content = content.replace(/const API_URL = import\.meta\.env\.VITE_API_URL \|\| `\$\{API_URL\}';/g, "const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';");

    if (orig !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed syntax in: ${filePath}`);
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

console.log('Starting syntax fix...');
traverseDir(frontendDir);
console.log('Finished.');
