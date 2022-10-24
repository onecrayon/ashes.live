<template>
  <h1>Recent Decks using this card</h1>
  <div v-if="loading" class="text-center text-gray text-2xl py-8 px-4">
    <i class="fas fa-circle-notch fa-spin"></i> Loading...
  </div>
  <div v-else-if="(!decks || !decks.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No Decks found</h2>
  </div>
  <div v-else-if="decks && decks.length">
      <deck v-for="deck of decks" :key="deck.id" :deck="deck" />

      <router-link v-if="hasMoreDecks" :to="'/decks?card=' + stub">
        See all decks using this card
      </router-link>
  </div>

</template>

<script>
import { request } from '/src/utils/index.js'
import Deck from '/src/components/decks/Deck.vue'

export default {
  name: 'CardUsage',
  props: ['stub'],
  components: {
    Deck,
  },
  data: () => ({
    loading: true,
    decks: null,
    hasMoreDecks: null,
    error: false,
  }),
  beforeMount () {
    request(`/v2/decks?limit=10&card=${this.stub}`).then(response => {
      this.hasMoreDecks = response.data.count > 10
      this.decks = response.data.results
      this.loading=false;
    }).catch(error => {
      this.error = true;
      this.loading=false;
    })
  }
}
</script>
