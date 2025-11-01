/**
 * Tailwind CSS configuration.
 *
 * This file defines which folders Tailwind should scan for class names and
 * allows you to extend the default theme.  Feel free to customise the
 * theme to reflect INARA's visual identity.  See the Tailwind docs for
 * details: https://tailwindcss.com/docs/configuration.
 */
/**
 * Tailwind CSS configuration in ECMAScript module format.
 *
 * Since the project uses ESM (type: "module"), we export the config using
 * `export default` instead of CommonJS `module.exports`. This avoids the
 * "module is not defined" error during the Next.js build.
 */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
