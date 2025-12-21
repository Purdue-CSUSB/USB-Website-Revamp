import React from 'react';
import Navbar from '../../Components/Navbar.jsx';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function Mentorship() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center font-montserrat font-extrabold text-4xl lg:text-5xl mb-6" style={{ color: '#333333FF' }}>
            Mentorship
          </h1>
          
          <p className="font-raleway text-lg mb-10 text-center max-w-4xl mx-auto leading-relaxed" style={{ color: '#333333FF' }}>
            Mentorship revolves around helping incoming freshman navigate their way through Purdue CS/DS in their first semester. This program pairs upperclassmen and incoming freshman in a group setting with 4-5 mentees per mentor. Mentors can be used to ask any advice regarding Purdue CS on a need-basis, making this program low commitment but high impact for both parties.
          </p>

          {/* Mentor and Mentee Application Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Mentees Section - Left */}
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <h2 className="font-montserrat text-2xl font-bold mb-4" style={{ color: '#333333FF' }}>
                For Mentees
              </h2>
              <p className="font-raleway text-base mb-6 leading-relaxed" style={{ color: '#333333FF' }}>
                Are you an incoming or current freshman looking for guidance? Apply to be paired with an upperclassman mentor who can help you navigate your first semester at Purdue.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdA5_XmqtovSLAxko5OH7vxXq6OSk8sbuBaswuAmKjdpvR4UQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-lg font-raleway font-semibold text-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                style={{ backgroundColor: '#333333FF', color: '#FFFFFF' }}
              >
                Apply as a Mentee
              </a>
            </div>

            {/* Mentors Section - Right */}
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <h2 className="font-montserrat text-2xl font-bold mb-4" style={{ color: '#333333FF' }}>
                For Mentors
              </h2>
              <p className="font-raleway text-base mb-6 leading-relaxed" style={{ color: '#333333FF' }}>
                Are you an upperclassman interested in helping incoming freshmen? Apply to become a mentor and make a positive impact on new students' Purdue experience.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfdMPSUWsInx0LCsnfFbLybcRDFvxYE5bLrEvkRVnxMsVVUqg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-lg font-raleway font-semibold text-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                style={{ backgroundColor: '#333333FF', color: '#FFFFFF' }}
              >
                Apply as a Mentor
              </a>
            </div>
          </div>


          {/* Mentorship Callout Image */}
          <div className="mb-12 text-center">
            <img
                src={encodeURI(`${getBasePath()}/initiatives/Mentorship/MentorshipEvent.png`)}
                alt="International Career Panel"
                className="rounded-xl w-full max-w-4xl mx-auto shadow-lg"
                style={{ height: '400px', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to other images if first one fails
                  e.currentTarget.src = encodeURI(`${getBasePath()}/initiatives/Career Resources/IMG_6846.jpg`);
                }}
            />
            <p className="font-raleway text-base mt-4" style={{ color: '#333333FF' }}>
              Mentorship callout 1
            </p>
          </div>



          {/* Timeline Section */}
          <div className="mb-12">
            <h2 className="font-montserrat text-3xl font-bold mb-6 text-center" style={{ color: '#333333FF' }}>
              Timeline
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg" style={{ border: '1px solid #E5E7EB' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FFCA44FF' }}>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Week
                    </th>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Milestone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week of Aug 25</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Open Mentee Applications</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week of Sep 5</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Mentor Callout #2</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Weeks of Sep 15</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Gather Mentees/Mentors, Conduct Mentor Interviews if Needed</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week of Oct 13</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Finalize Mentor/Mentee Pairings + Initiative Meeting</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4 font-bold" style={{ color: '#333333FF' }}>Week of Oct 13</td>
                    <td className="font-raleway p-4 font-bold" style={{ color: '#333333FF' }}>Mentorship Event #1</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week of Oct 20</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Initiative Meeting</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4 font-bold" style={{ color: '#333333FF' }}>Week of Oct 27</td>
                    <td className="font-raleway p-4 font-bold" style={{ color: '#333333FF' }}>Mentorship Event #2</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week of Nov 3</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Initiative Meeting</td>
                  </tr>
                  <tr>
                    <td className="font-raleway p-4 font-bold" style={{ color: '#333333FF' }}>Week of Nov 17</td>
                    <td className="font-raleway p-4 font-bold" style={{ color: '#333333FF' }}>Mentorship Event #3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </section>
    </div>
  );
}
