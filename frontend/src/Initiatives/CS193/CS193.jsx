import React from 'react';
import Navbar from '../../Components/Navbar.jsx';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function CS193() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center font-montserrat font-extrabold text-4xl lg:text-5xl mb-6" style={{ color: '#333333FF' }}>
            CS193
          </h1>
          
          {/* Description and Image Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-12">
            <div className="w-full flex items-center justify-center order-2 md:order-1">
              <img
                src={encodeURI(`${getBasePath()}/initiatives/CS193/CS193IntroSlide.png`)}
                alt="CS193"
                className="rounded-xl w-full max-w-lg shadow-lg"
                onError={(e) => {
                  console.error('Failed to load CS193 image');
                }}
              />
            </div>
            <div className="w-full flex flex-col justify-center order-1 md:order-2">
              <p className="font-raleway text-lg leading-relaxed" style={{ color: '#333333FF' }}>
                CS193 is a 1-credit introductory CS course designed to introduce first-year students to essential tools in computer science. Organized and taught by USB members, the course covers foundational software engineering tools (such as Linux, GitHub, and the shell) to support students at the start of their CS, DS, or AI journey at Purdue University.              </p>
            </div>
          </div>

          {/* Lecture Schedule Section */}
          <div className="mb-12">
            <h2 className="font-montserrat text-3xl font-bold mb-6 text-center" style={{ color: '#333333FF' }}>
              Lecture Schedule
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg" style={{ border: '1px solid #E5E7EB' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FFCA44FF' }}>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Lecture
                    </th>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Week Of...
                    </th>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Topics
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 1</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 1</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Welcome to CS193! (Syllabus, Ed Discussion Etiquette, Github Classroom), What is terminal?</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 2</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 2</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Basic Terminal Commands, Linux, Text Editors</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 3</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 3</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Resumes, Career Fairs</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 4</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 4</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Working Remotely, VPN, Introduction to IDEs, Intro to Coding Standards</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 5</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 5</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Debugging (Debuggers, print statements), Testing Code</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 6</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 6</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Version Control Systems (Git, Github)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 7</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 7</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>GitHub (cont.), Branching and Forking</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 8</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 8</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Merge Conflicts</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 9</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 9</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Advanced terminal commands, LaTeX</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 10</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 10</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Interviews (Behavioral and Technical)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 11</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 11</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Tracks and Degree Plans</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 12</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 12</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Topics from CS 182</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 13</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 13</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Topics from CS 240, 242, 243</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Lecture 14</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week 14</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Anything lecture + Q&A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Homework Schedule Section */}
          <div className="mb-12">
            <h2 className="font-montserrat text-3xl font-bold mb-6 text-center" style={{ color: '#333333FF' }}>
              Homework Schedule
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg" style={{ border: '1px solid #E5E7EB' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FFCA44FF' }}>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Assignment
                    </th>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Topic
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Homework 0</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Syllabus/GitHub Classroom - Create Account + Website</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Homework 1</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Terminal Commands</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Homework 2</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Debugging</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Homework 3</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Git vs. GitHub</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Homework 4</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Merge Conflicts</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Homework 5</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>LaTeX</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Homework 6</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>CS 182 topics</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Extra Credit</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>PyCharm, JDB, Code Standards, Valgrind, Complex Terminal commands</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Apply to be a TA Section */}
          <div className="mb-12 text-center py-8 px-8 rounded-2xl" style={{ backgroundColor: '#FFCA44FF' }}>
            <h2 className="font-montserrat text-3xl font-bold mb-4" style={{ color: '#333333FF' }}>
              Interested in becoming a CS193 TA?
            </h2>
            <p className="font-raleway text-base mb-6 max-w-2xl mx-auto" style={{ color: '#333333FF' }}>
              Join our team and help teach essential software engineering tools to first-year students. Apply through Boiler Hire to become a CS193 Teaching Assistant.
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
        </div>
      </section>
    </div>
  );
}
