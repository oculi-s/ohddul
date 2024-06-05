import { Config } from 'tailwindcss';
// $bgDarker: #030d18;
// $bgDark: #04091e;
// $bgMidDark: #111329;
// $bgMid: #181633;
// $bgMidBright: #16223b;
// $bgBright: #17223d;
// $bgBrighter: #26395e;
// $bgOpacity: #29344b4b;

const tradeColors = {
  50: '#bccff5',
  100: '#26395e',
  200: '#29344b',
  300: '#16223b',
  400: '#17223d',
  500: '#17223d',
  600: '#111024',
  700: '#04091e',
  800: '#030d18',
  900: '#111329',
}

const headerHeight = '60px';
const headerMargin = '60px';
const asideWidth = '350px';
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './module/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      borderWidth: {
        1: '1px',
      },
      colors: {
        trade: tradeColors,
      },
      maxWidth: {
        header: '1300px',
        content: '1400px',
      },
      minWidth: {
        aside: asideWidth,
      },
      width: {
        aside: asideWidth,
      },
      margin: {
        header: headerMargin
      },
      height: {
        header: headerHeight
      }
    },
  },
}

export default config;
