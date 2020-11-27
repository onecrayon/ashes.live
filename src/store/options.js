/**
 * options Vuex store
 * 
 * This store handles user preferences and options and persists them either to the API or
 * through local storage.
 */
import { localStoreFactory } from '/src/utils.js'

const { storeGet, storeSet } = localStoreFactory('deckbuilder.options')

// Initial state
const state = () => {

  return {
    // Accepts 'list' or 'binder'
    galleryStyle: storeGet('galleryStyle') || 'list',
  }
}

// Getters
const getters = {}

// Actions
const actions = {}

// Mutations
const mutations = {
  setGalleryStyle (state, galleryStyle) {
    state.galleryStyle = galleryStyle
    storeSet('galleryStyle', galleryStyle)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
