/**
 * PostCSS configuration for Next.js and Tailwind.
 *
 * Keeping this file in CommonJS (.cjs) format ensures that Node
 * correctly interprets it even when the project sets "type": "module"
 * in package.json.  Next.js's PostCSS loader expects the configuration
 * object to be exported via `module.exports` with a `plugins` key.
 */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};