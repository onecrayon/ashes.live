import { createStore, createLogger } from 'vuex'
import builder from './builder.js'
import cards from './cards.js'
import player from './player.js'
import options from './options.js'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    builder,
    cards,
    player,
    options,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  actions: {
    RESET_PLAYER ({ dispatch }) {
      // This ensures that all player-specific data is reset to defaults upon authentication expiry
      dispatch('player/RESET')
      dispatch('builder/RESET')
    },
  },
})
