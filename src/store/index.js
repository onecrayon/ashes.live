import { createStore, createLogger } from 'vuex'
import cards from './cards.js'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    cards,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
