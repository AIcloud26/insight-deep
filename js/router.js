// main.js
let postsData = [];
let currentPage = 1;
let isLoading = false;
let currentViewType = 'home';
let currentCategory = null;
let allPosts = [];

// Fetch posts from JSON
async function loadPosts() {
    const res = await fetch('data/posts.json');
    const data = await res.json();
    allPosts = data.posts;
    return allPosts;
}

// Render card grid with native ads every 5 posts
function renderCards(posts, startIndex = 0, append = false) {
    const container = document.getElementById('app');
    let html = '';
    const postsToRender = posts.slice(0, currentPage * 12);
    for (let i = 0; i < postsToRender.length; i++) {
        const post = postsToRender[i];
        const imgUrl = getImageUrl(post);
        html += `
            <a href="/posts/${post.slug}.html" class="block group">
                <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <img src="${imgUrl}" class="card-img w-full" loading="lazy" alt="${post.title}">
                    <div class="p-5">
                        <span class="text-xs uppercase font-semibold text-rose-500">${post.category}</span>
                        <h3 class="text-xl font-bold mt-1 group-hover:text-rose-600 transition">${post.title}</h3>
                        <p class="text-gray-500 mt-2 text-sm line-clamp-2">${post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                    </div>
                </div>
            </a>
        `;
        // Insert native ad after every 5 posts (but not at the end)
        if ((i + 1) % 5 === 0 && (i + 1) !== postsToRender.length) {
            html += createNativeAdCard();
        }
    }
    if (!append) container.innerHTML = html;
    else container.insertAdjacentHTML('beforeend', html);
    
    // Refresh Google Ads after new content
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
}

// Infinite scroll (Load More button)
function addLoadMoreButton(posts, container) {
    const totalPosts = posts.length;
    const loadedCount = currentPage * 12;
    if (loadedCount >= totalPosts) return;
    
    const btnHtml = `<div class="col-span-full flex justify-center mt-8">
                        <button id="loadMoreBtn" class="load-more-btn bg-white border border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition">Load More Articles <i class="fas fa-arrow-down ml-2"></i></button>
                    </div>`;
    container.insertAdjacentHTML('beforeend', btnHtml);
    document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
        currentPage++;
        renderCards(posts, 0, true);
        // Remove button and re-add if needed
        document.getElementById('loadMoreBtn')?.remove();
        addLoadMoreButton(posts, document.getElementById('app'));
    });
}

// Homepage with hero + featured
window.app = {
    async loadHome() {
        currentViewType = 'home';
        currentCategory = null;
        currentPage = 1;
        const posts = await loadPosts();
        // Featured hero (first 3 posts)
        const heroPosts = posts.slice(0, 3);
        const heroHtml = `
            <div class="grid md:grid-cols-3 gap-6 mb-12">
                ${heroPosts.map(post => `
                    <div class="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer" onclick="window.location.href='/posts/${post.slug}.html'">
                        <img src="${getImageUrl(post)}" class="w-full h-64 object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                            <h2 class="text-white text-xl font-bold">${post.title}</h2>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="cardsGrid"></div>
        `;
        document.getElementById('app').innerHTML = heroHtml;
        const gridContainer = document.getElementById('cardsGrid');
        // Render rest of posts
        const restPosts = posts.slice(3);
        renderCards(restPosts, 0, false, gridContainer);
        addLoadMoreButton(restPosts, document.getElementById('app'));
        updateMeta('InsightHub - Smart Content Feed', 'Discover the latest in Tech, Finance, AI & Health');
    },
    
    async loadCategory(category) {
        currentViewType = 'category';
        currentCategory = category;
        currentPage = 1;
        const posts = await loadPosts();
        const filtered = posts.filter(p => p.category === category);
        document.getElementById('app').innerHTML = `
            <h1 class="text-3xl font-bold capitalize mb-2">${category.replace('-', ' ')}</h1>
            <p class="text-gray-500 mb-8">Latest insights and trends</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="categoryGrid"></div>
        `;
        const container = document.getElementById('categoryGrid');
        renderCards(filtered, 0, false, container);
        addLoadMoreButton(filtered, document.getElementById('app'));
        updateMeta(`${category} | InsightHub`, `Read expert articles on ${category}`);
    },
    
    async loadArticle(slug) {
        const posts = await loadPosts();
        const post = posts.find(p => p.slug === slug);
        if (!post) {
            document.getElementById('app').innerHTML = '<div class="text-center py-20">Article not found</div>';
            return;
        }
        let contentWithAds = injectInArticleAd(post.content);
        const imgUrl = getImageUrl(post);
        const html = `
            <article class="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8">
                <img src="${imgUrl}" class="w-full rounded-xl mb-6" alt="${post.title}">
                <h1 class="text-3xl md:text-4xl font-extrabold mb-3">${post.title}</h1>
                <div class="flex items-center gap-3 text-gray-500 text-sm mb-8">
                    <span class="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs uppercase">${post.category}</span>
                    <span><i class="far fa-calendar-alt mr-1"></i> ${new Date().toLocaleDateString()}</span>
                </div>
                <div class="prose prose-lg max-w-none">
                    ${contentWithAds}
                </div>
                <div class="mt-8 pt-6 border-t text-center">
                    <a href="/" class="text-rose-600 hover:underline">← Back to Home</a>
                </div>
            </article>
            <!-- Top banner refresh -->
            <div class="ad-container mt-8">
                <div class="ad-label">Advertisement</div>
                <ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="TOP_BANNER_SLOT"></ins>
                <script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script>
            </div>
        `;
        document.getElementById('app').innerHTML = html;
        updateMeta(post.title, post.content.replace(/<[^>]*>/g, '').substring(0, 160));
        // Trigger in-article ads again
        if (typeof adsbygoogle !== 'undefined') (adsbygoogle = window.adsbygoogle || []).push({});
    }
};

// Expose necessary functions
window.getImageUrl = getImageUrl;
window.createNativeAdCard = createNativeAdCard;
window.injectInArticleAd = injectInArticleAd;
