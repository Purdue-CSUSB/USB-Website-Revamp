/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'usb-yellow': '#FFCA44FF',
        'usb-black': '#000000F2',
        'usb-white': '#FFFFFFFF',
        'usb-black-bg': '#0000003F',
        'usb-grey': '#333333FF',
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
