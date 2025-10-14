import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Contact() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="py-12 px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-montserrat font-bold text-4xl mb-5" style={{ color: '#333333FF' }}>
            What's on your mind?
          </h1>
          <p className="font-raleway mb-2" style={{ color: '#333333FF' }}>
            You can also send us an email at{' '}
            <a href="mailto:usb@purdue.edu" className="underline text-blue-700 hover:text-blue-800">usb@purdue.edu</a>
          </p>
          <p className="font-raleway mb-5" style={{ color: '#333333FF' }}>
            <small className="uppercase font-bold">Note:</small>{' '}
            To report concerns in an official capacity, please go to the{' '}
            <a href="https://my.cs.purdue.edu/undergraduate/concern" target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-800">
              CS Concern Form
            </a>.
          </p>

          <form
            id="fs-frm"
            name="simple-contact-form"
            className="flex flex-col mt-3"
            action="https://formspree.io/xrgyypqw"
            acceptCharset="utf-8"
            method="post"
          >
            <fieldset id="fs-frm-inputs" className="border-0 p-0 m-0">
              <div id="contactForm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <label htmlFor="name" className="font-raleway font-semibold block mb-1" style={{ color: '#333333FF' }}>
                      Your Name<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      id="name"
                      placeholder="Purdue Pete"
                      required
                      className="w-full rounded-md border px-3 py-2"
                      style={{ borderColor: '#9CA3AF' }}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="email" className="font-raleway font-semibold block mb-1" style={{ color: '#333333FF' }}>
                      Email Address<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="_replyto"
                      id="email"
                      placeholder="pete@purdue.edu"
                      required
                      className="w-full rounded-md border px-3 py-2"
                      style={{ borderColor: '#9CA3AF' }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="font-raleway font-semibold block mb-1" style={{ color: '#333333FF' }}>
                    Subject<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="_subject"
                    id="subject"
                    placeholder="What's the gist?"
                    required
                    autoComplete="off"
                    className="w-full rounded-md border px-3 py-2"
                    style={{ borderColor: '#9CA3AF' }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="font-raleway font-semibold block mb-1" style={{ color: '#333333FF' }}>
                    Message<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={5}
                    name="Message"
                    id="message"
                    placeholder="Questions, comments, concerns, suggestions — put 'em here!"
                    required
                    autoComplete="off"
                    className="w-full rounded-md border px-3 py-2"
                    style={{ borderColor: '#9CA3AF' }}
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4 mb-3">
                  <label className="inline-flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" name="acknowledge" id="acknowledge" required className="mt-1" />
                    <span className="font-raleway" style={{ color: '#333333FF' }}>
                      I acknowledge that my message is not guaranteed to be private and may be subject to Indiana mandatory reporting laws.
                      <span className="text-red-600">*</span>
                    </span>
                  </label>
                  <div className="g-recaptcha" data-sitekey="6LfbS60ZAAAAAKxxH0OHgi7840WtuGmHxoO8y_HU"></div>
                </div>
              </div>
            </fieldset>

            <div className="w-full">
              <input
                id="submitButton"
                type="submit"
                value="Send"
                className="w-full px-12 py-3 text-lg rounded-md font-raleway font-semibold border hover:shadow-md transition-transform duration-150 transform hover:scale-[1.03]"
                style={{ backgroundColor: '#FFCA44FF', color: '#000000', borderColor: '#9CA3AF', willChange: 'transform, box-shadow' }}
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}


