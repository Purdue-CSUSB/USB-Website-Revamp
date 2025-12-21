import React from 'react';
import Navbar from '../../Components/Navbar.jsx';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function TownHall() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center font-montserrat font-extrabold text-4xl lg:text-5xl mb-6" style={{ color: '#333333FF' }}>
            Student Forum / Town Hall
          </h1>
          
          <p className="font-raleway text-lg mb-10 text-center max-w-4xl mx-auto leading-relaxed" style={{ color: '#333333FF' }}>
            The CS Undergraduate Student Forum is an opportunity for students to present feedback and concerns about classes, professors, curricula, career resources, TAs, etc. in a student-led environment. Each Student Forum is followed by either an Undergraduate Town Hall or a meeting with the department leadership where the concerns from the forum will be compiled, anonymized, and presented. This forum is one of the best ways to get any pressing issues resolved quickly and formally.
          </p>

          {/* Fall Semester Timeline */}
          <div className="mb-12">
            <h2 className="font-montserrat text-3xl font-bold mb-6 text-center" style={{ color: '#333333FF' }}>
              Fall Semester Timeline
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg" style={{ border: '1px solid #E5E7EB' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FFCA44FF' }}>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Timeframe
                    </th>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Event / Milestone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Week of Oct 9-17</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>
                      <strong>Student Forum</strong> - Collect student feedback and concerns. Heavily promote filling out mid-semester evaluations. Allocate time at the end for filling out evaluations.
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Within a week of Student Forum</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>
                      <strong>Meeting with Department</strong> - Discuss town hall from previous semester and new student forum responses.
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>October 18th</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>
                      <strong>Town Hall</strong> - Present compiled and anonymized student concerns to department leadership and faculty.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Spring Semester Timeline */}
          <div className="mb-12">
            <h2 className="font-montserrat text-3xl font-bold mb-6 text-center" style={{ color: '#333333FF' }}>
              Spring Semester Timeline
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg" style={{ border: '1px solid #E5E7EB' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FFCA44FF' }}>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Timeframe
                    </th>
                    <th className="font-montserrat font-bold text-left p-4" style={{ color: '#333333FF', borderBottom: '2px solid #E5E7EB' }}>
                      Event / Milestone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Mid-February</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>
                      <strong>Student Forum</strong> - Collect new student feedback and concerns. Encourage students to fill out mid-semester evaluations.
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Within a week of Student Forum</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>
                      <strong>Meeting with Department</strong> - Discuss town hall from previous semester and new forum responses.
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>Early April</td>
                    <td className="font-raleway p-4" style={{ color: '#333333FF' }}>
                      <strong>Town Hall</strong> - Present compiled and anonymized student concerns to department leadership and faculty.
                    </td>
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
