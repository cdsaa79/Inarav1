/**
 * Tailwind CSS configuration.
 *
 * This file defines which folders Tailwind should scan for class names and
 * allows you to extend the default theme.  Feel free to customise the
 * theme to reflect INARA's visual identity.  See the Tailwind docs for
 * details: https://tailwindcss.com/docs/configuration.
 */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
