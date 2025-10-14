import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return true;
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      console.log('Screen width:', width, 'Is mobile:', mobile);
      setIsMobile(mobile);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const linkBaseClass = "group inline-block font-raleway text-2xl transition-transform duration-150 transform hover:scale-[1.04]";
  const linkStyle = { color: '#000000F2', fontWeight: 600, willChange: 'transform' };

  return (
    <nav className="px-8 py-1 shadow-lg relative" style={{ backgroundColor: '#FFCA44FF' }}>
      <div className="w-full flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img 
            src="/Logos & Icons/usb logos/USB_Long_Logo_Black_White.svg" 
            alt="USB Logo" 
            className="h-24 w-10"
            style={{ width: '300px', cursor: 'pointer' }}
          />
        </a>

        {isMobile && (
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((s) => !s)}
            className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-0"
            style={{ color: '#000000F2', backgroundColor: 'transparent' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              {isOpen ? (
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3.75 6.75A.75.75 0 014.5 6h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        )}

        {!isMobile && (
          <div className="flex space-x-8">
          <a href="/initiatives/blog" className={linkBaseClass} style={linkStyle}>
            <span className="relative">
              Blog
              <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </span>
          </a>
          <a href="/student-wiki" className={linkBaseClass} style={linkStyle}>
            <span className="relative">
              Student Wiki
              <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </span>
          </a>
          <a href="https://usb.notion.site/fc8013a0d21a4483982d126cad0c372f?v=c2423acbb3f54dca8e902e84c013aa05" target="_blank" rel="noopener noreferrer" className={linkBaseClass} style={linkStyle}>
            <span className="relative">
              Tutor List
              <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </span>
          </a>
          <a href="/initiatives" className={linkBaseClass} style={linkStyle}>
            <span className="relative">
              Initiatives
              <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </span>
          </a>
          <a href="/contact" className={linkBaseClass} style={linkStyle}>
            <span className="relative">
              Contact Us
              <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </span>
          </a>
          </div>
        )}
      </div>

      {isOpen && isMobile && (
        <div id="mobile-menu" className="absolute left-0 right-0 top-full shadow-lg z-50" style={{ backgroundColor: '#FFCA44FF' }} role="menu" aria-label="Mobile navigation">
          <div className="flex flex-col">
            <a 
              href="/initiatives/blog" 
              className="group px-6 py-4 font-raleway text-xl border-b transition-transform duration-150 hover:scale-[1.02]" 
              style={{ 
                color: '#000000F2', 
                fontWeight: 600, 
                borderColor: '#00000011',
                textDecoration: 'none',
                textDecorationColor: 'transparent',
                textDecorationLine: 'none',
                textDecorationStyle: 'solid',
                textDecorationThickness: '0px',
                textUnderlineOffset: '0px',
                textUnderlinePosition: 'under',
                WebkitTextDecoration: 'none',
                MozTextDecoration: 'none',
                msTextDecoration: 'none'
              }} 
              role="menuitem" 
              onClick={() => setIsOpen(false)}
            >
              <span className="relative">
                Blog
                <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </span>
            </a>
            <a 
              href="/student-wiki" 
              className="group px-6 py-4 font-raleway text-xl border-b transition-transform duration-150 hover:scale-[1.02]" 
              style={{ 
                color: '#000000F2', 
                fontWeight: 600, 
                borderColor: '#00000011',
                textDecoration: 'none',
                textDecorationColor: 'transparent',
                textDecorationLine: 'none',
                textDecorationStyle: 'solid',
                textDecorationThickness: '0px',
                textUnderlineOffset: '0px',
                textUnderlinePosition: 'under',
                WebkitTextDecoration: 'none',
                MozTextDecoration: 'none',
                msTextDecoration: 'none'
              }} 
              role="menuitem" 
              onClick={() => setIsOpen(false)}
            >
              <span className="relative">
                Student Wiki
                <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </span>
            </a>
            <a 
              href="https://usb.notion.site/fc8013a0d21a4483982d126cad0c372f?v=c2423acbb3f54dca8e902e84c013aa05" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group px-6 py-4 font-raleway text-xl border-b transition-transform duration-150 hover:scale-[1.02]" 
              style={{ 
                color: '#000000F2', 
                fontWeight: 600, 
                borderColor: '#00000011',
                textDecoration: 'none',
                textDecorationColor: 'transparent',
                textDecorationLine: 'none',
                textDecorationStyle: 'solid',
                textDecorationThickness: '0px',
                textUnderlineOffset: '0px',
                textUnderlinePosition: 'under',
                WebkitTextDecoration: 'none',
                MozTextDecoration: 'none',
                msTextDecoration: 'none'
              }} 
              role="menuitem" 
              onClick={() => setIsOpen(false)}
            >
              <span className="relative">
                Tutor List
                <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </span>
            </a>
            <a 
              href="/initiatives" 
              className="group px-6 py-4 font-raleway text-xl border-b transition-transform duration-150 hover:scale-[1.02]" 
              style={{ 
                color: '#000000F2', 
                fontWeight: 600, 
                borderColor: '#00000011',
                textDecoration: 'none',
                textDecorationColor: 'transparent',
                textDecorationLine: 'none',
                textDecorationStyle: 'solid',
                textDecorationThickness: '0px',
                textUnderlineOffset: '0px',
                textUnderlinePosition: 'under',
                WebkitTextDecoration: 'none',
                MozTextDecoration: 'none',
                msTextDecoration: 'none'
              }} 
              role="menuitem" 
              onClick={() => setIsOpen(false)}
            >
              <span className="relative">
                Initiatives
                <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </span>
            </a>
            <a 
              href="/contact" 
              className="group px-6 py-4 font-raleway text-xl transition-transform duration-150 hover:scale-[1.02]" 
              style={{ 
                color: '#000000F2', 
                fontWeight: 600,
                textDecoration: 'none',
                textDecorationColor: 'transparent',
                textDecorationLine: 'none',
                textDecorationStyle: 'solid',
                textDecorationThickness: '0px',
                textUnderlineOffset: '0px',
                textUnderlinePosition: 'under',
                WebkitTextDecoration: 'none',
                MozTextDecoration: 'none',
                msTextDecoration: 'none'
              }} 
              role="menuitem" 
              onClick={() => setIsOpen(false)}
            >
              <span className="relative">
                Contact Us
                <span className="absolute left-0 -bottom-1 block w-full h-0.5 bg-[#000000F2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
