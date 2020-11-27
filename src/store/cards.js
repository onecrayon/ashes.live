import { request } from '/src/utils.js'

// Initial state
const state = () => ({
  stubMap: {},
  legacyStubMap: {},
})

// Getters
const getters = {}

// Actions
const actions = {
  fetchCard ({ commit, state }, partialCard) {
    return new Promise((resolve, reject) => {
      const stubMap = partialCard.is_legacy ? state.legacyStubMap : state.stubMap
      // Exit with stored version, if we already have it
      if (stubMap[partialCard.stub]) return resolve(stubMap[partialCard.stub])
      // Otherwise, fetch the card
      request(`/v2/cards/${partialCard.stub}`, {
        params: {
          show_legacy: !!partialCard.is_legacy,
        }
      }).then(response => {
        const card = response.data
        commit('addCard', card)
        resolve(card)
      }).catch(() => {
        this._vm.toast.error(`Unable to load data for ${card.name ? card.name : card.stub}!`)
        reject()
      })
    })
  }
}

// Mutations
const mutations = {
  addCard (state, card) {
    if (card.is_legacy) {
      state.legacyStubMap[card.stub] = card
    } else {
      state.stubMap[card.stub] = card
    }
  },
  addCards (state, cards) {
    for (const card of cards) {
      if (card.is_legacy) {
        state.legacyStubMap[card.stub] = card
      } else {
        state.stubMap[card.stub] = card
      }
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
