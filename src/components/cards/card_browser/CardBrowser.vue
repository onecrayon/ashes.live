<template>
  <div>
    <div class="md:flex md:flex-nowrap mb-4">
      <dice-filter
        class="flex-none mb-4 h-10 md:pr-4 md:mb-0"
        v-model:filter-logic="diceFilterLogic"
        v-model:filter-list="diceFilterList"
        :is-disabled="isDisabled"></dice-filter>
      <clearable-search
        class="flex-auto h-10"
        placeholder="Filter by name or text..."
        v-model:search="filterText"
        :is-disabled="isDisabled"></clearable-search>
    </div>
    <type-filter
      class="mb-4"
      v-model:filter-list="typeFilterList"
      :is-disabled="isDisabled"></type-filter>
    <div class="flex flex-nowrap">
      <card-sort
        class="mb-4 flex-auto"
        v-model:sort="sort"
        v-model:order="order"
        :is-phoenixborn-picker="isPhoenixbornPicker"
        :is-disabled="isDisabled"></card-sort>
      <gallery-picker
        v-if="!showLegacy"
        class="mb-4 flex-none"
        :is-disabled="isDisabled"></gallery-picker>
    </div>
    <card-table
      :is-disabled="isDisabled"
      :is-phoenixborn-picker="isPhoenixbornPicker"
      :cards="cards"
      :have-next-cards="!!nextCardsURL"
      :gallery-style="galleryStyle"
      @reset-filters="clearFilters"
      @load-more="loadNext"></card-table>
  </div>
</template>

<script>
import { watch } from 'vue'
import { useToast } from 'vue-toastification'
import { debounce, areSetsEqual, trimmed, request } from '/src/utils.js'
import DiceFilter from './DiceFilter.vue'
import TypeFilter from './TypeFilter.vue'
import ClearableSearch from '../../shared/ClearableSearch.vue'
import CardSort from './CardSort.vue'
import GalleryPicker from './GalleryPicker.vue'
import CardTable from './CardTable.vue'

