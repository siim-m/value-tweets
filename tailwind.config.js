module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./**/*.js', './**/*.jsx'],
  theme: {
    extend: {
      animation: {
        'spin-once': 'spin 0.6s linear 1',
      },
      fontFamily: {
        sans: 'Rubik, Helvetica, Arial, sans-serif',
      },
    },
  },
  variants: {},
  plugins: [],
};
