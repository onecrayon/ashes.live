/**
 * options Vuex store
 *
 * This store handles local device user preferences and options and persists them either through
 * local storage or the API.
 */
import { localStoreFactory } from '/src/utils/store.js'

const { storeGet, storeSet } = localStoreFactory('deckbuilder.options')

// These default to true, so we have to grab ahead to check types rather than doing an OR comparison
const defaultExportShowCardCounts = storeGet('exportShowCardCounts')
const defaultExportSortByType = storeGet('exportSortByType')
const defaultExportShowAttribution = storeGet('exportShowAttribution')

// Initial state
const state = () => ({
  // Accepts 'list' or 'binder'
  galleryStyle: storeGet('galleryStyle') || 'list',
  colorizeIcons: storeGet('colorizeIcons') || false,
  exportShowCardCounts: typeof defaultExportShowCardCounts === 'boolean' ? defaultExportShowCardCounts : true,
  exportSortByType: typeof defaultExportSortByType === 'boolean' ? defaultExportSortByType : true,
  exportShowAttribution: typeof defaultExportShowAttribution === 'boolean' ? defaultExportShowAttribution : true,
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
  setExportShowCardCounts (state, value) {
    state.exportShowCardCounts = value
    storeSet('exportShowCardCounts', value)
  },
  setExportSortByType (state, value) {
    state.exportSortByType = value
    storeSet('exportSortByType', value)
  },
  setExportShowAttribution (state, value) {
    state.exportShowAttribution = value
    storeSet('exportShowAttribution', value)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
