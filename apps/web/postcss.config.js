/**
 * PostCSS configuration.
 *
 * Tailwind CSS uses PostCSS under the hood.  Autoprefixer will ensure
 * vendor prefixes are added where necessary to maximise browser
 * compatibility.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
