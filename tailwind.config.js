module.exports = {
  content: [
    './App.js',
    './components/**/*.{js,jsx}',
    './screens/**/*.{js,jsx}',
    './utils/**/*.{js,jsx}',
    './db/**/*.{js,jsx}'
  ],
  presets: [require('nativewind/preset')],
  theme: { extend: {} },
  plugins: [],
};
