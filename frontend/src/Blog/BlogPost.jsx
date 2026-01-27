import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import { motion } from 'framer-motion';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState('');

  const resolveAuthorImage = (imgPath) => {
    if (!imgPath) return null;
    let p = String(imgPath).replace(/^\.{2}/, '');
    p = p.replace(/board member photos/gi, 'Board Member Photos');
    if (/Pinaki-Mohanty/i.test(p)) {
      return encodeURI(`${getBasePath()}/Board Member Photos/png/Pinaki-Mohanty.png`);
    }
    if (!p.startsWith('/')) p = '/' + p;
    return encodeURI(`${getBasePath()}${p}`);
  };

  useEffect(() => {
    const slugify = (s) => String(s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    async function load() {
      try {
        const manifestRes = await fetch(`${getBasePath()}/Blog/blog-posts.json`);
        const manifest = await manifestRes.json();
        const list = Array.isArray(manifest) ? manifest : (manifest?.blogPosts || manifest?.posts || []);
        const entry = list.find((p) => p.slug === slug || slugify(p.title) === slug);
        setMeta(entry || null);
        const mdPath = entry?.markdownFile ? `${getBasePath()}/Blog/${entry.markdownFile}` : `${getBasePath()}/Blog/blog posts/${slug}.md`;
        const res = await fetch(encodeURI(mdPath));
        if (!res.ok) throw new Error('Not found');
        const txt = await res.text();
        const stripped = txt.replace(/^---[\s\S]*?---\s*/m, '');
        setContent(stripped);
      } catch (e) {
        setError('Unable to load this post.');
      }
    }
    load();
  }, [slug]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ willChange: 'transform, box-shadow' }}
              className="inline-block mb-6 rounded-md"
            >
          <Link
            to="/initiatives/blog"
                className="inline-block font-raleway text-sm rounded-md px-4 py-2"
                style={{ backgroundColor: '#FFCA44FF', color: '#000000', textDecoration: 'none' }}
          >
            ← Back to Blog Posts
          </Link>
            </motion.div>
          </motion.div>
          {meta && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.03 }}
              className="mb-6 bg-white rounded-xl p-6 shadow" 
              style={{ border: '1px solid #eee' }}
            >
              <h1 className="font-montserrat font-bold text-4xl mb-2" style={{ color: '#333333FF' }}>{meta.title}</h1>
              {meta.subtitle && <p className="font-raleway italic" style={{ color: '#333333FF' }}>{meta.subtitle}</p>}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  {resolveAuthorImage(meta.authorImage) && (
                    <img
                      src={resolveAuthorImage(meta.authorImage)}
                      alt={meta.author}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const current = e.currentTarget.src;
                        if (current.includes('/webp/')) {
                          const fallback = current.replace('/webp/', '/png/').replace(/\.webp$/i, '.png');
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />
                  )}
                  <span className="font-raleway text-base" style={{ color: '#333333FF' }}>{meta.author}</span>
                </div>
                {meta.date && <span className="font-raleway text-sm" style={{ color: '#333333FF' }}>{meta.date}</span>}
              </div>
              <hr className="mt-6" />
            </motion.div>
          )}
          {error ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-raleway" 
              style={{ color: '#333333FF' }}
            >
              {error}
            </motion.p>
          ) : (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="markdown-content"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => {
                    const resolve = (src) => {
                      if (!src) return '';
                      if (/^https?:/i.test(src)) return src;
                      let p = String(src);
                      p = p.replace(/^\.{2}/, '');
                      p = p.replace(/board member photos/gi, 'Board Member Photos');
                      p = p.replace(/blog posts/gi, 'Blog/blog posts');
                      if (!p.startsWith('/')) p = '/' + p;
                      return `${getBasePath()}${encodeURI(p)}`;
                    };
                    const src = resolve(props.src);
                    return (
                      <img
                        {...props}
                        src={src}
                        loading="lazy"
                        decoding="async"
                        style={{ maxWidth: '100%', height: 'auto' }}
                        onError={(e) => {
                          const current = e.currentTarget.src;
                          if (current.includes('/webp/')) {
                            const fallback = current.replace('/webp/', '/png/').replace(/\.webp$/i, '.png');
                            e.currentTarget.src = fallback;
                          }
                        }}
                      />
                    );
                  },
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </motion.article>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}




