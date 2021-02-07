import { createStore, createLogger } from 'vuex'
import cards from './cards.js'
import deck from './deck.js'
import player from './player.js'
import options from './options.js'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    cards,
    deck,
    player,
    options,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
