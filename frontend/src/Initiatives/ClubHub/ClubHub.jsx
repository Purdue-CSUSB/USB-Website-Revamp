import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar.jsx';

// Get the base path for assets
const getBasePath = () => {
  return '';
};

export default function ClubHub() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getBasePath()}/initiatives/Club Hub/clubs.json`);
        const data = await res.json();
        setClubs(Array.isArray(data) ? data : []);
      } catch (_) {
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const iconSrc = (type) => {
    switch (type) {
      case 'instagram':
        return encodeURI(`${getBasePath()}/initiatives/Club Hub/instagram.webp`);
      case 'linkedin':
        return encodeURI(`${getBasePath()}/initiatives/Club Hub/linkedin.webp`);
      case 'email':
      default:
        return encodeURI(`${getBasePath()}/initiatives/Club Hub/email.png`);
    }
  };

  const resolveClubLogo = (logoPath) => {
    if (!logoPath) return '';
    if (logoPath.startsWith('http')) return logoPath;
    if (logoPath.startsWith('/')) {
      return encodeURI(`${getBasePath()}${logoPath}`);
    }
    return encodeURI(`${getBasePath()}/${logoPath}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center font-montserrat font-extrabold text-4xl mb-6" style={{ color: '#333333FF' }}>Club Hub</h1>
          <p className="font-raleway text-lg mb-8 text-center" style={{ color: '#333333FF' }}>
            The Club Hub initiative convenes leaders from various CS organizations to exchange advice and pool resources. By fostering collaboration among these groups, the Hub aims to strengthen the CS community and provide valuable opportunities for students to engage and network.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 mb-10">
            <div className="w-full">
              <div className="rounded-xl shadow w-full h-auto overflow-hidden" style={{ boxShadow: '0 0 9px 2px rgb(226 226 226)', minHeight: '260px' }}>
                <div className="w-full p-6 md:p-8">
                  <h2 className="font-montserrat text-2xl font-bold mb-2 text-left" style={{ color: '#333333FF' }}>CS Club Fair</h2>
                  <p className="font-raleway text-sm md:text-base leading-relaxed break-words whitespace-normal text-left" style={{ color: '#333333FF' }}>
                    The CS Club Fair, held biannually by USB, serves as a collaborative platform for CS, DS, and AI clubs at Purdue University. This joint fair aims to streamline the process for students to explore and engage with various student organizations within these fields, fostering community and facilitating connections that enhance students' academic and professional journeys. We provide valuable insights, resources, and connections to support interests and aspirations in computer science, data science, and artificial intelligence.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <img
                src={encodeURI(`${getBasePath()}/initiatives/Club Hub/clubhub.png`)}
                alt="Club Hub"
                className="rounded-xl w-full max-w-xl md:max-w-2xl"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

          <h2 className="text-center font-montserrat font-extrabold text-4xl lg:text-5xl mb-6" style={{ color: '#333333FF' }}>Clubs at Purdue</h2>

          <div className="space-y-8">
            {clubs.map((c, idx) => (
              <div key={`${c.name}-${idx}`} className="flex flex-col md:flex-row items-center md:items-stretch rounded-2xl" style={{ boxShadow: '0 0 9px 2px rgb(226 226 226)' }}>
                <div className="md:w-1/5 w-full p-6 flex items-center justify-center">
                  <img
                    src={resolveClubLogo(c.logo)}
                    alt={c.name}
                    className="rounded-xl"
                    style={{ width: 170, height: 'auto' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="md:w-1/2 w-full px-6 py-6">
                  <p className="font-montserrat text-xl mb-2" style={{ color: '#333333FF' }}><b>{c.name}</b></p>
                  <p className="font-raleway text-sm" style={{ color: '#333333FF' }}>{c.description}</p>
                </div>
                <div className="md:w-1/3 w-full px-6 py-6 flex md:flex-row flex-row md:items-center items-start gap-4">
                  <div className="flex md:flex-col flex-row gap-3 md:w-auto w-1/3">
                    {c.links.map((l, i) => (
                      <img key={`icon-${i}`} src={iconSrc(l.type)} alt={l.type} style={{ width: 40, height: 'auto' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    {c.links.map((l, i) => (
                      <a key={`link-${i}`} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="font-montserrat underline" style={{ color: '#000000F2' }}>
                        <b>{l.label}</b>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


