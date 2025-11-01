/**
 * Tailwind CSS configuration.
 *
 * This file uses the CommonJS (.cjs) extension to avoid ESM-related
 * issues when the project sets "type": "module" in package.json.
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