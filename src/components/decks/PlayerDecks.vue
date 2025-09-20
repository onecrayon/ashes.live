<template>
  <h1 :class="{'phg-exhaust': showLegacy, 'phg-red-rain': showRedRains, 'phg-main-action': !showLegacy && !showRedRains}">
    My decks
  </h1>

  <p>
    <button class="btn btn-orange px-4 py-1 mb-4" @click="exportAllDecks"><i class="fas fa-cloud-upload"></i> Export all decks to AshesDB</button> <span class="text-gray-dark">(Safe to repeat after updating decks. Upcoming: export a single deck.)</span>
  </p>

  <p class="mt-0 mb-8"><span class="font-bold text-lg">By default, your decks are completely private.</span> When you are happy with your deck, you can publish it for other players to see. After a deck is published, further edits to the deck will remain private until you publish it again.</p>

  <nav role="group" aria-label="Deck types">
    <ul class="sm:flex text-center text-lg mb-4">
      <li class="sm:flex-auto">
        <router-link
          :to="{name: 'PlayerDecks'}"
          class="phg-main-action block mb-2 sm:mb-0 btn sm:btn-first hover:no-underline text-black"
          :class="{'active cursor-text': !showLegacy && !showRedRains}">
          Competitive
        </router-link>
      </li>
      <li class="flex-auto">
        <router-link
          :to="{name: 'RedRainsPlayerDecks'}"
          class="phg-red-rain block mb-2 sm:mb-0 btn sm:btn-inner hover:no-underline text-black"
          :class="{'active cursor-text': showRedRains}">
          Red Rains
        </router-link>
      </li>
      <li class="flex-auto">
        <router-link
          :to="{name: 'LegacyPlayerDecks'}"
          class="phg-exhaust block mb-2 sm:mb-0 btn sm:btn-last hover:no-underline text-black"
          :class="{'active cursor-text': showLegacy}">
          Legacy
        </router-link>
      </li>
    </ul>
  </nav>

  <deck-listing show-mine></deck-listing>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import DeckListing from './DeckListing.vue'

export default {
  name: 'PlayerDecks',
  components: {
    DeckListing,
  },
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    },
    showRedRains () {
      return !!this.$route.meta.showRedRains
    },
  },
  methods: {
    exportAllDecks () {
      console.log("attempting to trigger store method...")
      this.$store.dispatch('player/loadExportToken').then(exportToken => {
        console.log("attempting to open window...")
        window.open(`https://ashesdb.plaidhatgames.com/players/me/import/${exportToken}`)
      }).catch(() => {
        this.toast.error('Unable to load export token; please report this!')
      })
    },
  },
}
</script>
