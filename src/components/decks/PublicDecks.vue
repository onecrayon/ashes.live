<template>
  <h1 :class="{'phg-exhaust': showLegacy, 'phg-red-rain': showRedRains, 'phg-main-action': !showLegacy && !showRedRains}">
    Browse Decks
  </h1>

  <nav role="group" aria-label="Deck types">
    <ul class="sm:flex text-center text-lg mb-4">
      <li class="sm:flex-auto">
        <router-link
          :to="{name: 'Decks'}"
          class="phg-main-action block mb-2 sm:mb-0 btn sm:btn-first hover:no-underline text-black"
          :class="{'active cursor-text': !showLegacy && !showRedRains}">
          Competitive
        </router-link>
      </li>
      <li class="flex-auto">
        <router-link
          :to="{name: 'RedRainsDecks'}"
          class="phg-red-rain block mb-2 sm:mb-0 btn sm:btn-inner hover:no-underline text-black"
          :class="{'active cursor-text': showRedRains}">
          Red Rains
        </router-link>
      </li>
      <li class="flex-auto">
        <router-link
          :to="{name: 'LegacyDecks'}"
          class="phg-exhaust block mb-2 sm:mb-0 btn sm:btn-last hover:no-underline text-black"
          :class="{'active cursor-text': showLegacy}">
          Legacy
        </router-link>
      </li>
    </ul>
  </nav>

  <deck-listing></deck-listing>
</template>

<script>
import DeckListing from './DeckListing.vue'

export default {
  name: 'PublicDecks',
  components: {
    DeckListing,
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    },
    showRedRains () {
      return !!this.$route.meta.showRedRains
    },
  },
}
</script>
