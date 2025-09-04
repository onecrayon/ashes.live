module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.vue',
  ],
  // Protect certain classes from being purged
  safelist: [
    // Protect classes used by Nanobar
    'nanobar', 'bar',
    // Protect classes assigned to toasts in main.js
    'bg-red', 'bg-orange', 'bg-green', 'bg-blue',
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
        lightest: 'var(--color-red-lightest)',
      },
      orange: {
        DEFAULT: 'var(--color-orange)',
        light: 'var(--color-orange-light)',
        lightest: 'var(--color-orange-lightest)',
      },
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
      dice: {
        ceremonial: 'var(--color-dice-ceremonial)',
        'ceremonial-bg': 'var(--color-dice-ceremonial-bg)',
        charm: 'var(--color-dice-charm)',
        'charm-bg': 'var(--color-dice-charm-bg)',
        illusion: 'var(--color-dice-illusion)',
        'illusion-bg': 'var(--color-dice-illusion-bg)',
        natural: 'var(--color-dice-natural)',
        'natural-bg': 'var(--color-dice-natural-bg)',
        divine: 'var(--color-dice-divine)',
        'divine-bg': 'var(--color-dice-divine-bg)',
        sympathy: 'var(--color-dice-sympathy)',
        'sympathy-bg': 'var(--color-dice-sympathy-bg)',
        time: 'var(--color-dice-time)',
        'time-bg': 'var(--color-dice-time-bg)',
      },
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      circle: 'circle',
      decimal: 'decimal',
    },
  },
  variants: {},
  plugins: [],
}
