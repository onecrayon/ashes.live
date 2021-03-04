/**
 * options Vuex store
 *
 * This store handles local device user preferences and options and persists them either through
 * local storage or the API.
 */
import { localStoreFactory } from '/src/utils/store.js'

const { storeGet, storeSet } = localStoreFactory('deckbuilder.options')

// Initial state
const state = () => ({
  // Accepts 'list' or 'binder'
  galleryStyle: storeGet('galleryStyle') || 'list',
  colorizeIcons: storeGet('colorizeIcons') || false,
})

// Getters
const getters = {}

// Actions
const actions = {}

// Mutations
const mutations = {
  setGalleryStyle (state, galleryStyle) {
    state.galleryStyle = galleryStyle
    storeSet('galleryStyle', galleryStyle)
  },
  // TODO: implement an action to update this setting from the front-end? Or just handle through
  // user patching view? Currently, this will not persist to the API and will be overwritten by
  // the user's setting there; it would need an action for persisted setting
  setColorizeIcons (state, colorizeIcons) {
    state.colorizeIcons = colorizeIcons
    storeSet('colorizeIcons', colorizeIcons)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
