import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-9xl lg:text-[12rem] font-raleway font-bold mb-4" style={{ color: '#FFCA44FF' }}>
              404
            </h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <h2 className="text-3xl lg:text-4xl font-montserrat font-bold mb-4" style={{ color: '#333333FF' }}>
              Page Not Found
            </h2>
            <p className="text-lg lg:text-xl font-raleway mb-8" style={{ color: '#333333FF' }}>
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ willChange: 'transform, box-shadow' }}
            >
              <Link
                to="/"
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-raleway text-lg font-semibold focus:outline-none transition-transform duration-150"
                style={{ 
                  backgroundColor: '#FFCA44FF', 
                  color: '#000000',
                  textDecoration: 'none'
                }}
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ willChange: 'transform, box-shadow' }}
            >
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-raleway text-lg font-semibold border focus:outline-none transition-transform duration-150"
                style={{ 
                  backgroundColor: 'transparent', 
                  color: '#333333FF',
                  borderColor: '#333333FF'
                }}
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ willChange: 'transform, box-shadow' }}
            >
              <Link
                to="/initiatives"
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-raleway text-lg font-semibold border focus:outline-none transition-transform duration-150"
                style={{ 
                  backgroundColor: 'transparent', 
                  color: '#333333FF',
                  borderColor: '#333333FF',
                  textDecoration: 'none'
                }}
              >
                <Search className="w-5 h-5" />
                Browse Initiatives
              </Link>
            </motion.div>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mt-12 pt-8 border-t"
            style={{ borderColor: '#E5E7EB' }}
          >
            <p className="text-base font-raleway mb-4" style={{ color: '#333333FF' }}>
              You might be looking for:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/initiatives/blog"
                className="font-raleway text-base hover:underline transition-transform duration-150 transform hover:scale-[1.04]"
                style={{ color: '#333333FF' }}
              >
                Blog
              </Link>
              <span style={{ color: '#9CA3AF' }}>•</span>
              <Link
                to="/student-wiki"
                className="font-raleway text-base hover:underline transition-transform duration-150 transform hover:scale-[1.04]"
                style={{ color: '#333333FF' }}
              >
                Student Wiki
              </Link>
              <span style={{ color: '#9CA3AF' }}>•</span>
              <Link
                to="/initiatives"
                className="font-raleway text-base hover:underline transition-transform duration-150 transform hover:scale-[1.04]"
                style={{ color: '#333333FF' }}
              >
                Initiatives
              </Link>
              <span style={{ color: '#9CA3AF' }}>•</span>
              <Link
                to="/contact"
                className="font-raleway text-base hover:underline transition-transform duration-150 transform hover:scale-[1.04]"
                style={{ color: '#333333FF' }}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
