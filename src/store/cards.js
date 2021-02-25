/**
 * cards Vuex store
 *
 * This store caches basic card details over the course of a single session, ensuring that a
 * minimum of lookups to the server is necessary to display card hovers.
 *
 * Only save Reborn (non-legacy) cards because legacy cards simply show the card image on hover.
 */

import { useToast } from 'vue-toastification'
import { request } from '/src/utils.js'

const toast = useToast()

// Initial state
const state = () => ({
  stubMap: {},
  phoenixborns: null,
  legacyPhoenixborns: null,
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
        toast.error(`Unable to load data for ${partialCard.name ? partialCard.name : partialCard.stub}!`)
        reject()
      })
    })
  },
  fetchPhoenixborns ({ commit, state }) {
    return new Promise((resolve, reject) => {
      // Exit with stored version, if we already have the list
      if (state.phoenixborns) return resolve(state.phoenixborns)
      // Otherwise, fetch all phoenixborn cards
      request('/v2/cards?types=phoenixborn').then(response => {
        const cards = response.data.results
        const phoenixborns = cards.map(i => { return {name: i.name, stub: i.stub} })
        commit('savePhoenixborns', phoenixborns)
        resolve(phoenixborns)
      }).catch(reject)
    })
  },
  fetchLegacyPhoenixborns ({ commit, state }) {
    return new Promise((resolve, reject) => {
      // Exit with stored version, if we already have the list
      if (state.legacyPhoenixborns) return resolve(state.legacyPhoenixborns)
      // Otherwise, fetch all legacy phoenixborn cards
      request('/v2/cards?types=phoenixborn&show_legacy=true').then(response => {
        const cards = response.data.results
        const phoenixborns = cards.map(i => { return {name: i.name, stub: i.stub} })
        commit('saveLegacyPhoenixborns', phoenixborns)
        resolve(phoenixborns)
      }).catch(reject)
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
  savePhoenixborns (phoenixborns) {
    state.phoenixborns = phoenixborns
  },
  saveLegacyPhoenixborns (phoenixborns) {
    state.legacyPhoenixborns = phoenixborns
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
