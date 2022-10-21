<template>
  <h1>Recent Decks using these cards</h1>
  <div v-if="loading" class="text-center text-gray text-2xl py-8 px-4">
    <i class="fas fa-circle-notch fa-spin"></i> Loading...
  </div>
  <div v-else-if="(!decks || !decks.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No Decks found</h2>
    <p>
      <button class="btn btn-blue px-4 py-2">Be the First!</button>
    </p>
  </div>
  <div v-else-if="decks && decks.length">
      <deck v-for="deck of decks" :key="deck.id" :deck="deck" :show-cards="false">
      </deck>
    <div v-if="limit">
      <button class="btn px-4 py-2" @click="showAll">Show All</button>
    </div>
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
    limit: true,
    error: false,
  }),
  beforeMount () {
    request(`/v2/decks?card=${this.stub}`).then(response => {
      this.allDecks = response.data.results;
      this.decks = this.allDecks.slice(0, 5)
      console.log(this.allDecks);
      this.loading=false;
    }).catch(error => {
      this.error = true;
      this.loading=false;
    })
  },
  methods: {
    showAll () {
      this.limit = false;
      this.decks = this.allDecks;
    }
  }
}
</script>
