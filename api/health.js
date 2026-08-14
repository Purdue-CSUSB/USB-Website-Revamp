import { getCollections } from './_lib/mongo.js';
import { rejectNonGet, sendJson } from './_lib/http.js';

/** Cheap readiness probe: is Atlas reachable and has the sync ever run? */
export default async function handler(req, res) {
  if (rejectNonGet(req, res)) return;

  try {
    const { posts, meta } = await getCollections();
    const [count, state] = await Promise.all([
      posts.estimatedDocumentCount(),
      meta.findOne({ _id: 'instagram_state' }),
    ]);
    sendJson(
      res,
      200,
      {
        ok: true,
        posts: count,
        syncedAt: state?.syncedAt ?? null,
        contentHash: state?.contentHash ?? null,
      },
      'public, max-age=0, s-maxage=30'
    );
  } catch (err) {
    console.error('[api/health]', err);
    sendJson(res, 503, { ok: false, error: String(err?.message || err) }, 'no-store');
  }
}
