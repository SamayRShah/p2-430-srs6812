/* eslint-disable import/no-extraneous-dependencies */
const typography = require("@tailwindcss/typography");
const daisyui = require("daisyui");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: ["dim"],
    darkTheme: "dim",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
  safelist: [
    {
      pattern: /alert-(info|success|warning|error)/,
    },
    {
      pattern: /input-(md|lg|sm|xs)/,
    },
    {
      pattern: /text-(error|white|primary|accent)/,
    },
  ],
};