function ensureArray (value) {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

export default {
  name: 'CardBrowser',
  props: {
    isPhoenixbornPicker: Boolean,
    showLegacy: Boolean,
  },
  setup () {
    // Expose toasts for use in other portions of this component
    const toast = useToast()
    return { toast }
  },
  data: () => {
    return {
      isDisabled: false,
      diceFilterLogic: 'any',
      diceFilterList: [],
      filterText: '',
      typeFilterList: [],
      sort: 'name',
      order: 'asc',
      // This is the list of cards currently shown
      cards: null,
      // This is the URL necessary to load the next "page"
      nextCardsURL: null,
    }
  },
  components: {
    DiceFilter,
    ClearableSearch,
    TypeFilter,
    CardSort,
    GalleryPicker,
    CardTable,
  },
  created () {
    /**
     * Create debounced methods and setup filter watching logic
     *
     * Lots going on here:
     *
     * - Track the first triggered "previous properties" list outside the closure, because
     *   we want to be able to compare the state between the final filtration options and
     *   the filtration options before they made any changes at all (if we debounce the `watch`
     *   callback, then we only get one step of changes; so if they toggle three options, we'll
     *   see two options toggled in the previous list instead of zero options toggled)
     * - Debounce any actual action we take in response to filter changes to ensure we give them
     *   time to finish making changes.
     * - The `watch` method is required because `this.$watch` does not currently accept an array
     * - Functions that return `this.PROPERTY` is required because arrays of strings aren't
     *   working for some reason, and while the `this.$data` reactive object is accepted, we
     *   don't want to trigger filters on arbirtrary other changes (like toggling `isDisabled`)
     */
    // Before we do anything, we need to translate any query parameters into filters
    if (this.$route.query.q) {
      this.filterText = this.$route.query.q
    }
    if (this.$route.query.dice) {
      this.diceFilterList = ensureArray(this.$route.query.dice)
    }
    if (this.$route.query.dice_logic !== 'any') {
      this.diceFilterLogic = this.$route.query.dice_logic
    }
    if (this.$route.query.types) {
      this.typeFilterList = ensureArray(this.$route.query.types)
    }
    if (this.$route.query.sort) {
      this.sort = this.$route.query.sort
    }
    if (this.$route.query.order) {
      this.order = this.$route.query.order
    }

    let firstPreviousProps = null
    // We use this to shortcut out when an AJAX failure occurs (otherwise could loop on failing lookups)
    let resettingFailedValues = false
    // Both arguments are arrays with the current/next values in the same order as the watch array below
    this.debouncedFilterCall = debounce((curProps, prevProps) => {
      // Check if we have changes to make; wrapped in a closure to ensure we perform as little
      // logic as necessary
      const haveChanges = (() => {
        // Check filterText (string)
        if (trimmed(curProps[0]) !== trimmed(firstPreviousProps[0])) return true
        // Check diceFilterLogic (string)
        if (trimmed(curProps[1]) !== trimmed(firstPreviousProps[1])) return true
        // Check diceFilterList (list of strings)
        if (!areSetsEqual(new Set(curProps[2]), new Set(firstPreviousProps[2]))) return true
        // Check typeFilterList (list of strings)
        if (!areSetsEqual(new Set(curProps[3]), new Set(firstPreviousProps[3]))) return true
        if (curProps[4] !== firstPreviousProps[4]) return true
        if (curProps[5] !== firstPreviousProps[5]) return true
        return false
      })()
      // We cache the original values in case of failure
      const cachedValues = {
        filterText: String(trimmed(firstPreviousProps[0])),
        diceFilterLogic: String(firstPreviousProps[1]),
        diceFilterList: Array.from(new Set(firstPreviousProps[2])),
        typeFilterList: Array.from(new Set(firstPreviousProps[3])),
        sort: firstPreviousProps[4],
        order: firstPreviousProps[5],
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
        () => this.diceFilterLogic,
        () => this.diceFilterList,
        () => this.typeFilterList,
        () => this.sort,
        () => this.order,
      ],
      (curProps, prevProps) => {
        if (firstPreviousProps === null) {
          firstPreviousProps = prevProps
        }
        this.debouncedFilterCall(curProps, prevProps)
      }
    )

    // And finally, trigger our first listing load
    this.filterList()
  },
  unmounted () {
    // Cancel pending debounces, if necessary
    this.debouncedFilterCall.cancel()
  },
  watch: {
    '$route.query' (to, from) {
      // TODO: Figure out a better way to handle this; this code gets called extraneously every
      // time the query string is updated (even when we're updating due to in-page controls).
      // I tried to use beforeRouteUpdate guard, but it never triggered on query string changes.
      // Checking for `this.isDisabled` doesn't work because the timing doesn't line up.

      // Make sure to update our filters if we navigate here via browser back/forward
      if (to.q !== from.q) {
        this.filterText = to.q === undefined ? '' : to.q
      }
      if (to.dice_logic !== from.dice_logic) {
        this.diceFilterLogic = to.dice_logic === undefined ? 'any' : to.dice_logic
      }
      if (to.dice !== from.dice) {
        this.diceFilterList = ensureArray(to.dice)
      }
      if (to.types !== from.types) {
        this.typeFilterList = ensureArray(to.types)
      }
      if (to.sort !== from.sort) {
        this.sort = to.sort === undefined ? 'name' : to.sort
      }
      if (to.order !== from.order) {
        this.order = to.order === undefined ? 'asc' : to.order
      }
    },
  },
  computed: {
    galleryStyle () {
      if (this.showLegacy) return 'list'
      return this.$store.state.options.galleryStyle
    }
  },
  methods: {
    // Clear out filters; this will automatically cause the card listing to be refreshed due to the
    // `watch` logic above
    clearFilters () {
      this.filterText = ''
      this.diceFilterLogic = 'any'
      this.diceFilterList = []
      this.typeFilterList = []
    },
    /**
     * Perform the actual AJAX call to the API.
     *
     * Accepts a single object with the following keys:
     *
     * * `endpoint`: full URL to fetch, or leave null for a default endpoint call
     * * `options`: options object to be handed through to `axios.request`.
     *   See https://github.com/axios/axios#request-config
     * * `failureCallback`: an optional callback that will be invoked on failure
     */
    fetchCards ({endpoint = null, options = {}, failureCallback = null, pushToRouter = true} = {}) {
      if (!endpoint) {
        endpoint = '/v2/cards'
      }
      this.isDisabled = true
      request(endpoint, options).then((response) => {
        // Update our query string with the currently set filters
        const query = {}
        if (this.filterText) {
          query.q = this.filterText
        }
        if (this.diceFilterList.length) {
          query.dice = this.diceFilterList
        }
        if (this.diceFilterLogic && this.diceFilterLogic !== 'any') {
          query.dice_logic = this.diceFilterLogic
        }
        if (this.typeFilterList.length) {
          query.types = this.typeFilterList
        }
        if (this.sort !== 'name') {
          query.sort = this.sort
        }
        if (this.order !== 'asc') {
          query.order = this.order
        }
        if (pushToRouter) {
          this.$router.push({
            path: this.$route.path,
            query: query,
          })
        }
        // Clear everything out if we have no actual results (makes logical comparisons easier)
        if (response.data.count === 0) {
          this.cards = null
          this.nextCardsURL = null
          return
        }
        // Ensure we have a list to work with
        if (!this.cards) this.cards = []
        // If we have a previous link, then that means we are loading paginated results (so concat)
        if (response.data.previous) {
          this.cards = this.cards.concat(response.data.results)
        } else {
          // Otherwise, we're loading a newly filtered list
          this.cards = response.data.results
        }
        this.nextCardsURL = response.data.next
        // Add cards to the Vuex store so that we don't need to fetch individual cards via AJAX
        // when viewing their details around the site (during this session, at least)
        this.$store.commit('cards/addCards', response.data.results)
      }).catch((error) => {
        let errorMessage = 'Failed to fetch card listing. Please report if this fails repeatedly!'
        if (error.response.status === 422) {
          // TODO: write a generic function to parse the validation response from FastAPI
          errorMessage = 'Failed to fetch card listing (validation failure)!'
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
      // Query our list of cards
      const params = {
        'limit': 50,
        'sort': this.sort,
        'order': this.order,
      }
      // Show legacy cards, if necessary
      if (this.showLegacy) {
        params['show_legacy'] = true
      }
      const filterText = trimmed(this.filterText)
      if (filterText) params.q = filterText
      if (this.diceFilterList.length) {
        params.dice_logic = this.diceFilterLogic
        params.dice = this.diceFilterList
      }
      if (this.typeFilterList.length) {
        // Clone our array, so we can modify it without messing with the original
        const filterList = this.typeFilterList.slice(0)
        const summonIndex = filterList.indexOf('summon')
        if (summonIndex > -1) {
          filterList.splice(summonIndex, 1)
          params.show_summons = true
        }
        params.types = filterList
      }
      this.fetchCards({ options: { params }, failureCallback })
    },
    // Load the next page of cards
    loadNext () {
      this.fetchCards({ endpoint: this.nextCardsURL, pushToRouter: false })
    },
  },
}
</script>
