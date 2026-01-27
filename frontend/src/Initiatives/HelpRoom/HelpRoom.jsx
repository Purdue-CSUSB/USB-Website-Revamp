import { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar.jsx';
import Footer from '../../Components/Footer.jsx';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'helproom-checkin-submitted';
const DSAI_MAPS_LINK = 'https://maps.app.goo.gl/okjBeYTmFwdubUJt5';
const GOOGLE_FORM_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSdHIeDWH19bZ0J9UsDkCvu7z75RwxH1WIAjPbe6JnuKYDgkGg/viewform?usp=header';

// TA schedule data - days: 1=Mon, 2=Tue, 3=Wed, 4=Thu
const taSchedule = [
  {
    name: "Alex Tu",
    email: "tu96@purdue.edu",
    courses: ["CS180", "CS182"],
    zoomLink: "https://purdue-edu.zoom.us/j/5068092725",
    schedule: [
      { day: 1, startHour: 10, endHour: 12, type: "virtual" },
      { day: 2, startHour: 10, endHour: 12, type: "virtual" },
      { day: 3, startHour: 10, endHour: 12, type: "virtual" },
      { day: 4, startHour: 10, endHour: 12, type: "virtual" },
    ]
  },
  {
    name: "Arman Kumar",
    email: "kumar538@purdue.edu",
    courses: ["CS180", "CS182", "CS240"],
    zoomLink: "https://purdue-edu.zoom.us/j/6446687687",
    schedule: [
      { day: 2, startHour: 10, endHour: 13, type: "virtual" },
      { day: 4, startHour: 10, endHour: 13, type: "virtual" },
    ]
  },
  {
    name: "Hanako Keney",
    email: "hkeney@purdue.edu",
    courses: ["CS180", "CS182", "CS240"],
    zoomLink: "https://purdue-edu.zoom.us/j/7809742161",
    schedule: [
      { day: 1, startHour: 11, endHour: 14, type: "in-person" },
      { day: 3, startHour: 12, endHour: 13, type: "in-person" },
      { day: 4, startHour: 11, endHour: 14, type: "in-person" },
    ]
  },
  {
    name: "Kevin Huang",
    email: "huan2005@purdue.edu",
    courses: ["CS180", "CS182", "CS240"],
    zoomLink: "https://purdue-edu.zoom.us/j/2697781261",
    schedule: [
      { day: 1, startHour: 12, endHour: 13, type: "in-person" },
      { day: 2, startHour: 12, endHour: 14, type: "in-person" },
      { day: 3, startHour: 12, endHour: 13, type: "in-person" },
      { day: 4, startHour: 12, endHour: 14, type: "in-person" },
    ]
  },
  {
    name: "Neena Naikar",
    email: "nnaikar@purdue.edu",
    courses: ["CS180", "CS240"],
    zoomLink: "https://purdue-edu.zoom.us/my/neenanaikar",
    schedule: [
      { day: 1, startHour: 11, endHour: 14, type: "virtual" },
      { day: 3, startHour: 11, endHour: 14, type: "virtual" },
    ]
  },
  {
    name: "Naunidha Sawhney",
    email: "nsawhne@purdue.edu",
    courses: ["CS180", "CS182", "CS240"],
    zoomLink: "https://purdue-edu.zoom.us/j/9542724715",
    schedule: [
      { day: 1, startHour: 19, endHour: 20, type: "virtual" },
      { day: 1, startHour: 21, endHour: 22, type: "virtual" },
      { day: 2, startHour: 21, endHour: 22, type: "virtual" },
      { day: 3, startHour: 19, endHour: 20, type: "virtual" },
      { day: 3, startHour: 21, endHour: 22, type: "virtual" },
      { day: 4, startHour: 21, endHour: 22, type: "virtual" },
    ]
  },
  {
    name: "Peter Kurto",
    email: "pkurto@purdue.edu",
    courses: ["CS182", "CS240"],
    zoomLink: "https://us05web.zoom.us/j/4158878032?pwd=EaogwZ8ZTaNCs9Ez25O5RxbkvC2Aub.1",
    schedule: [
      { day: 2, startHour: 19, endHour: 22, type: "virtual" },
      { day: 3, startHour: 19, endHour: 22, type: "virtual" },
    ]
  },
  {
    name: "Ji Bing Ni",
    email: "ni121@purdue.edu",
    courses: ["CS180", "CS240"],
    zoomLink: "https://purdue-edu.zoom.us/j/6618402774",
    schedule: [
      { day: 2, startHour: 19, endHour: 21, type: "virtual" },
      { day: 3, startHour: 19, endHour: 21, type: "virtual" },
      { day: 4, startHour: 19, endHour: 21, type: "virtual" },
    ]
  },
  {
    name: "Devansh Khandelwal",
    email: "khanded@purdue.edu",
    courses: ["CS182"],
    zoomLink: "https://purdue-edu.zoom.us/j/5267503911",
    schedule: [
      { day: 1, startHour: 18, endHour: 19, type: "virtual" },
      { day: 2, startHour: 18, endHour: 20, type: "virtual" },
      { day: 3, startHour: 18, endHour: 19, type: "virtual" },
      { day: 4, startHour: 18, endHour: 20, type: "virtual" },
    ]
  },
];

// Helper function to get available TAs for a specific day and hour
const getAvailableTAs = (day, hour) => {
  return taSchedule.filter(ta =>
    ta.schedule.some(slot =>
      slot.day === day &&
      hour >= slot.startHour &&
      hour < slot.endHour
    )
  ).map(ta => {
    const matchingSlot = ta.schedule.find(slot =>
      slot.day === day &&
      hour >= slot.startHour &&
      hour < slot.endHour
    );
    return { ...ta, currentType: matchingSlot?.type };
  });
};

const dayOptions = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
];

