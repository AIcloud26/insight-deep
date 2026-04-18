// ads.js
window.closeAnchorAd = function() {
    const anchor = document.getElementById('bottomAnchorAd');
    anchor.classList.add('closed');
    localStorage.setItem('anchorClosed', 'true');
};

// Check if user previously closed anchor
if (localStorage.getItem('anchorClosed') === 'true') {
    document.getElementById('bottomAnchorAd')?.classList.add('closed');
}

// Insert in-article ad into article content (after second paragraph)
export function injectInArticleAd(contentHtml) {
    const adCode = `<div class="ad-container my-6"><div class="ad-label">Sponsored</div><ins class="adsbygoogle" style="display:block; text-align:center;" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="IN_ARTICLE_SLOT"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script></div>`;
    const parts = contentHtml.split('</p>');
    if (parts.length >= 3) {
        parts.splice(2, 0, adCode);
        return parts.join('</p>');
    }
    return contentHtml + adCode;
}

// Top banner is already in the HTML (can be dynamically refreshed)
export function refreshTopBanner() {
    if (typeof adsbygoogle !== 'undefined') {
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
}

// Native ad unit (to be inserted between cards)
export function createNativeAdCard() {
    return `<div class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 p-4 text-center">
                <div class="ad-label text-xs">Advertisement</div>
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-format="rectangle"
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot="NATIVE_AD_SLOT"></ins>
                <script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script>
            </div>`;
}
