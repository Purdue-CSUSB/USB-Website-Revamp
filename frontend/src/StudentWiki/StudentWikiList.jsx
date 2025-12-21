import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar.jsx';
import { Search } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function StudentWikiList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [contents, setContents] = useState({});
  const location = useLocation();

  useEffect(() => {
    fetch(`${getBasePath()}/Student Wiki/student-wiki-posts.json`)
      .then((r) => r.json())
      .then((data) => setPosts(data?.studentWikiPosts || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    if (q) setQuery(q);
  }, [location.search]);

  useEffect(() => {
    if (!posts?.length) return;
    const loadAll = async () => {
      const entries = await Promise.all(
        posts.map(async (p, i) => {
          try {
            const path = `/Student Wiki/${p.markdownFile}`;
            const res = await fetch(encodeURI(path));
            if (!res.ok) return [i, ''];
            const txt = await res.text();
            const stripped = txt.replace(/^---[\s\S]*?---\s*/m, '');
            return [i, stripped];
          } catch (_) {
            return [i, ''];
          }
        })
      );
      const map = {};
      entries.forEach(([i, t]) => (map[i] = t));
      setContents(map);
    };
    loadAll();
  }, [posts]);

  const resolveAuthorImage = (imgPath) => {
    if (!imgPath) return encodeURI(`${getBasePath()}/Board Member Photos/png/None.png`);
    let p = String(imgPath).replace(/^\.{2}/, '');
    p = p.replace(/board member photos/gi, 'Board Member Photos');
    if (/Pinaki-Mohanty/i.test(p)) {
      return encodeURI(`${getBasePath()}/Board Member Photos/png/Pinaki-Mohanty.png`);
    }
    if (!p.startsWith('/')) p = '/' + p;
    return encodeURI(`${getBasePath()}${p}`);
  };

  const normalize = (s) => (s || '').toString().toLowerCase();
  const getTime = (d) => {
    if (!d) return 0;
    const t = Date.parse(d);
    return Number.isNaN(t) ? 0 : t;
  };

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

  const tokenize = (q) =>
    q
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((raw) => {
        const tok = { raw, include: null, field: null, term: raw, boost: 1, fuzzy: 0 };

        if (raw.startsWith('+')) tok.include = true, (tok.term = raw.slice(1));
        else if (raw.startsWith('-')) tok.include = false, (tok.term = raw.slice(1));

        const boostMatch = tok.term.match(/\^(\d+)$/);
        if (boostMatch) tok.boost = parseInt(boostMatch[1], 10), (tok.term = tok.term.replace(/\^(\d+)$/, ''));

        const fieldMatch = tok.term.match(/^(title|description|content|author|category|date):(.+)$/i);
        if (fieldMatch) {
          tok.field = fieldMatch[1].toLowerCase();
          tok.term = fieldMatch[2];
        }

        const fuzzyMatch = tok.term.match(/~(\d+)$/);
        if (fuzzyMatch) tok.fuzzy = parseInt(fuzzyMatch[1], 10), (tok.term = tok.term.replace(/~\d+$/, ''));
        return tok;
      });

  const toRegex = (term) => {
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = esc.replace(/\\\*/g, '.*');
    return new RegExp(`${pattern}`, 'i');
  };

  const distance1 = (a, b) => {

    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      edits++;
      if (edits > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
    }
    if (i < a.length || j < b.length) edits++;
    return edits <= 1;
  };

  const matchesToken = (p, tok, i) => {
    const fields = {
      title: p.title,
      description: p.subtitle,
      author: p.author,
      category: p.category,
      date: p.date,
      content: contents[i] || '',
    };
    const haystacks = tok.field ? [fields[tok.field] || ''] : Object.values(fields);
    const rex = toRegex(tok.term);
    const termLow = normalize(tok.term);
    const compact = (s) => normalize(s).replace(/[^a-z0-9]/g, '');
    const termCompact = compact(tok.term);
    for (const h of haystacks) {
      const val = normalize(h);
      if (!val) continue;
      if (rex.test(h)) return true;

      if (termCompact && compact(h).includes(termCompact)) return true;
      if (tok.fuzzy) {
        const parts = val.split(/\W+/);
        if (parts.some((w) => distance1(w, termLow))) return true;
      }
    }
    return false;
  };

  const scorePost = (p, i, toks) => {
    let score = 0;
    for (const t of toks) {
      const ok = matchesToken(p, t, i);
      if (t.include === true && !ok) return -Infinity;
      if (t.include === false && ok) return -Infinity;
      if (ok) score += 1 * (t.boost || 1);
    }
    return score;
  };

  const computeFiltered = () => {
    const toks = tokenize(query);

    const simpleWords = query
      .trim()
      .split(/\s+/)
      .filter((w) => w && !/^[-+]/.test(w) && !/[:^~]/.test(w) && w !== '*');

    const buildPhrase = (words) => {
      if (!words || words.length < 2) return null;
      const esc = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

      const pattern = esc.join('[\\s\\S]*?');
      try { return new RegExp(pattern, 'i'); } catch { return null; }
    };
    const phraseRe = buildPhrase(simpleWords);
    const compact = (s) => normalize(s).replace(/[^a-z0-9]/g, '');
    const phraseCompact = simpleWords.length >= 2 ? compact(simpleWords.join('')) : '';

    const weight = {
      titlePhrase: 800,
      subtitlePhrase: 600,
      titleTok: 80,
      subtitleTok: 60,
      contentTok: 8,
      categoryTok: 10,
      authorTok: 6,
      dateTok: 3,
    };

    const fieldVal = (p, i, name) => {
      switch (name) {
        case 'title': return p.title || '';
        case 'description': return p.subtitle || '';
        case 'author': return p.author || '';
        case 'category': return p.category || '';
        case 'date': return p.date || '';
        case 'content': return contents[i] || '';
        default: return '';
      }
    };

    const hardRequire = (p, i) => {

      if (simpleWords.length >= 2 && phraseRe) {
        const title = fieldVal(p, i, 'title');
        const desc = fieldVal(p, i, 'description');
        const titlePhrase = phraseRe.test(title) || (phraseCompact && compact(title).includes(phraseCompact));
        const subPhrase = phraseRe.test(desc) || (phraseCompact && compact(desc).includes(phraseCompact));
        return Boolean(titlePhrase || subPhrase);
      }

      return true;
    };

    if (!toks.length && !simpleWords.length) {
      return [...posts].sort((a, b) => getTime(b.date) - getTime(a.date));
    }

    const scored = posts.map((p, i) => {
      if (!hardRequire(p, i)) return { p, i, s: -Infinity };
      let s = scorePost(p, i, toks);

      if (phraseRe) {
        const title = fieldVal(p, i, 'title');
        const desc = fieldVal(p, i, 'description');
        if (phraseRe.test(title) || (phraseCompact && compact(title).includes(phraseCompact))) s += weight.titlePhrase;
        if (phraseRe.test(desc) || (phraseCompact && compact(desc).includes(phraseCompact))) s += weight.subtitlePhrase;
      }

      tokenize(query).forEach((t) => {
        if (t.term === '*' || !t.term) return;
        const rex = toRegex(t.term);
        const inTitle = rex.test(fieldVal(p, i, 'title'));
        const inDesc = rex.test(fieldVal(p, i, 'description'));
        const inContent = rex.test(fieldVal(p, i, 'content'));
        const inCat = rex.test(fieldVal(p, i, 'category'));
        const inAuthor = rex.test(fieldVal(p, i, 'author'));
        const inDate = rex.test(fieldVal(p, i, 'date'));
        if (inTitle) s += weight.titleTok * (t.boost || 1);
        if (inDesc) s += weight.subtitleTok * (t.boost || 1);
        if (inContent) s += weight.contentTok * (t.boost || 1);
        if (inCat) s += weight.categoryTok * (t.boost || 1);
        if (inAuthor) s += weight.authorTok * (t.boost || 1);
        if (inDate) s += weight.dateTok * (t.boost || 1);
      });
      return { p, i, s };
    })
      .filter((x) => x.s !== -Infinity && x.s > 0);

    scored.sort((a, b) => {
      const d = getTime(b.p.date) - getTime(a.p.date);
      if (d !== 0) return d;
      return b.s - a.s;
    });
    return scored.map((x) => x.p);
  };

  const filtered = computeFiltered();


  const buildHighlightRegex = () => {
    const toks = tokenize(query).filter((t) => t.fuzzy === 0 && (t.field == null || t.field === 'title' || t.field === 'description'));
    if (!toks.length) return null;
    const parts = toks.map((t) => {
      const esc = t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*');
      return `(${esc})`;
    });
    try {
      return new RegExp(parts.join('|'), 'ig');
    } catch (_) {
      return null;
    }
  };

  const highlightRe = buildHighlightRegex();

  const escapeHtml = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const highlight = (text) => {
    if (!highlightRe || !text) return text;
    const safe = escapeHtml(String(text));
    return safe.replace(highlightRe, (m) => `<mark style="background:#FFCA44; color:#000; padding:0 2px; border-radius:2px;">${escapeHtml(m)}</mark>`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-montserrat font-bold text-center" style={{ color: '#333333FF' }}>
            Student Wiki
          </h1>
          <p className="text-center mt-3 mb-10 font-raleway" style={{ color: '#333333FF' }}>
            Contains locally sourced, organic wisdom. Shared by the student body, curated by USB.
          </p>

          {loading ? (
            <p className="text-center font-raleway" style={{ color: '#333333FF' }}>Loading wiki posts…</p>
          ) : (
            <div
              className="max-h-[70vh] max-w-3xl mx-auto border rounded-xl p-4 shadow-sm bg-white flex flex-col"
              style={{ borderColor: '#9CA3AF' }}
            >
              <div className="pb-3 border-b" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex items-center gap-2 rounded-md border px-3 py-2" style={{ borderColor: '#9CA3AF', backgroundColor: '#FFFFFF' }}>
                  <Search size={16} className="text-gray-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search wiki..."
                    className="flex-1 outline-none font-raleway text-sm"
                    style={{ color: '#333333FF', backgroundColor: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 overflow-y-auto pr-1" style={{ scrollbarGutter: 'stable' }}>
              {filtered.length === 0 ? (
                <div className="text-center py-10">
                  <p className="font-montserrat font-bold text-lg" style={{ color: '#333333FF' }}>No results found</p>
                  <p className="font-raleway text-sm mt-1" style={{ color: '#333333FF' }}>Tip: Read about how to optimize your search.</p>
                </div>
              ) : filtered.map((p, i) => (
                <Link to={`/student-wiki/${(p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`} key={`wiki-${i}`} className="relative bg-white rounded-2xl shadow p-6 border transition-colors duration-150 hover:bg-gray-200" style={{ borderColor: '#9CA3AF', textDecoration: 'none' }}>

                  {p.date && (
                    <span className="absolute top-4 right-4 font-raleway text-xs" style={{ color: '#333333FF' }}>{p.date}</span>
                  )}
                  <h2 className="font-montserrat font-bold text-xl mb-1 pr-24" style={{ color: '#333333FF' }} dangerouslySetInnerHTML={{ __html: highlight(p.title) }} />
                  {p.subtitle && (
                    <p className="font-raleway text-sm mb-4 pr-24" style={{ color: '#333333FF' }} dangerouslySetInnerHTML={{ __html: highlight(p.subtitle) }} />
                  )}
                  <div className="flex items-center gap-2">
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
                  </div>
                  {p.category && (
                    <div className="absolute bottom-4 right-4 flex justify-end gap-2 flex-wrap">
                      {(p.category.split(',') || [])
                        .map((c) => formatCategoryLabel(c))
                        .filter(Boolean)
                        .map((c, idx) => (
                          <span key={`cat-${i}-${idx}`} className="inline-block text-xs font-raleway bg-gray-100 rounded-full px-3 py-1" style={{ color: '#333333FF' }}>
                            {c}
                          </span>
                        ))}
                    </div>
                  )}
                </Link>
              ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


