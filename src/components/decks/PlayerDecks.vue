<template>
  <h1 class="phg-basic-magic mb-8">My decks</h1>

  <div v-if="!showLegacy" class="sm:flex">
    <div class="sm:order-2 sm:w-80 sm:ml-8 sm:flex-none flex flex-col mb-8">
      <router-link to="/decks/mine/legacy/" class="btn px-4 py-2">
        <i class="fas fa-archive"></i>
        View legacy decks
      </router-link>
    </div>
    <div class="sm:order-1 flex-grow">
      <p class="mt-0 mb-8"><span class="font-bold text-lg">By default, your decks are completely private.</span> When you are happy with your deck, you can publish it for other players to see. After a deck is published, further edits to the deck will remain private until you publish it again.</p>
    </div>
  </div>
  <div v-else>
    <p class="text-l border-2 border-orange rounded bg-inexhaustible px-4 py-2 mb-8">
      You are viewing your archived <strong class="text-gray-darker">Ashes Legacy</strong> decks, which cannot be edited. <router-link to="/decks/mine/">View Ashes Reborn decks instead</router-link>.
    </p>
  </div>

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
  },
}
</script>
