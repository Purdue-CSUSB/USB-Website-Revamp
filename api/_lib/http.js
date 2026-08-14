/** Small shared helpers so every function answers with the same shape. */

export function sendJson(res, status, body, cacheControl) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (cacheControl) res.setHeader('Cache-Control', cacheControl);
  res.end(JSON.stringify(body));
}

/**
 * Only GET/HEAD are ever valid here; everything else short-circuits.
 * Returns true when the caller should stop.
 */
export function rejectNonGet(req, res) {
  if (req.method === 'GET' || req.method === 'HEAD') return false;
  res.setHeader('Allow', 'GET, HEAD');
  sendJson(res, 405, { error: 'method_not_allowed' });
  return true;
}

/** Honour conditional requests so repeat views cost 304 instead of a payload. */
export function notModified(req, res, etag) {
  res.setHeader('ETag', etag);
  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch && ifNoneMatch.split(',').some((t) => t.trim() === etag)) {
    res.statusCode = 304;
    res.end();
    return true;
  }
  return false;
}
