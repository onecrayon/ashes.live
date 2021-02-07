/**
 * deck Vuex store
 *
 * This store manages the deckbuilder mode, which allows constructing a deck over the course of a
 * session. Note that all writes to the deck must be performed via actions, because the deck is
 * auto-saved.
 */
import { request } from '/src/utils.js'

// Initial state
const getBaseState = () => ({
  enabled: false,
  // This is used internally to track whether we have local changes that have failed to save
  isDirty: false,
  // This is used to disable stuff that modifies the deck while it's actively being saved (so that
  // we don't lose edits)
  isSaving: false,
  // This is where we store the actual stuff we're pushing up to the server
  deck: {
    id: null,
    title: '',
    description: '',
    phoenixborn: null,
    dice: [],
    cards: [],
    first_five: [],
    effect_costs: [],
    tutor_map: {},
    // These aren't necessary for saving the deck, but cacheing them improves display logic
    conjurations: [],
  },
})
const state = getBaseState

// Getters
const getters = {}

// Actions
const actions = {
  SAVE_DECK ({ commit, state }) {
    return new Promise((resolve, reject) => {
      // A Phoenixborn is required to save a deck at all, so check for that first
      if (!state.deck.phoenixborn) {
        return reject('You must add a Phoenixborn before you can save your deck!')
      }
      // Construct our data object
      const data = {
        title: state.deck.title,
        description: state.deck.description,
        phoenixborn: state.deck.phoenixborn.stub,
        dice: state.deck.dice,
        cards: state.deck.cards,
        first_five: state.deck.first_five,
        effect_costs: state.deck.effect_costs,
        tutor_map: state.deck.tutor_map,
      }
      if (state.deck.id) {
        data.id = state.deck.id
      }

      // Kick off our save request
      commit('setIsSaving', true)
      request('/v2/decks', {
        method: 'put',
        data: data,
      }).then(response => {
        // TODO: Save our response data back in, just in case there was drift
        // And note that we're not dirty anymore
        commit('setIsDirty', false)
        resolve()
      }).catch(error => {
        // Ensure that our dirty flag is toggled
        commit('setIsDirty', true)
        reject(error)
      }).finally(() => {
        commit('setIsSaving', false)
      })
    })
  },
  reset ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!state.enabled) return resolve()
      if (state.isSaving) return reject('You cannot exit the deckbuilder while changes are being saved.')
      // Reset to the base state
      commit('RESET_STATE')
      resolve()
    })
  },
}

// Mutations
const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getBaseState())
  },
  // One of the few mutations intended to be used publicly for this store; enables the deckbuilder
  enableDeckbuilder (state) {
    if (!state.enabled) state.enabled = true
  },
  disableDeckbuilder (state) {
    state.enabled = false
  },
  setIsDirty (state, value) {
    state.isDirty = value
  },
  setIsSaving (state, value) {
    state.isSaving = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
