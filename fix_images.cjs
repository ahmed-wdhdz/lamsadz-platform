const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Expected matches: `${API_URL.replace('/api', '')}/uploads/${img}`
            // We want to replace it with: (String(img).startsWith('http') ? img : `${API_URL.replace('/api', '')}/uploads/${img}`)
            
            const regex = /`\$\{API_URL\.replace\('\/api',\s*''\)\}\/uploads\/\$\{([^}]+)\}`/g;
            let changed = false;
            let newContent = content.replace(regex, (match, inner) => {
                changed = true;
                return `(String(${inner}).startsWith('http') ? ${inner} : \`\${API_URL.replace('/api', '')}/uploads/\${${inner}}\`)`;
            });
            
            if (changed) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Fixed:', fullPath);
            }
        }
    }
}
processDir(path.join(__dirname, 'frontend/pages'));
