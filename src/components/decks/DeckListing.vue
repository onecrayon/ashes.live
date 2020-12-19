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

  <deck-table
    :is-disabled="isDisabled"
    :decks="decks"
    :have-next-decks="!!nextDecksURL"
    @reset-filters="clearFilters"
    @load-more="loadNext"></deck-table>
</template>

<script>
import DeckTable from './DeckTable.vue'
import { request } from '/src/utils.js'

export default {
  name: 'DeckListing',
  data: () => {
    return {
      isDisabled: false,
      // This is the list of decks currently shown
      decks: null,
      // This is the URL necessary to load the next "page"
      nextDecksURL: null,
    }
  },
  components: {
    DeckTable
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    }
  },
  created () {
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
        'limit': 50,
      }
      // Show legacy cards, if necessary
      if (this.showLegacy) {
        params['show_legacy'] = true
      }
      this.fetchDecks({ options: { params }, failureCallback })
    },
    // Load the next page of decks
    loadNext () {
      this.fetchDecks({ endpoint: this.nextDecksURL })
    },
  }
}
</script>
