/**
 * PostCSS configuration.
 *
 * Tailwind CSS uses PostCSS under the hood.  Autoprefixer will ensure
 * vendor prefixes are added where necessary to maximise browser
 * compatibility.
 */
/**
 * PostCSS configuration in ECMAScript module format.
 *
 * Next.js treats .js files as ES modules when the project sets
 * "type": "module" in package.json. To avoid the "module is not defined"
 * error at build time, we export the configuration using `export default`.
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
