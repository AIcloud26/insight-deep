// sitemap-generator.js (run with Node)
const fs = require('fs');
const path = require('path');

const posts = require('./data/posts.json').posts;
const baseUrl = 'https://YOURDOMAIN.github.io/insight-hub';

const urls = [
    { loc: '/', priority: 1.0 },
    ...['technology', 'finance', 'ai-tools', 'health'].map(cat => ({ loc: `/category/${cat}`, priority: 0.8 })),
    ...posts.map(post => ({ loc: `/posts/${post.slug}.html`, priority: 0.9 }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${baseUrl}${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log('✅ sitemap.xml generated');
