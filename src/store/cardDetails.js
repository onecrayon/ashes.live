/**
 * cardDetails Vuex store
 *
 * This store simply tracks which cardDetails link is currently being shown to
 * the user. All links watch it to determine if they are the link which should
 * be currently displayed, or if another link has been hovered over.
 */

const state = () => ({
  displayedIds: [],
})

const mutations = {
  addDisplayedId(state, { id }) {
    state.displayedIds.push(id);
  },
  clearSelfAndDescendents(state, { id }) {
   const index = state.displayedIds.findIndex(x => x === id);
   if (index === -1) return;
   state.displayedIds.splice(index);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
}
