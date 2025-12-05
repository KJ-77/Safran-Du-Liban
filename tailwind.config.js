/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C48C4A",
        secondary: "#202b52",
        background: "#FFFCF7",
      },
      spacing: {
        primary: "9.2rem",
        secondary: "5.2rem",
      },
    },
    fontFamily: {
      name1: [""],
      name2: [""],
    },

    screens: {
      xs: "320px",
      xsm: "380px",
      ss: "420px",
      sxs: "480px",
      bxs: "540px",
      sm: "578px",
      sms: "610px",
      ssm: "680px",
      md: "768px",
      mds: "840px",
      lds: "900px",
      lg: "992px",
      xl: "1200px",
      xxl: "1440px",
      xll: "1550px",
      xxll: "1750px",
    },
  },
  plugins: [],
};
