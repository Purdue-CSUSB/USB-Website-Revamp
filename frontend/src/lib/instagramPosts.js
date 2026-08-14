/**
 * Loads the Instagram carousel data.
 *
 * Order of preference:
 *   1. localStorage, read synchronously so a returning visitor paints on frame 1
 *   2. /api/instagram/posts  - MongoDB via Vercel, refreshed nightly by the
 *      GitHub Action in .github/workflows/instagram-sync.yml
 *   3. /Instagram Posts/insta_posts.json - the checked-in copy, so the section
 *      still renders if Atlas or the function is down
 */
const API_ENDPOINT = '/api/instagram/posts';
const STATIC_FALLBACK = '/Instagram Posts/insta_posts.json';
const CACHE_KEY = 'usb:ig:posts:v2';
const CACHE_TTL_MS = 30 * 60 * 1000;

/** Accepts API rows, the checked-in JSON, and older GitHub Pages-era paths. */
function normalizeUrl(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  let url = raw.trim();
  if (url.startsWith('//')) url = `https:${url}`;
  if (/^http:/i.test(url)) url = url.replace(/^http:/i, 'https:');
  if (/^https?:/i.test(url)) return url;
  // Left over from when the site was served under a project subpath.
  if (url.startsWith('/USB-Website-Revamp/')) url = url.slice('/USB-Website-Revamp'.length);
  return url.startsWith('/') ? url : `/${url}`;
}

const normalize = (post) => ({
  id: post?.id ?? post?.shortcode ?? post?.permalink ?? '',
  caption: post?.caption ?? '',
  timestamp: post?.timestamp ?? null,
  permalink: post?.permalink ?? null,
  imageUrl: normalizeUrl(post?.imageUrl ?? post?.media_url ?? post?.thumbnail_url),
  width: post?.width ?? null,
  height: post?.height ?? null,
  eventTitle: post?.eventTitle ?? null,
  eventDate: post?.eventDate ?? null,
});

const usable = (posts, limit) =>
  (Array.isArray(posts) ? posts : []).map(normalize).filter((p) => p.imageUrl).slice(0, limit);

export function readCachedPosts() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry?.expiresAt || Date.now() > entry.expiresAt) return null;
    return Array.isArray(entry.value) && entry.value.length ? entry.value : null;
  } catch {
    return null;
  }
}

function writeCache(posts) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ value: posts, expiresAt: Date.now() + CACHE_TTL_MS }));
  } catch {
    // Private mode or quota exceeded - the network path still works.
  }
}

async function fetchJson(url, signal) {
  const res = await fetch(url, { signal, credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchInstagramPosts({ limit = 6, signal } = {}) {
  try {
    const data = await fetchJson(API_ENDPOINT, signal);
    const posts = usable(data?.posts, limit);
    if (posts.length) {
      writeCache(posts);
      return { posts, source: 'api' };
    }
    throw new Error('API returned no usable posts');
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    console.warn('[instagram] API unavailable, using bundled posts:', err.message);
  }

  const data = await fetchJson(STATIC_FALLBACK, signal);
  const posts = usable(data, limit);
  if (posts.length) writeCache(posts);
  return { posts, source: 'static' };
}
