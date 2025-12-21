import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Components/Navbar.jsx';
import { BookOpen, Compass, ChevronLeft, ChevronRight, Send, ChevronDown, ChevronUp, Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function Homepage() {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      setLoading(true);
      const profileUrl = 'https://www.instagram.com/purdueusb/';
      const cacheKey = `ig:posts:${profileUrl}`;
      try {
        const raw = localStorage.getItem(cacheKey);
        if (raw) {
          const obj = JSON.parse(raw);
          if (obj && Array.isArray(obj.value) && obj.value.length > 0 && obj.expiresAt && Date.now() < obj.expiresAt) {
            setInstagramPosts(obj.value);
            setLoading(false);
            return;
          }
        }
      } catch {}
      try {
        const apiRes = await fetch(`${getBasePath()}/Instagram Posts/insta_posts.json`, { cache: 'no-store' });
        if (!apiRes.ok) throw new Error(`HTTP ${apiRes.status}`);
        const posts = await apiRes.json();
        const firstSixImages = Array.isArray(posts) ? posts.filter(p => !!p?.imageUrl).slice(0, 6) : [];
        console.log('Instagram posts loaded:', firstSixImages.length, firstSixImages);
        if (firstSixImages.length > 0) {
          setInstagramPosts(firstSixImages);
          try { localStorage.setItem(cacheKey, JSON.stringify({ value: firstSixImages, expiresAt: Date.now() + 10 * 60 * 1000 })); } catch {}
          setLoading(false);
          return;
        }
        throw new Error('API returned no posts');
      } catch (scrapeErr) {
        console.warn('Instagram scrape failed.', scrapeErr);
        setInstagramPosts([]);
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getImageUrl = (post) => {
    const raw = post?.imageUrl || post?.media_url || post?.thumbnail_url;
    if (!raw) return null;
    let url = raw.trim();
    
    // Handle external URLs (Instagram API)
    if (url.startsWith('//')) url = 'https:' + url;
    if (url.startsWith('http:')) url = url.replace(/^http:/i, 'https:');
    if (/^https?:/i.test(url)) return url;
    
    // Strip /USB-Website-Revamp/ from the beginning if present
    if (url.startsWith('/USB-Website-Revamp/')) {
      url = url.substring('/USB-Website-Revamp'.length);
    }
    
    // Handle local paths - if it already starts with /, use as is
    if (url.startsWith('/')) {
      console.log('Instagram image URL:', url);
      return url;
    }
    
    // For other paths, add the base path
    const fullUrl = `${getBasePath()}/${url}`;
    console.log('Instagram image URL (other):', fullUrl);
    return fullUrl;
  };

  const decodeEntities = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
  };

  const formatCaption = (raw) => {
    const t = decodeEntities(raw || '');
    return t.replace(/\r\n/g, '\n').trim();
  };

  useEffect(() => {
    if (!instagramPosts || instagramPosts.length === 0) return;
    instagramPosts.forEach((p) => {
      const url = getImageUrl(p);
      if (!url) return;
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = url;
    });
    const len = instagramPosts.length;
    const boundaryIdx = [0, 1, len - 1];
    boundaryIdx.forEach((i) => {
      if (i < 0 || i >= len) return;
      const url = getImageUrl(instagramPosts[i]);
      if (!url) return;
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = url;
    });
  }, [instagramPosts]);

  const [boardMembers, setBoardMembers] = useState([]);
  const [alumniMembers, setAlumniMembers] = useState([]);
  const [showAlumni, setShowAlumni] = useState(false);

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const res = await fetch(`${getBasePath()}/Board Member Photos/board-members.json`);
        const data = await res.json();
        const members = Array.isArray(data?.members) ? data.members : [];
        const alumni = Array.isArray(data?.alumni) ? data.alumni : [];
        const normalize = (arr) => arr.map((m) => ({
          ...m,
          photo: typeof m.photo === 'string' ? m.photo : String(m.photo || 'png/None.png')
        }));
        setBoardMembers(normalize(members));
        setAlumniMembers(normalize(alumni));
      } catch (e) {
        console.error('Failed to load board-members.json', e);
      }
    };
    loadBoard();
  }, []);

  useEffect(() => {
    if (!boardMembers || boardMembers.length === 0) return;
    boardMembers.forEach((m) => {
      const src = `${getBasePath()}/Board Member Photos/${m.photo}`;
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = src;
    });
  }, [boardMembers]);

  useEffect(() => {
    if (!boardMembers || boardMembers.length === 0) return;
    const head = document.head;
    const links = boardMembers.map((m) => {
      const href = `${getBasePath()}/Board Member Photos/${m.photo}`;
      const l = document.createElement('link');
      l.rel = 'preload';
      l.as = 'image';
      l.href = href;
      l.fetchPriority = 'high';
      head.appendChild(l);
      return l;
    });
    return () => { links.forEach((l) => { try { document.head.removeChild(l); } catch {} }); };
  }, [boardMembers]);

  useEffect(() => {
    if (!alumniMembers || alumniMembers.length === 0) return;
    alumniMembers.forEach((m) => {
      const src = `${getBasePath()}/Board Member Photos/${m.photo}`;
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = src;
    });
    const head = document.head;
    const links = alumniMembers.map((m) => {
      const href = `${getBasePath()}/Board Member Photos/${m.photo}`;
      const l = document.createElement('link');
      l.rel = 'preload';
      l.as = 'image';
      l.href = href;
      l.fetchPriority = 'high';
      head.appendChild(l);
      return l;
    });
    return () => { links.forEach((l) => { try { document.head.removeChild(l); } catch {} }); };
  }, [alumniMembers]);

  const [initiatives, setInitiatives] = useState([]);
  useEffect(() => {
    const loadInitiatives = async () => {
      try {
        const res = await fetch(`${getBasePath()}/initiatives/initiatives.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setInitiatives(data);
        } else if (Array.isArray(data?.initiatives)) {
          setInitiatives(data.initiatives);
        } else {
          setInitiatives([]);
        }
      } catch (e) {
        console.error('Unable to load initiatives.json', e);
        setInitiatives([]);
      }
    };
    loadInitiatives();
  }, []);

  // Embla Carousel setup with loop enabled for infinite scroll
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    duration: 25,
    dragFree: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <section className="py-16 px-8" style={{ backgroundColor: '#333333FF' }}>
          <div className="w-full">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-shrink-0 lg:w-1/2">
                <img
                    src={`${getBasePath()}/USB Group photo/usb_group_2024.webp`}
                    alt="USB Group Photo 2024"
                    className="w-full max-w-3xl rounded-lg shadow-2xl"
                />
              </div>

              <div className="flex-1 lg:w-1/2 text-center lg:text-left">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-raleway font-bold mb-6 leading-tight" style={{ color: '#FFFFFFFF' }}>
                  Hello from USB!
                </h1>
                <p className="text-xl lg:text-2xl font-raleway leading-relaxed mb-8" style={{ color: '#FFFFFFFF' }}>
                  The Computer Science Undergraduate Board is dedicated to improving the student experience within Computer and Data Sciences at Purdue- whether by managing CS193, hosting forums for student advocacy, or maintaining a database of undergrad-tailored resources, USB is continually creating initiatives that will uphold our values.
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex gap-4">
                    <a href="https://www.instagram.com/purdueusb" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-200">
                      <img
                          src={`${getBasePath()}/Logos & Icons/social media logos/instagram.svg`}
                          alt="Instagram"
                          className="w-12 h-12"
                      />
                    </a>
                    <a href="https://github.com/Purdue-CSUSB" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity duration-200">
                      <img
                          src={`${getBasePath()}/Logos & Icons/social media logos/github.svg`}
                          alt="GitHub"
                          className="w-12 h-12"
                      />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        style={{ willChange: 'transform, box-shadow' }}
                    >
                      <Link
                          to="/student-wiki"
                          className="flex items-center gap-2 px-6 py-3 rounded-lg font-raleway text-lg focus:outline-none"
                          style={{ backgroundColor: '#FFCA44FF', color: '#000000' }}
                      >
                        <BookOpen size={20} />
                        Read The Student Wiki
                      </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        style={{ willChange: 'transform, box-shadow' }}
                    >
                      <Link
                          to="/initiatives"
                          className="flex items-center gap-2 px-6 py-3 rounded-lg font-raleway text-lg focus:outline-none"
                          style={{ backgroundColor: '#FFCA44FF', color: '#000000' }}
                      >
                        <Compass size={20} />
                        Explore Initiatives
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-8 relative overflow-hidden">
          <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom right, #FFCA44FF 50%, #FFFFFF 50%)'
              }}
          ></div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-5xl lg:text-6xl font-montserrat font-bold" style={{ color: '#333333FF' }}>
                About Us
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col max-w-md">
                <h3 className="text-3xl lg:text-4xl font-montserrat font-bold mb-4" style={{ color: '#333333FF' }}>
                  Our Mission
                </h3>
                <p className="text-lg lg:text-xl font-raleway leading-relaxed" style={{ color: '#333333FF' }}>
                  The Computer Science Undergraduate Student Board was established in 1999 to promote a supportive and engaged community within Purdue's Computer Science Department, and to use its relationship with faculty, the Computer Science Corporate Partners Program, and administration to advocate for the student body.
                </p>
              </div>

              <div className="flex flex-col w-full">
                <h3 className="text-3xl lg:text-4xl font-montserrat font-bold mb-6 text-center" style={{ color: '#333333FF' }}>
                  Our Objectives
                </h3>

                <div className="flex flex-col lg:flex-row gap-10 w-full">
                  <div className="flex-1 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <img
                          src={`${getBasePath()}/Logos & Icons/about us logos/hands.svg`}
                          alt="Advocacy"
                          className="w-10 h-10"
                      />
                    </div>
                    <h4 className="text-2xl font-montserrat font-bold mb-4" style={{ color: '#333333FF' }}>
                      Advocacy
                    </h4>
                    <p className="text-base font-raleway leading-relaxed" style={{ color: '#333333FF' }}>
                      USB cares about improving the student experience. Visit our daily office hours or attend the undergraduate town hall to discuss ways to improve our community.
                    </p>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <img
                          src={`${getBasePath()}/Logos & Icons/about us logos/care.svg`}
                          alt="Events"
                          className="w-10 h-10"
                      />
                    </div>
                    <h4 className="text-2xl font-montserrat font-bold mb-4" style={{ color: '#333333FF' }}>
                      Events
                    </h4>
                    <p className="text-base font-raleway leading-relaxed" style={{ color: '#333333FF' }}>
                      We put on events that matter, from fun events like Pizza with Professors and Freshman Social Hour, to professional opportunities through career oriented panels and events.
                    </p>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <img
                          src={`${getBasePath()}/Logos & Icons/about us logos/chart.svg`}
                          alt="Resources"
                          className="w-10 h-10"
                      />
                    </div>
                    <h4 className="text-2xl font-montserrat font-bold mb-4" style={{ color: '#333333FF' }}>
                      Resources
                    </h4>
                    <p className="text-base font-raleway leading-relaxed" style={{ color: '#333333FF' }}>
                      We're here to help CS, DS, and AI students. We teach CS193 Tools for first-years, run a free help room for intro CS courses, as well as maintain a tutor list, blog, and student wiki.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#333333FF' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-montserrat font-bold mb-4" style={{ color: '#FFFFFFFF' }}>
                Stay Connected
              </h2>
              <p className="text-lg font-raleway" style={{ color: '#FFFFFFFF' }}>
                Follow our latest updates and events on Instagram
              </p>
            </div>

            <div className="relative max-w-7xl mx-auto">
              <div className="flex items-center justify-center">
                <button
                    onClick={scrollPrev}
                    className="absolute left-2 z-20 rounded-full bg-white transition-all duration-300 ease-in-out flex items-center justify-center shadow-xl"
                    style={{
                      top: '50%',
                      transform: 'translateY(-50%)',
                      transformOrigin: 'center center',
                      backgroundColor: '#FFFFFF',
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      outline: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                >
                  <ChevronLeft size={32} className="text-gray-800" style={{ pointerEvents: 'none' }} />
                </button>

                <div className="relative w-full px-20" style={{ minHeight: '400px' }}>
                  <div className="embla">
                    <div className="embla__viewport" ref={emblaRef}>
                      <div className="embla__container">
                      {(instagramPosts && instagramPosts.length > 0 ? instagramPosts : Array.from({ length: 3 })).map((post, index) => {
                        return (
                          <div 
                            key={`${post?.id || 'p'}-${index}`}
                            className="embla__slide"
                            style={{
                              display: 'flex',
                              justifyContent: 'center'
                            }}
                          >
                            <div className="w-80 max-w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2" style={{ borderColor: '#000000' }}>
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                  <img src={`${getBasePath()}/Logos & Icons/usb logos/USB_Icon_Black_Gold_Small.webp`} alt="purdueusb" className="w-6 h-6 object-contain" />
                                </div>
                                <div className="leading-tight">
                                  <p className="text-sm font-montserrat font-bold" style={{ color: '#111827' }}>purdueusb</p>
                                  <p className="text-[10px] font-raleway" style={{ color: '#6B7280' }}>Purdue USB</p>
                                </div>
                              </div>
                              <MoreHorizontal size={18} className="text-gray-500" />
                            </div>

                            <div className="aspect-square bg-black flex items-center justify-center relative overflow-hidden">
                              {loading && (!post || !getImageUrl(post)) ? (
                                  <span className="text-gray-500 text-sm">Loading...</span>
                              ) : getImageUrl(post) ? (
                                  <img
                                      src={getImageUrl(post)}
                                      alt="Instagram post"
                                      className="w-full h-full object-contain opacity-0"
                                      loading="eager"
                                      decoding="async"
                                      fetchpriority="high"
                                      onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                                      onError={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.src = `${getBasePath()}/Logos & Icons/social media logos/instagram.svg`; }}
                                      style={{ transition: 'opacity 60ms linear' }}
                                  />
                              ) : (
                                  <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                      <img
                                          src={`${getBasePath()}/Logos & Icons/social media logos/instagram.svg`}
                                          alt="Instagram"
                                          className="w-8 h-8"
                                      />
                                    </div>
                                    <span className="text-gray-500 text-sm">Post</span>
                                  </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between px-4 py-2">
                              <div className="flex items-center gap-4">
                                <Heart size={20} className="text-gray-800 cursor-pointer" />
                                <MessageCircle size={20} className="text-gray-800 cursor-pointer" />
                                <a href={post?.permalink} target="_blank" rel="noopener noreferrer" className="text-gray-800">
                                  <Send size={18} />
                                </a>
                              </div>
                              <Bookmark size={20} className="text-gray-800 cursor-pointer" />
                            </div>

                            {!loading && post && (
                                <div className="px-4 pb-4">
                                  <p className="text-sm font-raleway text-gray-800 line-clamp-4">
                                    <span className="font-montserrat font-bold mr-1">purdueusb</span>
                                    {formatCaption(post.caption)}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <a
                                        href={post.permalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-raleway underline"
                                        style={{ color: '#6B7280' }}
                                    >
                                      View on Instagram
                                    </a>
                                    <span className="text-[11px] uppercase tracking-wide" style={{ color: '#9CA3AF' }}>{formatTimeAgo(post.timestamp)}</span>
                                  </div>
                                </div>
                            )}
                          </div>
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                    onClick={scrollNext}
                    className="absolute right-2 z-20 rounded-full bg-white transition-all duration-300 ease-in-out flex items-center justify-center shadow-xl"
                    style={{
                      top: '50%',
                      transform: 'translateY(-50%)',
                      transformOrigin: 'center center',
                      backgroundColor: '#FFFFFF',
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      outline: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                >
                  <ChevronRight size={32} className="text-gray-800" style={{ pointerEvents: 'none' }} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-montserrat font-bold text-center" style={{ color: '#333333FF' }}>
              Meet the Board
            </h2>
            <p className="text-center mt-3 mb-10 font-raleway" style={{ color: '#333333FF' }}>
              2025 – 2026 Members
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {boardMembers.map((m, idx) => {
                const photoSrc = encodeURI(`${getBasePath()}/Board Member Photos/${m.photo}`);
                const card = (
                    <div key={`${m.name}-${idx}`} className="group flex flex-col items-center text-center">
                      <div className="relative w-44 h-44 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-lg transition-transform duration-100 ease-out group-hover:scale-105" style={{ willChange: 'transform' }}>
                        <img src={photoSrc} alt={m.name} className="w-full h-full object-cover will-change-auto" loading="eager" decoding="async" fetchpriority="high" width="512" height="512" onError={(e) => { e.currentTarget.src = encodeURI(`${getBasePath()}/Board Member Photos/png/None.png`); }} />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-75 ease-out bg-black/30 px-4 text-center" style={{ willChange: 'opacity' }}>
                          <div className="space-y-1">
                            <p className="font-montserrat font-bold text-white text-lg leading-snug">{m.name}</p>
                            {m.title && <p className="font-raleway font-bold text-white text-sm leading-snug">{m.title}</p>}
                            {m.class && <p className="font-raleway text-white text-sm leading-snug">{m.class}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                );
                return m.site ? (
                    <a key={`${m.name}-${idx}`} href={m.site} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                      {card}
                    </a>
                ) : card;
              })}
            </div>

            <div className="mt-14">
              <h3 className="text-2xl lg:text-3xl font-montserrat font-bold text-center mb-2" style={{ color: '#333333FF' }}>
                Former Members
              </h3>
              <p className="text-center mb-6 font-raleway" style={{ color: '#333333FF' }}>
                A best-effort record of our 83 former members
              </p>

              <div className="text-center mb-8">
                <button
                    onClick={() => setShowAlumni((s) => !s)}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-raleway font-semibold transition-all duration-200"
                    style={{ backgroundColor: '#FFCA44FF', color: '#000000' }}
                >
                  {showAlumni ? (
                      <>
                        Collapse
                        <ChevronUp size={18} />
                      </>
                  ) : (
                      <>
                        Expand
                        <ChevronDown size={18} />
                      </>
                  )}
                </button>
              </div>

              {showAlumni && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                    {alumniMembers.map((m, idx) => {
                      const photoSrc = encodeURI(`${getBasePath()}/Board Member Photos/${m.photo}`);
                      const card = (
                          <div key={`${m.name}-${idx}`} className="group flex flex-col items-center text-center">
                            <div className="relative w-44 h-44 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-md transition-transform duration-100 ease-out group-hover:scale-105" style={{ willChange: 'transform' }}>
                              <img src={photoSrc} alt={m.name} className="w-full h-full object-cover will-change-auto" loading="eager" decoding="async" width="512" height="512" onError={(e) => { e.currentTarget.src = encodeURI(`${getBasePath()}/Board Member Photos/png/None.png`); }} />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-75 ease-out bg-black/30 px-4 text-center" style={{ willChange: 'opacity' }}>
                                <div className="space-y-1">
                                  <p className="font-montserrat font-bold text-white text-lg leading-snug">{m.name}</p>
                                  {m.title && <p className="font-raleway font-bold text-white text-sm leading-snug">{m.title}</p>}
                                  {m.class && <p className="font-raleway text-white text-sm leading-snug">{m.class}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                      );
                      return m.site ? (
                          <a key={`${m.name}-${idx}`} href={m.site} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                            {card}
                          </a>
                      ) : card;
                    })}
                  </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-8 relative overflow-hidden">
          <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, #FFCA44FF 50%, #FFFFFF 50%)'
              }}
          ></div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-montserrat font-bold mb-10 text-center" style={{ color: '#333333FF' }}>
              Our Initiatives
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initiatives.map((item, idx) => {
                const getLink = (link) => {
                  if (!link) return undefined;
                  if (link.startsWith('http')) return link;
                  return link;
                };
                const link = getLink(item.link);
                const isExternal = link && link.startsWith('http');
                
                const content = (
                  <motion.div
                      key={`${item.title}-${idx}`}
                      className="group flex items-center gap-4 rounded-xl shadow-md p-4 hover:shadow-xl w-full cursor-pointer"
                      style={{ backgroundColor: '#333333FF' }}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
                      whileTap={{ scale: 1.02 }}
                      onClick={() => {
                        if (link) {
                          if (isExternal) {
                            window.open(link, '_blank', 'noopener,noreferrer');
                          } else {
                            window.location.href = link;
                          }
                        }
                      }}
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#333333FF' }}>
                      <img src={`${getBasePath()}/Logos & Icons/usb logos/USB_Icon_Black_Gold_Small.webp`} alt="USB Icon" className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <p className="font-montserrat font-bold text-xl mb-1 underline decoration-transparent group-hover:decoration-white underline-offset-4 transition-colors duration-200" style={{ color: '#FFFFFFFF' }}>{item.title}</p>
                        <div
                            className="absolute left-0 -bottom-1 h-[2px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
                        />
                      </div>
                      <p className="font-raleway text-sm" style={{ color: '#FFFFFFFF' }}>
                        {item.description || 'Short description of the initiative goes here. This can be 1–2 lines describing purpose.'}
                      </p>
                    </div>
                  </motion.div>
                );
                return content;
              })}
            </div>
          </div>
        </section>
      </div>
  );
}