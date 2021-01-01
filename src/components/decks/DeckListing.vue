<template>
  <h1 class="phg-main-action">Browse decks</h1>

  <p v-if="!showLegacy" class="text-l mb-8">
    <!-- Using a named view because this is one of the more likely ones to move to a different route -->
    You are viewing <strong class="text-red">Ashes Reborn</strong> decks. <router-link :to="{name: 'LegacyDecks'}">View Ashes Legacy decks instead</router-link>.
  </p>
  <div v-else>
    <p class="text-l border-2 border-orange rounded bg-inexhaustible px-4 py-2 mb-2">
      You are viewing <strong class="text-gray-darker">Ashes Legacy</strong> decks. <router-link to="/decks/">View Ashes Reborn decks instead</router-link>.
    </p>
  </div>

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
    />
  </div>

  <deck-table
    :is-disabled="isDisabled"
    :decks="decks"
    :have-next-decks="!!nextDecksURL"
    @reset-filters="clearFilters"
    @load-more="loadNext"></deck-table>
</template>

<script>
import { watch } from 'vue'
import deepEqual from 'deep-equal'
import DeckTable from './DeckTable.vue'
import ClearableSearch from '../shared/ClearableSearch.vue'
import { debounce, trimmed, request } from '/src/utils.js'
import PhoenixbornPicker from '../shared/PhoenixbornPicker.vue'

export default {
  name: 'DeckListing',
  data: () => {
    return {
      isDisabled: false,
      filterText: '',
      phoenixborn: null,
      // This is the list of decks currently shown
      decks: null,
      // This is the URL necessary to load the next "page"
      nextDecksURL: null,
    }
  },
  components: {
    DeckTable,
    ClearableSearch,
    PhoenixbornPicker,
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    }
  },
  created () {
    // Before we do anything, we need to translate any query parameters into filters
    if (this.$route.query.q) {
      this.filterText = this.$route.query.q
      this.phoenixborn = this.$route.query.phoenixborn
    }

    let firstPreviousProps = null
    // We use this to shortcut out when an AJAX failure occurs (otherwise could loop on failing lookups)
    let resettingFailedValues = false

    this.debouncedFilterCall = debounce((curProps, prevProps) => {
      // Check if we have changes to make; wrapped in a closure to ensure we perform as little
      // logic as necessary
      const haveChanges = (() => {
        // Check filterText (string)
        if (trimmed(curProps[0]) !== trimmed(firstPreviousProps[0])) return true
        if (curProps[1] !== firstPreviousProps[1]) return true
        return false
      })()
      // We cache the original values in case of failure
      const cachedValues = {
        filterText: String(trimmed(firstPreviousProps[0])),
        phoenixborn: String(firstPreviousProps[1]),
      }
      // Reset our first previous props before exiting
      firstPreviousProps = null
      if (!haveChanges || resettingFailedValues) {
        resettingFailedValues = false
        return
      }
      // Filter the list, and on failure revert to the previous filters
      this.filterList(() => {
        resettingFailedValues = true
        for (const key of Object.keys(cachedValues)) {
          this[key] = cachedValues[key]
        }
      })
    }, 750)
    watch(
      // All filter properties that can trigger a new API call
      // DO NOT REORDER THESE! If you do, you must change the index logic in `debouncedFilterCall` above
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
        if (firstPreviousProps === null) {
          firstPreviousProps = prevProps
        }
        this.filterList(() => { /* TODO: implement failed callback */ })
      }
    )
    // Trigger initial listing load
    this.filterList()
  },
  methods: {
    clearFilters () {
      // TODO: clear filters
    },
    fetchDecks ({endpoint = null, options = {}, failureCallback = null} = {}) {
      if (!endpoint) {
        endpoint = '/v2/decks'
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
        // Only push to router is query has changed. In the case of scrolling, we don't want to push as
        // it's the same url but pushing to the router will make it scroll back to top
        if (!deepEqual(this.$route.query, query)) {
          this.$router.push({
            path: this.$route.path,
            query: query,
          })
        }
        // Clear everything out if we have no actual results (makes logical comparisons easier)
        if (response.data.count === 0) {
          this.decks = null
          this.nextDecksURL = null
          return
        }
        // Ensure we have a list to work with
        if (!this.decks) this.decks = []
        // If we have a previous link, then that means we are loading paginated results (so concat)
        if (response.data.previous) {
          this.decks = this.decks.concat(response.data.results)
        } else {
          // Otherwise, we're loading a newly filtered list
          this.decks = response.data.results
        }
        this.nextDecksURL = response.data.next

        // TODO: cache to store

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
        'limit': 30,
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
    // Load the next page of decks
    loadNext () {
      this.fetchDecks({ endpoint: this.nextDecksURL })
    },
  }
}
</script>
