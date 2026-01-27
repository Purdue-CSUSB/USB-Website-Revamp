import React from 'react';
import Navbar from '../../Components/Navbar.jsx';
import Footer from '../../Components/Footer.jsx';
import { motion } from 'framer-motion';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function SocialWellness() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center font-montserrat font-extrabold text-4xl lg:text-5xl mb-6" 
            style={{ color: '#333333FF' }}
          >
            Social Wellness
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.03 }}
            className="font-raleway text-lg mb-10 text-center max-w-4xl mx-auto leading-relaxed" 
            style={{ color: '#333333FF' }}
          >
            An initiative tailored towards making the student experience more enjoyable, stress-relieving, and fun, steering more towards event planning and less about direct CS advice or work. Social Wellness bridges the gap between enjoyable experiences as a CS student, keeping people motivated, and wanting to touch grass. This initiative is tailored towards CS STUDENTS and not CS W*RK.
          </motion.p>

          {/* Freshman Social Hour Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-8 mb-12"
          >
            <div className="w-full flex flex-col justify-center" style={{ minHeight: '400px' }}>
              <h2 className="font-montserrat text-3xl font-bold mb-4" style={{ color: '#333333FF' }}>
                Freshman Social Hour
              </h2>
              <p className="font-raleway text-base leading-relaxed mb-4" style={{ color: '#333333FF' }}>
                Freshman Social Hour aims to help CS/DS/AI freshmen meet people in their first few weeks here. This program is meant to foster a community within CS and hopefully allow freshmen to connect and make friends with people they'll see for the rest of their time here at Purdue.
              </p>
              <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                We host this event during the first two weeks of the semester to help CS students get to know each other. It's a laid-back social and networking opportunity, giving students the chance to meet new people and enjoy some free food. Past events have included structured speed networking activities, game night tournaments, and scavenger hunts in Lawson.
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-center" 
              style={{ minHeight: '400px' }}
            >
              <div className="w-full">
                <img
                  src={encodeURI(`${getBasePath()}/initiatives/Social Wellness/CookieDropImage.jpg`)}
                  alt="Freshman Social Hour"
                  className="rounded-xl w-full h-full max-w-lg shadow-lg object-cover"
                  style={{ height: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('Failed to load Freshman Social Hour image');
                  }}
                />
                <p className="font-raleway text-base mt-4 text-center" style={{ color: '#333333FF' }}>
                  Freshman Social Hour
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Past Events Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.07 }}
            className="mb-12"
          >
            <h2 className="font-montserrat text-3xl font-bold mb-6 text-center" style={{ color: '#333333FF' }}>
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CS180 Cookie Drop */}
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="bg-gray-50 rounded-xl p-6 text-center"
                style={{ willChange: 'transform, box-shadow' }}
              >
                <img
                    src={encodeURI(`${getBasePath()}/initiatives/Social Wellness/CookieDropFlyer.png`)}
                    alt="CS180 Cookie Drop"
                    className="rounded-xl w-full mb-4 shadow-lg object-cover"
                    style={{height: '300px', objectFit: 'cover'}}
                    onError={(e) => {
                      console.error('Failed to load CS180 Cookie Drop image');
                    }}
                />
                <h3 className="font-montserrat text-xl font-bold mb-2" style={{color: '#333333FF'}}>
                  CS180 Cookie Drop
                </h3>
                <p className="font-raleway text-sm mt-2" style={{color: '#333333FF'}}>
                  CS180 Cookie Drop
                </p>
              </motion.div>

              {/* Lawson Movie Night */}
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="bg-gray-50 rounded-xl p-6 text-center"
                style={{ willChange: 'transform, box-shadow' }}
              >
                <img
                    src={encodeURI(`${getBasePath()}/initiatives/Social Wellness/LawsonMovieNightFlyer.png`)}
                    alt="Lawson Movie Night"
                    className="rounded-xl w-full mb-4 shadow-lg object-cover"
                    style={{height: '300px', objectFit: 'cover'}}
                    onError={(e) => {
                      console.error('Failed to load CS180 Cookie Drop image');
                    }}
                />
                <h3 className="font-montserrat text-xl font-bold mb-2" style={{color: '#333333FF'}}>
                  Lawson Movie Night
                </h3>
                <p className="font-raleway text-sm mt-2" style={{color: '#333333FF'}}>
                  Lawson Movie Night
                </p>
              </motion.div>

              {/* Freshman Social Hour */}
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="bg-gray-50 rounded-xl p-6 text-center"
                style={{ willChange: 'transform, box-shadow' }}
              >
                <img
                    src={encodeURI(`${getBasePath()}/initiatives/Social Wellness/FreshmanSocialHourFlyer.png`)}
                    alt="Freshman Social Hour"
                    className="rounded-xl w-full mb-4 shadow-lg object-cover"
                    style={{height: '300px', objectFit: 'cover'}}
                    onError={(e) => {
                      console.error('Failed to load CS180 Cookie Drop image');
                    }}
                />
                <h3 className="font-montserrat text-xl font-bold mb-2" style={{color: '#333333FF'}}>
                  Freshman Social Hour
                </h3>
                <p className="font-raleway text-sm mt-2" style={{color: '#333333FF'}}>
                  Freshman Social Hour
                </p>
              </motion.div>

              {/* Puppies For Programmers */}
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="bg-gray-50 rounded-xl p-6 text-center"
                style={{ willChange: 'transform, box-shadow' }}
              >
                <img
                    src={encodeURI(`${getBasePath()}/initiatives/Social Wellness/PuppiesForProgrammersFlyer.png`)}
                    alt="CS180 Cookie Drop"
                    className="rounded-xl w-full mb-4 shadow-lg object-cover"
                    style={{height: '300px', objectFit: 'cover'}}
                    onError={(e) => {
                      console.error('Failed to load CS180 Cookie Drop image');
                    }}
                />
                <h3 className="font-montserrat text-xl font-bold mb-2" style={{color: '#333333FF'}}>
                  Puppies For Programmers
                </h3>
                <p className="font-raleway text-sm mt-2" style={{color: '#333333FF'}}>
                  Puppies For Programmers
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
