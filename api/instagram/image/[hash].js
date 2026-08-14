import { getCollections } from '../../_lib/mongo.js';
import { notModified, rejectNonGet, sendJson } from '../../_lib/http.js';

// The hash IS the content, so this URL can never go stale.
const CACHE = 'public, max-age=31536000, s-maxage=31536000, immutable';

export default async function handler(req, res) {
  if (rejectNonGet(req, res)) return;

  const raw = req.query?.hash;
  const hash = Array.isArray(raw) ? raw[0] : raw;
  if (!hash || !/^[a-f0-9]{8,64}$/i.test(hash)) {
    return sendJson(res, 400, { error: 'bad_hash' });
  }

  try {
    const { posts } = await getCollections();
    const doc = await posts.findOne(
      { imageHash: hash },
      { projection: { image: 1, imageHash: 1 } }
    );

    if (!doc?.image?.data) {
      return sendJson(res, 404, { error: 'not_found' }, 'public, max-age=0, s-maxage=60');
    }

    res.setHeader('Content-Type', doc.image.contentType || 'image/webp');
    res.setHeader('Cache-Control', CACHE);
    if (notModified(req, res, `"${doc.imageHash}"`)) return;

    const buf = Buffer.from(doc.image.data.buffer ?? doc.image.data);
    res.setHeader('Content-Length', String(buf.length));
    res.statusCode = 200;
    if (req.method === 'HEAD') return res.end();
    res.end(buf);
  } catch (err) {
    console.error('[api/instagram/image]', err);
    sendJson(res, 503, { error: 'upstream_unavailable' }, 'public, max-age=0, s-maxage=30');
  }
}
