module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
  ],
  theme: {
    colors: {
      black: 'var(--color-black)',
      gray: {
        DEFAULT: 'var(--color-gray)',
        light: 'var(--color-gray-light)',
        dark: 'var(--color-gray-dark)',
        darker: 'var(--color-gray-darker)',
      },
      white: 'var(--color-white)',
      blue: {
        DEFAULT: 'var(--color-blue)',
        light: 'var(--color-blue-light)',
        dark: 'var(--color-blue-dark)',
      },
      red: {
        DEFAULT: 'var(--color-red)',
        light: 'var(--color-red-light)',
      },
      orange: 'var(--color-orange)',
      green: {
        DEFAULT: 'var(--color-green)',
        light: 'var(--color-green-light)',
        lightest: 'var(--color-green-lightest)',
      },
      // Special coloring schemes specific to Ashes card behavior
      inexhaustible: {
        DEFAULT: 'var(--color-inexhaustible)',
        dark: 'var(--color-inexhaustible-dark)',
      },
      reaction: {
        DEFAULT: 'var(--color-reaction)',
        dark: 'var(--color-reaction-dark)',
      },
    },
  },
  variants: {},
  plugins: [],
}
