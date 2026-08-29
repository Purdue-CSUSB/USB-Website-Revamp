import { MongoClient } from 'mongodb';

/**
 * Serverless functions get frozen and thawed, so the connection is cached on
 * globalThis: a warm invocation reuses the pool instead of paying a fresh TLS +
 * auth handshake to Atlas (which is most of the latency on this endpoint).
 */
const globalRef = globalThis;

function clientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!globalRef.__usbMongoClientPromise) {
    globalRef.__usbMongoClientPromise = new MongoClient(uri, {
      maxPoolSize: 5,
      // Fail fast: better a fallback render than a hung request.
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      appName: 'usb-website-api',
    }).connect();
  }
  return globalRef.__usbMongoClientPromise;
}

// Kept in step with POSTS_COLLECTION / META_COLLECTION in
// backend/usb_sync/config.py. Only the URI and database name are environment.
const POSTS_COLLECTION = 'instagram_events';
const META_COLLECTION = 'instagram_meta';

export async function getCollections() {
  const client = await clientPromise();
  const db = client.db(process.env.MONGODB_DB || 'InstagramPosts');
  return {
    posts: db.collection(POSTS_COLLECTION),
    meta: db.collection(META_COLLECTION),
  };
}
