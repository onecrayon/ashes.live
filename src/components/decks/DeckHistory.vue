<template>
  <div v-if="error">
    <h1 class="phg-discard">No deck found</h1>

    <p class="text-lg">
      Sorry, this does not appear to be a valid deck!
    </p>
  </div>
  <div v-else-if="snapshots === null">
    <h1 class="phg-time-class text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else-if="!snapshots.length">
    <h1 class="php-time-class">No snapshots</h1>

    <p clsas="text-lg">
      This deck does not currently have any snapshots to view!
    </p>
  </div>
  <div v-else>
    <h1 class="phg-time-class mb-6">
      <span v-if="showMine">Private history for: </span>
      <span v-else>History for: </span>
      <span :class="{'italic font-normal': !topDeck.title}">{{ title }}</span>
    </h1>

    <deck v-if="showMine" :deck="topDeck" show-badges :show-mine="showMine"></deck>
    <deck v-for="snapshot in snapshots" :key="snapshot.id" :deck="snapshot" show-badges :show-mine="showMine" use-direct-links include-share-link></deck>
  </div>
</template>

<script>
import { deckTitle } from '/src/utils/decks.js'
import { request } from '/src/utils/index.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import Deck from './Deck.vue'

export default {
  name: 'DeckHistory',
  props: ['id'],
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    Deck,
  },
  data () {
    return {
      _deck: null,
      snapshots: null,
      nextSnapshots: null,
      error: false,
    }
  },
  beforeMount () {
    /*
    Scenarios:

    1. User viewing a deck they own from the "my deck" view
        * Should see most recent save deck, followed by all snapshots (public or private)
    2. User viewing a deck they own from the "public deck" view
        * Same as #3 (could do two buttons, but going to try just one)
    3. User viewing a deck they *do not* own from the "public deck" view
        * Should see most recent public snapshot at top, followed by older public snapshots
    */
    this.loadDeck()
    this.loadSnapshots()
    if (this.showMine) {
      // Watch the edited deck ID since we need to reload if we exit editing on this page
      this.unwatchBuilderId = this.$store.watch(state => state.builder.deck.id, (value, oldValue) => {
        if (oldValue === this._deck.id && value !== oldValue) {
          this.$nextTick(this.loadDeck)
        }
      })
    } else {
      // no-op
      this.unwatchBuilderId = () => {}
    }
  },
  beforeUnmount () {
    this.unwatchBuilderId()
  },
  computed: {
    topDeck () {
      if (!this._deck && this.snapshots.length) return this.snapshots[0]
      if (this._deck && this.$store.state.builder.deck.id === this._deck.id) return this.$store.state.builder.deck
      return this._deck
    },
    showMine () {
      return this.$route.meta.showMine
    },
    title () {
      return deckTitle(this.topDeck)
    },
  },
  methods: {
    loadDeck () {
      // When viewing public deck history, there's no need to load the latest public snapshot
      // because it will be in the list already
      if (!this.showMine) {
        return
      }
      request(`/v2/decks/${this.id}`, { params: { show_saved: true } }).then(response => {
        this._deck = response.data.deck
        // And set the site title
        document.title = `Private history for: ${this._deck.title || 'Untitled ' + this._deck.phoenixborn.name} - Ashes.live`
      }).catch(error => {
        this.handleResponseError(error)
        this.error = true
      })
    },
    loadSnapshots () {
      // TODO: figure out how to handle pagination/endless scrolling
      const options = {}
      if (!this.showMine) {
        options.params = { show_public_only: true }
      }
      request(`/v2/decks/${this.id}/snapshots`, options).then(response => {
        this.snapshots = response.data.results
        this.nextSnapshots = response.data.next
        // Set the site title, if necessary
        if (!this.showMine) {
          document.title = `History for: ${this.topDeck.title || 'Untitled ' + this.topDeck.phoenixborn.name} - Ashes.live`
        }
      }).catch(error => {
        this.handleResponseError(error)
        this.error = true
      })
    },
  },
}
</script>
