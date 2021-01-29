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
  },
}
</script>
