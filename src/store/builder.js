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
  // This is a local-only cache of stubs as keys and quantities as values (much simpler for per-card lookups)
  countMap: {},
})
const state = getBaseState

// Getters
const getters = {}

// Actions
const actions = {
  PERSIST_DECK ({ commit }, deck) {
    // This persists a deck locally that has been loaded from the API
    return new Promise(resolve => {
      commit('setDeckID', deck.id)
      commit('setPhoenixborn', deck.phoenixborn)
      if (deck.cards) {
        for (const card of deck.cards) {
          commit('setCardCount', {
            card: card,
            count: card.count,
          })
        }
      }
      // TODO: persist everything else, once those data mutations are supported
      resolve()
    })
  },
  SAVE_DECK ({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      // A Phoenixborn is required to save a deck at all, so check for that first
      if (!state.deck.phoenixborn) {
        return reject('You must add a Phoenixborn before you can save your deck!')
      }
      if (state.isSaving) {
        return reject('Please wait to save again until the deck is done saving.')
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
        // Persist our response data, just in case there was drift
        dispatch('PERSIST_DECK', response.data).then(() => {
          // And note that we're not dirty anymore
          commit('setIsDirty', false)
          resolve()
        })
      }).catch(error => {
        // Ensure that our dirty flag is toggled
        commit('setIsDirty', true)
        reject(error)
      }).finally(() => {
        commit('setIsSaving', false)
      })
    })
  },
  editDeck ({ commit, dispatch, state }, id) {
    return new Promise((resolve, reject) => {
      if (state.deck.id === id) return resolve()
      commit('setIsSaving', true)
      request(`/v2/decks/${id}`, {
        params: { show_saved: true },
      }).then(response => {
        // Load in our new deck!
        commit('RESET_STATE')
        commit('enable')
        dispatch('PERSIST_DECK', response.data.deck).then(resolve)
      }).catch(error => {
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
  setPhoenixborn ({ commit, dispatch, state }, card) {
    return new Promise((resolve, reject) => {
      if (!state.enabled) return reject('You cannot modify a deck when the deckbuilder is not active.')
      commit('setPhoenixborn', card)
      dispatch('SAVE_DECK').then(resolve).catch(reject)
    })
  },
  setCardCount ({ commit, dispatch, state }, { card, count }) {
    const stub = card.stub
    return new Promise((resolve, reject) => {
      // Removing something that isn't there? Well, that was easy
      if (!state.countMap[stub] && count === 0) return resolve()
      commit('setCardCount', { card, count })
      dispatch('SAVE_DECK').then(resolve).catch(reject)
    })
  },
}

// Mutations
const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getBaseState())
  },
  // One of the few mutations intended to be used publicly for this store; enables the deckbuilder
  enable (state) {
    if (!state.enabled) state.enabled = true
  },
  // These are all private; don't use them
  disable (state) {
    state.enabled = false
  },
  setIsDirty (state, value) {
    state.isDirty = value
  },
  setIsSaving (state, value) {
    state.isSaving = value
  },
  setDeckID (state, value) {
    state.deck.id = value
  },
  setPhoenixborn (state, card) {
    if (state.deck.phoenixborn && state.deck.phoenixborn.stub === card.stub) return
    // Remove any Phoenixborn unique cards from the deck that don't match this Phoenixborn
    const badStubs = []
    const badIndices = []
    const numCards = state.deck.cards.length
    for (let i = 0; i < numCards; i++) {
      const curCard = state.deck.cards[i]
      if (curCard.phoenixborn !== card.name) {
        badStubs.push(curCard.stub)
        badIndices.push(i)
      }
    }
    // Delete our indices backwards so that they don't shift as we mutate the array
    let index = badIndices.pop()
    while (index !== undefined) {
      state.deck.cards.splice(index, 1)
      index = badIndices.pop()
    }
    // And clear them from our countMap
    for (const stub of badStubs) {
      if (state.countMap[stub] !== undefined) {
        delete state.countMap[stub]
      }
    }

    // And finally set the Phoenixborn
    state.deck.phoenixborn = {
      name: card.name,
      stub: card.stub,
    }
  },
  setCardCount (state, { card, count }) {
    const stub = card.stub
    if (count === 0) {
      // No need to proceed if this isn't in our count map
      if (state.countMap[stub] === undefined) return
      delete state.countMap[stub]
      const index = state.deck.cards.findIndex(element => element.stub === stub)
      // This should never happen, but just in case...
      if (index === -1) return
      state.deck.cards.splice(index, 1)
    } else if (state.countMap[stub] === undefined) {
      // Adding the card for the first time
      const cardData = {
        count,
        name: card.name,
        stub: card.stub,
        type: card.type,
      }
      if (card.phoenixborn) {
        cardData.phoenixborn = card.phoenixborn
      }
      state.deck.cards.push(cardData)
      state.countMap[stub] = count
    } else {
      // Updating the count is only necessary if it actually updated
      if (state.countMap[stub] === count) return
      state.countMap[stub] = count
      const index = state.deck.cards.findIndex(element => element.stub === stub)
      if (index === -1) return
      state.deck.cards[index].count = count
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
