<template>
  <div v-if="loading" class="text-center text-gray text-2xl py-8 px-4">
    <i class="fas fa-circle-notch fa-spin"></i> Loading...
  </div>
  <div v-else-if="(!decks || !decks.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No Decks found</h2>
  </div>
  <div v-else-if="decks && decks.length">
      <deck v-for="deck of decks" :key="deck.id" :deck="deck" />

      <router-link v-if="hasMoreDecks" :to="'/decks?player=' + badge">
        See all of {{username}}'s decks
      </router-link>
  </div>

</template>

<script>
import { request } from '/src/utils/index.js'
import Deck from '/src/components/decks/Deck.vue'

export default {
  name: 'CardUsage',
  props: ['badge', 'username'],
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
    request(`/v2/decks?limit=10&player=${this.badge}`).then(response => {
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
