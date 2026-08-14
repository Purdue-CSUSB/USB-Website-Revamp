import { getCollections } from '../_lib/mongo.js';
import { notModified, rejectNonGet, sendJson } from '../_lib/http.js';

// The sync job runs once a day, so the edge can hold this for an hour and keep
// serving the stale copy for a day while it revalidates in the background.
const CACHE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';

export default async function handler(req, res) {
  if (rejectNonGet(req, res)) return;

  try {
    const { posts, meta } = await getCollections();

    const [docs, state] = await Promise.all([
      posts
        .find(
          {},
          {
            // Never pull the image binary into this response - it is served by
            // /api/instagram/image/[hash] with its own immutable cache.
            projection: { 'image.data': 0 },
            sort: { rank: 1 },
            limit: 12,
          }
        )
        .toArray(),
      meta.findOne({ _id: 'instagram_state' }),
    ]);

    const payload = {
      syncedAt: state?.syncedAt ?? null,
      source: 'mongodb',
      posts: docs.map((d) => ({
        id: d._id,
        caption: d.caption ?? '',
        timestamp: d.timestamp ?? null,
        permalink: d.permalink ?? `https://www.instagram.com/p/${d._id}/`,
        eventTitle: d.eventTitle ?? null,
        eventDate: d.eventDate ?? null,
        imageUrl: d.imageHash ? `/api/instagram/image/${d.imageHash}` : null,
        width: d.image?.width ?? null,
        height: d.image?.height ?? null,
      })),
    };

    // contentHash already fingerprints exactly what this endpoint renders.
    if (state?.contentHash && notModified(req, res, `"${state.contentHash}"`)) return;

    sendJson(res, 200, payload, CACHE);
  } catch (err) {
    console.error('[api/instagram/posts]', err);
    // 503 + short cache: the frontend falls back to its bundled posts, and we
    // do not want a transient outage pinned in the CDN for an hour.
    sendJson(res, 503, { error: 'upstream_unavailable', posts: [] }, 'public, max-age=0, s-maxage=30');
  }
}
