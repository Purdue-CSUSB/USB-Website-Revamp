import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '../components/Navbar';

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
      return '/Board Member Photos/png/Pinaki-Mohanty.png';
    }
    if (!p.startsWith('/')) p = '/' + p;
    return encodeURI(p);
  };

  useEffect(() => {
    const slugify = (s) => String(s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    async function load() {
      try {
        const manifestRes = await fetch('/Blog/blog-posts.json');
        const manifest = await manifestRes.json();
        const list = Array.isArray(manifest) ? manifest : (manifest?.blogPosts || manifest?.posts || []);
        const entry = list.find((p) => p.slug === slug || slugify(p.title) === slug);
        setMeta(entry || null);
        const mdPath = entry?.markdownFile ? `/Blog/${entry.markdownFile}` : `/Blog/blog posts/${slug}.md`;
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
          <Link
            to="/initiatives/blog"
            className="inline-block mb-6 font-raleway text-sm rounded-md px-4 py-2 transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: '#FFCA44FF', color: '#000000' }}
          >
            ← Back to Blog Posts
          </Link>
          {meta && (
            <div className="mb-6 bg-white rounded-xl p-6 shadow" style={{ border: '1px solid #eee' }}>
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
            </div>
          )}
          {error ? (
            <p className="font-raleway" style={{ color: '#333333FF' }}>{error}</p>
          ) : (
            <article className="markdown-content">
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
                      return encodeURI(p);
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
            </article>
          )}
        </div>
      </section>
    </div>
  );
}




