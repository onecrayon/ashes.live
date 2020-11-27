/**
 * cards Vuex store
 *
 * This store caches basic card details over the course of a single session, ensuring that a
 * minimum of lookups to the server is necessary to display card hovers.
 *
 * Only save Reborn (non-legacy) cards because legacy cards simply show the card image on hover.
 */

import { request } from '/src/utils.js'

// Initial state
const state = () => ({
  stubMap: {},
})

// Getters
const getters = {}

// Actions
const actions = {
  fetchCard ({ commit, state }, partialCard) {
    return new Promise((resolve, reject) => {
      // Exit with stored version, if we already have it
      if (state.stubMap[partialCard.stub]) return resolve(state.stubMap[partialCard.stub])
      // Otherwise, fetch the card
      request(`/v2/cards/${partialCard.stub}`).then(response => {
        const card = response.data
        commit('addCard', card)
        resolve(card)
      }).catch(() => {
        // TODO: figure out how to send this to a toast
        //toast.error(`Unable to load data for ${card.name ? card.name : card.stub}!`)
        reject()
      })
    })
  }
}

// Mutations
const mutations = {
  addCard (state, card) {
    state.stubMap[card.stub] = card
  },
  addCards (state, cards) {
    for (const card of cards) {
      state.stubMap[card.stub] = card
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
