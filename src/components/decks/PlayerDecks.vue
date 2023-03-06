<template>
  <h1 :class="{'phg-exhaust': showLegacy, 'phg-red-rain': showRedRains, 'phg-main-action': !showLegacy && !showRedRains}">
    My decks
  </h1>

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
import DeckListing from './DeckListing.vue'

export default {
  name: 'PlayerDecks',
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
