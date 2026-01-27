import React from 'react';
import Navbar from '../../Components/Navbar.jsx';
import Footer from '../../Components/Footer.jsx';
import { motion } from 'framer-motion';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function Panels() {
  return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <section className="py-12 px-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center font-montserrat font-extrabold text-4xl lg:text-5xl mb-6"
                style={{ color: '#333333FF' }}
            >
              Panels
            </motion.h1>

            {/* Intro Paragraph */}
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.03 }}
                className="font-raleway text-lg mb-10 text-center max-w-4xl mx-auto leading-relaxed"
                style={{ color: '#333333FF' }}
            >
              Panels exists for the purpose of planning and hosting various informational panels throughout
              the year to offer guidance to students on various topics. Our panels provide valuable insights
              and practical advice to help students navigate their academic and professional journeys in
              computer science, data science, and artificial intelligence.
            </motion.p>

            {/* Panel Topics Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="mb-12"
            >
              <h2
                  className="font-montserrat text-3xl font-bold mb-6 text-center"
                  style={{ color: '#333333FF' }}
              >
                Panel Topics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="bg-gray-50 rounded-xl p-6"
                  style={{ willChange: 'transform, box-shadow' }}
                >
                  <h3
                      className="font-montserrat text-xl font-bold mb-3"
                      style={{ color: '#333333FF' }}
                  >
                    CS Tracks Information
                  </h3>
                  <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                    Learn about the different computer science tracks available at Purdue, including their
                    requirements, career paths, and how to choose the right track for your interests and goals.
                  </p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="bg-gray-50 rounded-xl p-6"
                  style={{ willChange: 'transform, box-shadow' }}
                >
                  <h3
                      className="font-montserrat text-xl font-bold mb-3"
                      style={{ color: '#333333FF' }}
                  >
                    Alumni Advice
                  </h3>
                  <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                    Hear from Purdue CS/DS/AI alumni about their experiences, career journeys, and advice for
                    current students navigating their academic and professional paths.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Past Panel Events Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.07 }}
              className="mb-12"
            >
              <h2
                  className="font-montserrat text-3xl font-bold mb-6 text-center"
                  style={{ color: '#333333FF' }}
              >
                Past Panel Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Tracks and Degree Panel */}
                <motion.div 
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="rounded-xl p-6 text-center" 
                  style={{ backgroundColor: '#FFCA44FF', willChange: 'transform, box-shadow' }}
                >
                  <div
                      className="rounded-xl w-full mb-4 shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden"
                      style={{ height: '300px' }}
                  >
                    <img
                        src={encodeURI(`${getBasePath()}/initiatives/Panels/TracksAndDegreePanel.png`)}
                        alt="Tracks and Degree Panel"
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.currentTarget.src = encodeURI(
                              `${getBasePath()}/initiatives/Career Resources/IMG_6846.jpg`
                          );
                        }}
                    />
                  </div>
                  <h3 className="font-montserrat text-xl font-bold mb-2" style={{ color: '#333333FF' }}>
                    Tracks and Degree Panel
                  </h3>
                  <p className="font-raleway text-sm" style={{ color: '#333333FF' }}>
                    Week of October 20th
                  </p>
                </motion.div>

                {/* Upperclassmen Panel */}
                <motion.div 
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="rounded-xl p-6 text-center" 
                  style={{ backgroundColor: '#FFCA44FF', willChange: 'transform, box-shadow' }}
                >
                  <div
                      className="rounded-xl w-full mb-4 shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden"
                      style={{ height: '300px' }}
                  >
                    <img
                        src={encodeURI(`${getBasePath()}/initiatives/Panels/UpperclassmenImage.png`)}
                        alt="Upperclassmen Panel"
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          e.currentTarget.src = encodeURI(
                              `${getBasePath()}/initiatives/Career Resources/IMG_6846.jpg`
                          );
                        }}
                    />
                  </div>
                  <h3 className="font-montserrat text-xl font-bold mb-2" style={{ color: '#333333FF' }}>
                    Upperclassmen Panel
                  </h3>
                  <p className="font-raleway text-sm" style={{ color: '#333333FF' }}>
                    Mid November
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