const hourOptions = [
  { value: 10, label: "10:00 AM" },
  { value: 11, label: "11:00 AM" },
  { value: 12, label: "12:00 PM" },
  { value: 13, label: "1:00 PM" },
  { value: 18, label: "6:00 PM" },
  { value: 19, label: "7:00 PM" },
  { value: 20, label: "8:00 PM" },
  { value: 21, label: "9:00 PM" },
];

// Helper to format hour to readable time
const formatHour = (hour) => {
  if (hour === 12) return '12:00 PM';
  if (hour === 0) return '12:00 AM';
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
};

export default function HelpRoom() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedHour, setSelectedHour] = useState(10);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableTAs, setAvailableTAs] = useState([]);

  // Store the searched values separately so display doesn't change until button is clicked
  const [searchedDay, setSearchedDay] = useState(1);
  const [searchedHour, setSearchedHour] = useState(10);

  // Modal state for Google Form confirmation
  const [showModal, setShowModal] = useState(false);
  const [pendingLink, setPendingLink] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setHasCheckedIn(true);
    }
  }, []);

  const handleTAClick = (ta, type) => {
    const targetLink = type === 'virtual' ? ta.zoomLink : DSAI_MAPS_LINK;

    if (hasCheckedIn) {
      // Already checked in, proceed directly
      window.open(targetLink, '_blank');
    } else {
      // Open Google Form first, then show confirmation modal
      window.open(GOOGLE_FORM_LINK, '_blank');
      setPendingLink(targetLink);
      setShowModal(true);
    }
  };

  const handleConfirmSubmitted = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasCheckedIn(true);
    setShowModal(false);
    if (pendingLink) {
      window.open(pendingLink, '_blank');
    }
    setPendingLink(null);
  };

  const handleSearch = () => {
    setAvailableTAs(getAvailableTAs(selectedDay, selectedHour));
    setSearchedDay(selectedDay);
    setSearchedHour(selectedHour);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center font-montserrat font-extrabold text-4xl lg:text-5xl mb-10"
            style={{ color: '#333333FF' }}
          >
            Help Room
          </motion.h1>

          {/* General Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.03 }}
            className="mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-gray-50 rounded-xl p-8 mb-6"
              style={{ willChange: 'transform, box-shadow' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-montserrat text-xl font-bold mb-3" style={{ color: '#333333FF' }}>
                    Office Hours
                  </h3>
                  <p className="font-raleway text-base leading-relaxed mb-2" style={{ color: '#333333FF' }}>
                    <strong>In-Person:</strong> Monday - Thursday, 11:00 am - 2:00 pm
                  </p>
                  <p className="font-raleway text-base leading-relaxed mb-2" style={{ color: '#333333FF' }}>
                    <strong>Virtual:</strong> Monday - Thursday, 10:00 am - 2:00 pm and 6:00 pm - 10:00 pm
                  </p>
                </div>
                <div>
                  <h3 className="font-montserrat text-xl font-bold mb-3" style={{ color: '#333333FF' }}>
                    Location
                  </h3>
                  <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                    In-person sessions are held in the DSAI (Data Science and Artificial Intelligence) lobby. If you walk in through the doors from the engineering fountain and look left there should be tables with our TAs. Virtual sessions are conducted via Zoom links provided below.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-montserrat text-xl font-bold mb-3" style={{ color: '#333333FF' }}>
                  About Help Room
                </h3>
                <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                  We offer additional office hours for CS180, CS182, CS193, and CS240. Help Room's main focus is debugging code and providing tips for completing assignments rather than going over lecture topics. We guide students toward the correct solution in various projects, labs, and homework. Whenever a student walks in we take a look at their code and try giving them a personal explanation on how to solve the problem.
                </p>
                <p className="font-raleway text-base leading-relaxed mt-4" style={{ color: '#333333FF' }}>
                  If you have any questions or concerns, please reach out to Tristan (<a href="mailto:tsze@purdue.edu" className="text-blue-600 hover:text-blue-800 underline">tsze@purdue.edu</a>) and Philip (<a href="mailto:liu3688@purdue.edu" className="text-blue-600 hover:text-blue-800 underline">liu3688@purdue.edu</a>).
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Apply to be a TA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.09 }}
            className="mb-12 text-center py-8 px-8 rounded-2xl"
            style={{ backgroundColor: '#FFCA44FF' }}
          >
            <h2 className="font-montserrat text-3xl font-bold mb-4" style={{ color: '#333333FF' }}>
              Interested in becoming a Help Room TA?
            </h2>
            <p className="font-raleway text-base mb-6 max-w-2xl mx-auto" style={{ color: '#333333FF' }}>
              Join our team of tutors and help fellow students succeed! Apply through BoilerHire towards the end of each semester to become a Help Room Teaching Assistant.
            </p>
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              href="https://courses.cs.purdue.edu/boilerhire/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg font-raleway font-semibold text-lg"
              style={{ backgroundColor: '#333333FF', color: '#FFFFFF', willChange: 'transform, box-shadow' }}
            >
              Apply on BoilerHire
            </motion.a>
          </motion.div>

          {/* Help Room Flyer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04 }}
            className="mb-12 flex justify-center"
          >
            <motion.img
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              src="/Instagram Posts/images/help-room-flyer-2026.png"
              alt="Help Room Spring 2026 - Now Open!"
              className="rounded-xl shadow-lg max-w-md w-full"
              style={{ willChange: 'transform' }}
            />
          </motion.div>

          {/* Find a TA Section */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.07 }}
              className="mb-12"
            >
              <h2 className="font-montserrat text-3xl font-bold mb-6" style={{ color: '#333333FF' }}>
                Find a TA
              </h2>
              <p className="font-raleway text-base mb-6" style={{ color: '#333333FF' }}>
                Select a day and time to see which TAs are available during that hour.
              </p>

              {/* Time Picker */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block font-montserrat font-semibold text-sm mb-2" style={{ color: '#333333FF' }}>
                    Day
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 font-raleway text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {dayOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-montserrat font-semibold text-sm mb-2" style={{ color: '#333333FF' }}>
                    Time
                  </label>
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 font-raleway text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    {hourOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -2px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onClick={handleSearch}
                  className="px-8 py-3 rounded-lg font-raleway font-semibold text-base"
                  style={{ backgroundColor: '#FFCA44FF', color: '#333333FF', willChange: 'transform, box-shadow' }}
                >
                  Find Available TAs
                </motion.button>
              </div>
            </div>

            {/* Available TAs Results */}
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-montserrat text-xl font-bold mb-4" style={{ color: '#333333FF' }}>
                  Available TAs for {dayOptions.find(d => d.value === searchedDay)?.label}, {formatHour(searchedHour)} - {formatHour(searchedHour + 1)}
                </h3>

                {availableTAs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableTAs.map((ta, index) => (
                      <motion.div
                        key={ta.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
                        className="bg-white rounded-xl p-6 border border-gray-200"
                        style={{ willChange: 'transform, box-shadow' }}
                      >
                        <h4 className="font-montserrat text-lg font-bold mb-1" style={{ color: '#333333FF' }}>
                          {ta.name}
                        </h4>
                        <a
                          href={`mailto:${ta.email}`}
                          className="font-raleway text-sm text-blue-600 hover:text-blue-800 underline mb-3 block"
                        >
                          {ta.email}
                        </a>

                        {/* Courses */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {ta.courses.map(course => (
                            <span
                              key={course}
                              className="px-2 py-1 rounded text-xs font-semibold bg-gray-100"
                              style={{ color: '#333333FF' }}
                            >
                              {course}
                            </span>
                          ))}
                        </div>

                        {/* Virtual or In-Person Badge */}
                        {ta.currentType === 'virtual' ? (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTAClick(ta, 'virtual')}
                            className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 rounded-lg font-raleway font-semibold text-sm cursor-pointer"
                            style={{ backgroundColor: '#2D8CFF', color: '#FFFFFF' }}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm16 3.5v7l4-3.5-4-3.5z"/>
                            </svg>
                            Virtual - Join Zoom
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTAClick(ta, 'in-person')}
                            className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 rounded-lg font-raleway font-semibold text-sm cursor-pointer"
                            style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
                            </svg>
                            In-Person - DSAI Lobby
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="font-raleway text-lg mb-2" style={{ color: '#333333FF' }}>
                      No TAs available at this time.
                    </p>
                    <p className="font-raleway text-base" style={{ color: '#666666' }}>
                      Please try selecting a different day or time.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

              {/* Full Schedule Link */}
              <div className="text-center mt-8">
                <a
                  href="https://docs.google.com/spreadsheets/d/1cL226JWxHXD82kAZvgQtbw1aLsdM5DyDBBqFCNrOiqY/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-raleway text-blue-600 hover:text-blue-800 underline"
                >
                  View Full Help Room Schedule
                </a>
              </div>
            </motion.div>
        </div>
      </section>
      <Footer />

      {/* Google Form Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-8 max-w-md w-full text-center"
          >
            <h2 className="font-montserrat text-2xl font-bold mb-4" style={{ color: '#333333FF' }}>
              Quick Check-In
            </h2>
            <p className="font-raleway text-base mb-6" style={{ color: '#666666' }}>
              A Google Form has opened in a new tab. Please complete it to help us improve Help Room, then click the button below to continue.
            </p>
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmSubmitted}
                className="w-full px-8 py-3 rounded-lg font-raleway font-semibold text-lg"
                style={{ backgroundColor: '#FFCA44FF', color: '#333333FF' }}
              >
                I've Submitted the Form
              </motion.button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setPendingLink(null);
                }}
                className="font-raleway text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
