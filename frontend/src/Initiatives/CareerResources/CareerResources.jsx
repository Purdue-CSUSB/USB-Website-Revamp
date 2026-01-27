import React from 'react';
import Navbar from '../../Components/Navbar.jsx';
import Footer from '../../Components/Footer.jsx';
import { motion } from 'framer-motion';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function CareerResources() {
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
            Career Resources
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.03 }}
            className="font-raleway text-lg mb-10 text-center max-w-4xl mx-auto leading-relaxed" 
            style={{ color: '#333333FF' }}
          >
            Career Resources works to support Purdue students by providing guidance and opportunities as they navigate their academic and professional journeys. Our programming is designed for international students, those actively searching for jobs, and students interested in building stronger connections with professors outside the classroom. We host informational student panels, networking events with companies that sponsor international students, and "Pizza with Professors" sessions where students can learn more about their favorite CS professors at Purdue in a relaxed setting.          </motion.p>

          {/* International Career Panel Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-8 mb-12"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-center order-2 md:order-1" 
              style={{ minHeight: '400px' }}
            >
              <img
                src={encodeURI(`${getBasePath()}/initiatives/Career Resources/InternationalStudentCareerPanelFlyer.jpg`)}
                alt="International Career Panel"
                className="rounded-xl w-full h-full max-w-lg shadow-lg object-cover"
                style={{ height: '400px', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to other images if first one fails
                  e.currentTarget.src = encodeURI(`${getBasePath()}/initiatives/Career Resources/IMG_6846.jpg`);
                }}
              />
            </motion.div>
            <div className="w-full order-1 md:order-2 flex flex-col justify-center" style={{ minHeight: '400px' }}>
              <h2 className="font-montserrat text-3xl font-bold mb-4" style={{ color: '#333333FF' }}>
                International Career Panel
              </h2>
              <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                Our International Career Panel brings together upperclassmen and CS/DS alumni to share their experiences navigating the job market as international students, along with practical tips and strategies they've learned along the way. The panel offers valuable insights for all students, with a special focus on addressing the unique challenges international students face when securing internships and full-time positions.              </p>
            </div>
          </motion.div>

          {/* Workshops with Companies Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.07 }}
            className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-8 mb-12"
          >
            <div className="w-full flex flex-col justify-center" style={{ minHeight: '400px' }}>
              <h2 className="font-montserrat text-3xl font-bold mb-4" style={{ color: '#333333FF' }}>
                Workshops with Companies
              </h2>
              <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                We also host networking events that connect students with companies, including those that sponsor international students. These events feature group networking sessions where multiple students can speak with recruiters at once and ask questions in a collaborative setting. Students also have the option to participate in 30-minute one-on-one networking sessions with recruiters for more personalized conversations.              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-center" 
              style={{ minHeight: '400px' }}
            >
              <img
                  src={encodeURI(`${getBasePath()}/initiatives/Career Resources/USBXBloombergNetworkingFlyer.png`)}
                  alt="International Career Panel"
                  className="rounded-xl w-full h-full max-w-lg shadow-lg object-cover"
                  style={{ height: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    // Fallback to other images if first one fails
                    e.currentTarget.src = encodeURI(`${getBasePath()}/initiatives/Career Resources/IMG_6846.jpg`);
                  }}
              />
            </motion.div>
          </motion.div>

          {/* Pizza with Professors Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.09 }}
            className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-8 mb-12"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-center order-2 md:order-1" 
              style={{ minHeight: '400px' }}
            >
              <img
                src={encodeURI(`${getBasePath()}/initiatives/Career Resources/PizzaWithProfessorGustavoFlyer.png`)}
                alt="Pizza with Professors"
                className="rounded-xl w-full h-full max-w-lg shadow-lg object-cover"
                style={{ height: '400px', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to other images if first one fails
                  e.currentTarget.src = encodeURI(`${getBasePath()}/initiatives/Career Resources/IMG_6846.jpg`);
                }}
              />
            </motion.div>
            <div className="w-full order-1 md:order-2 flex flex-col justify-center" style={{ minHeight: '400px' }}>
              <h2 className="font-montserrat text-3xl font-bold mb-4" style={{ color: '#333333FF' }}>
                Pizza with Professors
              </h2>
              <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                Pizza with Professors is an engaging event that brings students and faculty together in an informal setting. Students have the opportunity to learn about professors' teaching philosophies, research interests, and experiences in the field of computer science. Through these events, we aim to foster meaningful connections between students and faculty by providing a relaxed environment for questions, discussion, and open conversation.
              </p>
            </div>
          </motion.div>

          {/* Interested in Working with Us Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.11 }}
            className="text-center mt-16 py-12 px-8 rounded-2xl" 
            style={{ backgroundColor: '#FFCA44FF' }}
          >
            <h2 className="font-montserrat text-3xl font-bold mb-4" style={{ color: '#333333FF' }}>
              Interested in working with us?
            </h2>
            <p className="font-raleway text-sm mb-6" style={{ color: '#333333FF' }}>
              Are you a club or company interested in working with us? Fill out the form below!
            </p>
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              href="https://forms.gle/YOUR_FORM_ID_HERE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg font-raleway font-semibold text-lg"
              style={{ backgroundColor: '#333333FF', color: '#FFFFFF', willChange: 'transform, box-shadow' }}
            >
              Partner with Us
            </motion.a>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
