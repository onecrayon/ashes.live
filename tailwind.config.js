module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
  ],
  theme: {
    colors: {
      black: 'var(--color-black)',
      gray: {
        default: 'var(--color-gray)',
        light: 'var(--color-gray-light)',
        dark: 'var(--color-gray-dark)',
        darker: 'var(--color-gray-darker)',
      },
      white: 'var(--color-white)',
      blue: {
        default: 'var(--color-blue)',
        dark: 'var(--color-blue-dark)',
      },
      red: {
        default: 'var(--color-red)',
        light: 'var(--color-red-light)',
      },
      orange: 'var(--color-orange)',
      green: {
        default: 'var(--color-green)',
        light: 'var(--color-green-light)',
      },
      // Special coloring schemes specific to Ashes card behavior
      inexhaustible: {
        default: 'var(--color-inexhaustible)',
        dark: 'var(--color-inexhaustible-dark)',
      },
      reaction: {
        default: 'var(--color-reaction)',
        dark: 'var(--color-reaction-dark)',
      },
    },
  },
  variants: {},
  plugins: [],
}
