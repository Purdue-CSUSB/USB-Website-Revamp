import React from 'react';
import Navbar from '../../Components/Navbar.jsx';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function HelpRoom() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center font-montserrat font-extrabold text-4xl lg:text-5xl mb-10" style={{ color: '#333333FF' }}>
            Help Room
          </h1>

          {/* General Info Section */}
          <div className="mb-12">
            <div className="bg-gray-50 rounded-xl p-8 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="font-montserrat text-xl font-bold mb-3" style={{ color: '#333333FF' }}>
                    Office Hours
                  </h3>
                  <p className="font-raleway text-base leading-relaxed mb-2" style={{ color: '#333333FF' }}>
                    <strong>In-Person:</strong> Monday - Thursday, 11:00 am - 1:00 pm
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
                    In-person sessions are held in the DSAI (Data Science and Artificial Intelligence) lobby by the lockers. Virtual sessions are conducted via Zoom links provided in the schedule below.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-montserrat text-xl font-bold mb-3" style={{ color: '#333333FF' }}>
                  About Help Room
                </h3>
                <p className="font-raleway text-base leading-relaxed" style={{ color: '#333333FF' }}>
                  Help Room's main focus is debugging code and providing tips on how to start assignments rather than going over lecture topics. We guide students toward the correct solution in various projects, labs, and homework. Whenever a student walks in we take a look at their code and try giving them a personal explanation on how to solve the problem.
                </p>
              </div>
            </div>
          </div>

          {/* Apply to be a TA Section */}
          <div className="mb-12 text-center py-8 px-8 rounded-2xl" style={{ backgroundColor: '#FFCA44FF' }}>
            <h2 className="font-montserrat text-3xl font-bold mb-4" style={{ color: '#333333FF' }}>
              Interested in becoming a Help Room TA?
            </h2>
            <p className="font-raleway text-base mb-6 max-w-2xl mx-auto" style={{ color: '#333333FF' }}>
              Join our team of tutors and help fellow students succeed in CS 180, CS 182, and CS 240. Apply through Boiler Hire to become a Help Room Teaching Assistant.
            </p>
            <a
              href="https://courses.cs.purdue.edu/boilerhire/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg font-raleway font-semibold text-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
              style={{ backgroundColor: '#333333FF', color: '#FFFFFF' }}
            >
              Apply on Boiler Hire
            </a>
          </div>

          {/* Schedule Section */}
          <div className="mb-12">
            <h2 className="font-montserrat text-3xl font-bold mb-6" style={{ color: '#333333FF' }}>
              Schedule
            </h2>
            <div className="w-full flex flex-col items-center gap-6">
              {/* Embedded Google Sheets */}
              <div className="w-full" style={{ height: '600px', overflow: 'hidden' }}>
                <iframe
                  src="https://docs.google.com/spreadsheets/d/1jNbWiME4aiHX8pDVexN4xCgzvuL3klvojZD1NO-aRpo/edit?gid=0&rm=minimal&widget=true&headers=false"
                  className="w-full h-full border-0 rounded-xl shadow-lg"
                  title="Help Room Schedule"
                  style={{ minHeight: '600px' }}
                />
              </div>
              {/* Link below Google Sheet */}
              <div className="w-full text-center">
                <a
                  href="https://docs.google.com/spreadsheets/d/1jNbWiME4aiHX8pDVexN4xCgzvuL3klvojZD1NO-aRpo/edit?gid=0#gid=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-raleway text-blue-600 hover:text-blue-800 underline"
                >
                  Open Help Room Schedule in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
