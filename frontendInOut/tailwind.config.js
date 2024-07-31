/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react")
import withMT from "@material-tailwind/react/utils/withMT";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    /* screens: {
      'mobile': "576px",
      'tablet': "768px",
      'laptop': "992px",
      'desktop': "1200px",
    } */
  },
  darkMode: "class",
  plugins: [
    nextui(),
    function ({ addUtilities }) {
      addUtilities({
        '.hidden-scrollbar': {
          overflow: 'scroll',
          '-ms-overflow-style': 'none',  // IE y Edge
          'scrollbar-width': 'none'  // Firefox
        },
        '.hidden-scrollbar::-webkit-scrollbar': {
          display: 'none'  // Webkit (Chrome, Safari)
        }
      }, ['responsive'])
    }],
}

