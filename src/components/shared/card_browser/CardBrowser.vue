<template>
  <div>
    <div class="sm:flex sm:flex-no-wrap">
      <dice-filter
        class="flex-none mb-4 h-10 sm:pr-4 md:mb-0"
        v-model:filter-logic="diceFilterLogic"
        v-model:filter-list="diceFilterList"
        :is-disabled="isDisabled"></dice-filter>
      <clearable-search
        class="flex-auto h-10"
        placeholder="Filter by name or text..."
        v-model:search="filterText"
        :is-disabled="isDisabled"></clearable-search>
    </div>
    <!-- TODO: implement the rest of the filters -->
    <card-table :is-phoenixborn-picker="isPhoenixbornPicker"></card-table>
  </div>
</template>

<script>
import {watch} from 'vue'
import {debounce, areSetsEqual, trimmed} from '/src/utils.js'
import DiceFilter from './DiceFilter.vue'
import ClearableSearch from '../ClearableSearch.vue'
import CardTable from './CardTable.vue'

export default {
  name: 'CardBrowser',
  props: {
    isPhoenixbornPicker: Boolean,
  },
  data: () => {
    return {
      isDisabled: false,
      diceFilterLogic: 'any',
      diceFilterList: [],
      filterText: '',
    }
  },
  components: {
    DiceFilter,
    ClearableSearch,
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
    let firstPreviousProps = null
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
        return false
      })()
      // Reset our first previous props before exiting
      firstPreviousProps = null
      if (!haveChanges) return
      this.filterList()
    }, 750)
    watch(
      // All filter properties that can trigger a new API call
      // DO NOT REORDER THESE! If you do, you must change the indexlogic in `debouncedFilterCall` above
      [
        () => this.filterText,
        () => this.diceFilterLogic,
        () => this.diceFilterList,
      ],
      (curProps, prevProps) => {
        if (firstPreviousProps === null) {
          firstPreviousProps = prevProps
        }
        this.debouncedFilterCall(curProps, prevProps)
      }
    )
  },
  unmounted () {
    // Cancel pending debounces, if necessary
    this.debouncedFilterCall.cancel()
  },
  methods: {
    filterList () {
      // TODO: implement AJAX listing fetch logic
      console.log('API call required with filters:', {
        filterText: this.filterText,
        diceFilterLogic: this.diceFilterLogic,
        diceFilterList: this.diceFilterList,
      })
    },
  },
}
</script>
