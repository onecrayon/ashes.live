/**
 * cardDetails Vuex store
 *
 * This store simply tracks which cardDetails link is currently being shown to
 * the user. All links watch it to determine if they are the link which should
 * be currently displayed, or if another link has been hovered over.
 */

const state = () => ({
  displayedId: null,
})

const mutations = {
  setDisplayedId(state, { id }) {
    state.displayedId = id
  },
  unsetDisplayedId(state, { id }) {
    if (state.displayedId !== id) return
    state.displayedId = null
  }
}

export default {
  namespaced: true,
  state,
  mutations,
}