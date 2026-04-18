// utils.js
const CATEGORY_IMAGES = {
    technology: 'technology-computer',
    finance: 'finance-stock-market',
    'ai-tools': 'artificial-intelligence',
    health: 'health-fitness'
};

export function getImageUrl(post) {
    if (post.image && post.image.trim() !== '') return post.image;
    const keyword = CATEGORY_IMAGES[post.category] || 'news';
    return `https://source.unsplash.com/featured/600x400?${keyword}&sig=${post.slug}`;
}

export function updateMeta(title, description) {
    document.title = title + ' | InsightHub';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    else {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = description;
        document.head.appendChild(metaDesc);
    }
}
