<template>
  <div class="md:flex md:flex-no-wrap mb-4">
    <clearable-search
      class="flex-auto h-10 mb-4 md:pr-4 md:mb-0"
      placeholder="Filter by title..."
      v-model:search="filterText"
      :is-disabled="isDisabled"></clearable-search>
    <phoenixborn-picker
      class="flex-auto h-10 mb-4 md:mb-0"
      placeholder="Filter by Phoenixborn..."
      v-model:filter="phoenixborn"
      :is-legacy="showLegacy"
    />
  </div>

  <deck-table
    :is-disabled="isDisabled"
    :decks="decks"
    :haveNextDecks="haveNextDecks"
    :havePreviousDecks="havePreviousDecks"
    @reset-filters="clearFilters"
    @load-previous="loadPrevious"
    @load-next="loadNext"
    @refresh="filterList"
    :currentPage="currentPage"
    :totalPage="totalPage"
    :show-mine="showMine"
    :have-filters="!!filterText || !!phoenixborn"></deck-table>
</template>

<script>
import { watch } from 'vue'
import { useToast } from 'vue-toastification'
import DeckTable from './DeckTable.vue'
import ClearableSearch from '../shared/ClearableSearch.vue'
import { debounce, trimmed, request } from '/src/utils.js'
import PhoenixbornPicker from '../shared/PhoenixbornPicker.vue'

const DECKS_PER_PAGE = 30;

export default {
  name: 'DeckListing',
  setup () {
    // Expose toasts for use in other portions of this component
    return { toast: useToast() }
  },
  props: {
    showMine: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isDisabled: false,
    filterText: '',
    phoenixborn: null,
    offset: 0,
    // This is the list of decks currently shown
    decks: null,
    deckCount: 0,
  }),
  components: {
    DeckTable,
    ClearableSearch,
    PhoenixbornPicker,
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    },
    havePreviousDecks () {
      return this.offset > 0
    },
    haveNextDecks() {
      return this.offset + DECKS_PER_PAGE < this.deckCount
    },
    currentPage() {
      return (this.offset / DECKS_PER_PAGE) + 1
    },
    totalPage() {
      return Math.ceil(this.deckCount / DECKS_PER_PAGE)
    }
  },
  created () {
    // Before we do anything, we need to translate any query parameters into filters
    if (this.$route.query.q) {
      this.filterText = this.$route.query.q
      this.phoenixborn = this.$route.query.phoenixborn
      this.offset = this.$route.query.offset
    }

    let firstPreviousProps = null
    // We use this to shortcut out when an AJAX failure occurs (otherwise could loop on failing lookups)
    let resettingFailedValues = false

    this.debouncedFilterCall = debounce((curProps, prevProps) => {
      // Check if we have changes to make; wrapped in a closure to ensure we perform as little
      // logic as necessary
      const haveChanges = (() => {
        // Check filterText (string)
        return trimmed(curProps[0]) !== trimmed(firstPreviousProps[0])
      })()
      // We cache the original values in case of failure
      const cachedValues = {
        filterText: String(trimmed(firstPreviousProps[0])),
      }
      // Reset our first previous props before exiting
      firstPreviousProps = null
      if (!haveChanges || resettingFailedValues) {
        resettingFailedValues = false
        return
      }
      this.offset = 0
      // Filter the list, and on failure revert to the previous filters
      this.filterList(() => {
        resettingFailedValues = true
        for (const key of Object.keys(cachedValues)) {
          this[key] = cachedValues[key]
        }
      })
    }, 750)
    watch(
      [
        () => this.filterText,
      ],
      (curProps, prevProps) => {
        if (firstPreviousProps === null) {
          firstPreviousProps = prevProps
        }
        this.debouncedFilterCall(curProps, prevProps)
      }
    )
    watch(
      [
        () => this.phoenixborn,
      ],
      (curProps, prevProps) => {
        this.offset = 0
        this.filterList(() => {})
      }
    )
    // Trigger initial listing load
    this.filterList()
  },
  methods: {
    clearFilters () {
      this.filterText = ''
      this.phoenixborn = null
      this.offset = 0
    },
    fetchDecks ({endpoint = null, options = {}, failureCallback = null} = {}) {
      if (!endpoint) {
        endpoint = this.showMine ? '/v2/decks/mine' : '/v2/decks'
      }
      this.isDisabled = true
      request(endpoint, options).then((response) => {
        // Update our query string with the currently set filters
        const query = {}

        if (this.filterText) {
          query.q = this.filterText
        }
        if (this.phoenixborn) {
          query.phoenixborn = this.phoenixborn
        }
        if (this.offset) {
          query.offset = this.offset
        }
        // Only push to router is query has changed. In the case of scrolling, we don't want to push as
        // it's the same url but pushing to the router will make it scroll back to top
        this.$router.push({
          path: this.$route.path,
          query: query,
        })
        // Clear everything out if we have no actual results (makes logical comparisons easier)
        if (response.data.count === 0) {
          this.decks = null
          this.nextDecksURL = null
          return
        }

        this.deckCount = response.data.count
        this.decks = response.data.results

        // Add decks to the Vuex store so that we don't need to fetch individual cards via AJAX
        // when viewing their details around the site (during this session, at least)
        // this.$store.commit('decks/addDecks', response.data.results)
      }).catch((error) => {
        let errorMessage = 'Failed to fetch deck listing. Please report if this fails repeatedly!'
        if (error.response.status === 422) {
          // TODO: write a generic function to parse the validation response from FastAPI
          errorMessage = 'Failed to fetch deck listing (validation failure)!'
        } else if (error.data && error.data.detail) {
          errorMessage = error.response.data.detail
        }
        this.toast.error(errorMessage)
        // Reset the filters, if necessary
        if (failureCallback) failureCallback()
      }).finally(() => {
        this.isDisabled = false
      })
    },
    // Default method for running a new filter using the current filter settings
    filterList (failureCallback) {
      // Query our list of decks
      const params = {
        offset: this.offset,
        limit: DECKS_PER_PAGE,
      }
      // Show legacy cards, if necessary
      if (this.showLegacy) {
        params['show_legacy'] = true
      }
      const filterText = trimmed(this.filterText)
      if (this.phoenixborn) params.phoenixborn = this.phoenixborn
      if (filterText) params.q = filterText
      this.fetchDecks({ options: { params }, failureCallback })
    },
    loadNext () {
      this.offset += DECKS_PER_PAGE
      this.filterList()
    },
    loadPrevious () {
      this.offset -= DECKS_PER_PAGE
      this.filterList()
    },
  },
}
</script>
