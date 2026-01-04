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
  // Accepts 'all' or 'mine'
  releaseFilter: storeGet('releaseFilter') || 'all',
  colorizeIcons: storeGet('colorizeIcons') || false,
  // Toggles whether we will show card releases on card hover and similar
  showCardReleases: storeGet('showCardReleases') || false,
  // If true, uses "deckbuilder mode" for card listings when the deckbuilder is open
  deckbuilderMode: storeGet('deckbuilderMode') || false,
  exportShowCardCounts: typeof defaultExportShowCardCounts === 'boolean' ? defaultExportShowCardCounts : true,
  exportSortByType: typeof defaultExportSortByType === 'boolean' ? defaultExportSortByType : true,
  exportShowAttribution: typeof defaultExportShowAttribution === 'boolean' ? defaultExportShowAttribution : true,
  // Controls sorting options specific for deck detail pages
  deckSort: storeGet('deckSort') || 'type',
  deckOrder: storeGet('deckOrder') || 'asc',
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
  setReleaseFilter (state, releaseFilter) {
    state.releaseFilter = releaseFilter
    storeSet('releaseFilter', releaseFilter)
  },
  // TODO: implement an action to update this setting from the front-end? Or just handle through
  // user patching view? Currently, this will not persist to the API and will be overwritten by
  // the user's setting there; it would need an action for persisted setting
  setColorizeIcons (state, colorizeIcons) {
    state.colorizeIcons = colorizeIcons
    storeSet('colorizeIcons', colorizeIcons)
  },
  setShowCardReleases (state, showCardReleases) {
    state.showCardReleases = showCardReleases
    storeSet('showCardReleases', showCardReleases)
  },
  setDeckbuilderMode (state, deckbuilderMode) {
    state.deckbuilderMode = deckbuilderMode
    storeSet('deckbuilderMode', deckbuilderMode)
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
  setDeckSort (state, value) {
    state.deckSort = value
    storeSet('deckSort', value)
  },
  setDeckOrder (state, value) {
    state.deckOrder = value
    storeSet('deckOrder', value)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
