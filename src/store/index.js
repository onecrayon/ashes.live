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
  plugins: debug ? [createLogger()] : []
})
