import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function InitiativesIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getBasePath()}/initiatives/initiatives.json`);
        if (!res.ok) throw new Error(`Failed to fetch initiatives.json (${res.status})`);
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setItems(data);
          setError('');
        } else {
          setItems([]);
          setError('No initiatives found.');
        }
      } catch (e) {
        setItems([]);
        setError('Unable to load initiatives.');
      }
    };
    load().finally(() => setLoading(false));
  }, []);

  const normalizeLink = (link) => {
    if (!link) return null;
    if (link.startsWith('http')) return link;
    return link.startsWith('/') ? link : `/${link}`;
  };

  const handleCardClick = (item) => {
    if (!item?.link) return;

    const link = normalizeLink(String(item.link));

    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate and immediately scroll to top to prevent starting mid-page
      navigate(link);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  };

  return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <section className="py-12 px-8">
          <div className="max-w-5xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-4xl lg:text-5xl font-montserrat font-bold text-center"
                style={{ color: '#333333FF' }}
            >
              Initiatives
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.03 }}
                className="text-center mt-3 mb-10 font-raleway"
                style={{ color: '#333333FF' }}
            >
              We take pride in the freedom our members have to pursue impactful
              initiatives both immediately and in the long term. Some initiatives
              have been around for a decade or more, while others come and go as
              our goals evolve.
            </motion.p>

            {loading ? (
                <p className="text-center font-raleway" style={{ color: '#333333FF' }}>
                  Loading…
                </p>
            ) : error ? (
                <p className="text-center font-raleway" style={{ color: '#333333FF' }}>
                  {error}
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                  {items.map((item, idx) => (
                      <motion.div
                          key={`${item.title}-${idx}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            opacity: { duration: 0.25, delay: 0.05 + (idx * 0.03) },
                            y: { duration: 0.25, delay: 0.05 + (idx * 0.03) },
                            scale: { duration: 0.18, ease: 'easeOut' },
                            boxShadow: { duration: 0.18, ease: 'easeOut' }
                          }}
                          className="group flex items-center gap-6 rounded-2xl shadow-md p-8 w-full cursor-pointer border transition-shadow duration-200 hover:shadow-xl"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#9CA3AF',
                            willChange: 'transform',
                            minHeight: '7rem',
                          }}
                          onClick={() => handleCardClick(item)}
                          whileHover={{ scale: 1.04 }}
                      >
                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                          <img
                              src={`${getBasePath()}/Logos & Icons/usb logos/USB_Icon_Black_Gold_Small.webp`}
                              alt="USB Icon"
                              className="w-12 h-12"
                          />
                        </div>
                        <div className="flex-1">
                          <p
                              className="font-montserrat font-bold text-2xl mb-2 relative inline-block"
                              style={{ color: '#333333FF' }}
                          >
                            {item.title}
                            <span className="absolute left-0 bottom-0 block w-full h-0.5 bg-[#333333] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                          </p>
                          <p className="font-raleway text-base" style={{ color: '#333333FF' }}>
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                  ))}
                </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
  );
}
