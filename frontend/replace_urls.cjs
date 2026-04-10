const fs = require('fs');
const path = require('path');

const files = [
    'frontend/pages/admin/Products.jsx',
    'frontend/pages/admin/Promotions.jsx',
    'frontend/pages/admin/Requests.jsx',
    'frontend/pages/admin/Subscriptions.jsx',
    'frontend/pages/DesignDetails.jsx',
    'frontend/pages/workshop/CustomRequests.jsx',
    'frontend/pages/WorkshopLeads.jsx',
    'frontend/pages/workshop/MyDesigns.jsx',
    'frontend/pages/workshop/Requests.jsx'
];

files.forEach(f => {
    const filePath = path.join('d:/html/project1/furniture-market', f);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        content = content.replace(/http:\/\/localhost:3000/g, "${API_URL.replace('/api', '')}");
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Replaced in: ' + f);
    }
});
