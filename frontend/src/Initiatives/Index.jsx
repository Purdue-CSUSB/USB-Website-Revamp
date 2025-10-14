import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function InitiativesIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const tryPaths = ['/initiatives/initiatives.json', '/data/initiatives.json'];
      for (const p of tryPaths) {
        try {
          const res = await fetch(p);
          if (!res.ok) throw new Error(`Failed to fetch ${p} (${res.status})`);
          const data = await res.json();
          if (Array.isArray(data) && data.length) {
            setItems(data);
            setError('');
            return;
          }
        } catch (e) {

        }
      }
      setItems([]);
      setError('Unable to load initiatives.');
    };
    load().finally(() => setLoading(false));
  }, []);

  const handleCardClick = (item) => {
    if (!item?.link) return;
    if (String(item.link).startsWith('http')) {
      window.open(item.link, '_blank');
    } else {
      window.location.href = item.link;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-montserrat font-bold text-center" style={{ color: '#333333FF' }}>
            Initiatives
          </h1>
          <p className="text-center mt-3 mb-10 font-raleway" style={{ color: '#333333FF' }}>
            We take pride in the freedom our members have to pursue impactful initiatives both immediately and in the long term. Some initiatives have been around for a decade or more, while others come and go as our goals evolve.
          </p>

          {loading ? (
            <p className="text-center font-raleway" style={{ color: '#333333FF' }}>Loading…</p>
          ) : error ? (
            <p className="text-center font-raleway" style={{ color: '#333333FF' }}>Unable to load initiatives.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {items.map((item, idx) => (
                <motion.div
                  key={`${item.title}-${idx}`}
                  className="group flex items-center gap-6 rounded-2xl shadow-md p-8 w-full cursor-pointer border"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#9CA3AF', willChange: 'transform, box-shadow', minHeight: '7rem' }}
                  onClick={() => handleCardClick(item)}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    <img src="/Logos & Icons/usb logos/USB_Icon_Black_Gold_Small.webp" alt="USB Icon" className="w-12 h-12" />
                  </div>
                  <div className="flex-1">
                    <p className="font-montserrat font-bold text-2xl mb-2 relative inline-block" style={{ color: '#333333FF' }}>
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
    </div>
  );
}


