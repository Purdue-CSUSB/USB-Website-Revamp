import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import { motion } from 'framer-motion';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${getBasePath()}/Blog/blog-posts.json`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.blogPosts || data?.posts || []);
        setPosts(list);
      })
      .finally(() => setLoading(false));
  }, []);

  const resolveAuthorImage = (imgPath) => {
    if (!imgPath) return encodeURI(`${getBasePath()}/Board Member Photos/png/None.png`);
    let p = imgPath.replace(/^\.{2}/, '');
    p = p.replace(/board member photos/gi, 'Board Member Photos');
    if (!p.startsWith('/')) p = '/' + p;
    if (/Pinaki-Mohanty/i.test(p)) {
      return encodeURI(`${getBasePath()}/Board Member Photos/png/Pinaki-Mohanty.png`);
    }
    return encodeURI(`${getBasePath()}${p}`);
  };

  const slugify = (s) =>
    String(s || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const formatCategoryLabel = (raw) => {
    if (!raw) return '';
    let s = String(raw)
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();
    return s
      .split(' ')
      .map((w) => (/^[A-Z0-9]{2,}$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join(' ');
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-white"></div>
      <div className="relative z-10">
        <Navbar />
        <section className="py-12 px-8">
          <div className="max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl lg:text-5xl font-montserrat font-bold mb-8 text-center" 
            style={{ color: '#333333FF' }}
          >
            Blog Posts
          </motion.h1>

          {loading ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center font-raleway" 
              style={{ color: '#333333FF' }}
            >
              Loading posts…
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {posts.map((p, idx) => (
                <motion.div
                  key={p.slug || p.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    opacity: { duration: 0.25, delay: 0.03 + (idx * 0.02) },
                    y: { duration: 0.25, delay: 0.03 + (idx * 0.02) },
                    scale: { duration: 0.18, ease: 'easeOut' },
                    boxShadow: { duration: 0.18, ease: 'easeOut' }
                  }}
                  whileHover={{ scale: 1.04 }}
                  style={{ willChange: 'transform' }}
                >
                  <Link
                    to={`/initiatives/blog/${slugify(p.slug || p.title)}`}
                    className="block bg-white rounded-2xl shadow-md p-6 border transition-shadow duration-200 hover:shadow-xl"
                    style={{ borderColor: '#9CA3AF', textDecoration: 'none' }}
                >
                  <h2 className="font-montserrat font-bold text-2xl mb-2" style={{ color: '#333333FF' }}>{p.title}</h2>
                  {p.subtitle && <p className="font-raleway text-sm mb-4" style={{ color: '#333333FF' }}>{p.subtitle}</p>}
                    <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={resolveAuthorImage(p.authorImage)}
                        alt={p.author}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          const current = e.currentTarget.src;
                          if (current.includes('/webp/')) {
                            const fallback = current.replace('/webp/', '/png/').replace(/\.webp$/i, '.png');
                            e.currentTarget.src = fallback;
                          } else {
                            e.currentTarget.src = encodeURI(`${getBasePath()}/Board Member Photos/png/None.png`);
                          }
                        }}
                      />
                      <span className="font-raleway text-sm" style={{ color: '#333333FF' }}>{p.author}</span>
                    </div>
                    <span className="font-raleway text-xs" style={{ color: '#333333FF' }}>{p.date}</span>
                  </div>
                  {p.category && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(p.category.split(',') || [])
                        .map((c) => formatCategoryLabel(c))
                        .filter(Boolean)
                        .map((c, i) => (
                          <span key={`${p.title}-cat-${i}`} className="inline-block text-xs font-raleway bg-gray-100 rounded-full px-3 py-1" style={{ color: '#333333FF' }}>
                            {c}
                          </span>
                        ))}
                    </div>
                  )}
                </Link>
                </motion.div>
              ))}
            </div>
          )}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}




