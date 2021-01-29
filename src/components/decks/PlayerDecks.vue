<template>
  <h1 class="phg-basic-magic">My decks</h1>

  <!-- TODO: Add link/button for creating a new deck when viewing non-legacy decks -->
  <!-- TODO: Add link/button for viewing legacy decks -->

  <deck-listing show-mine></deck-listing>
</template>

<script>
import DeckListing from './DeckListing.vue'

export default {
  name: 'PlayerDecks',
  components: {
    DeckListing,
  },
}
</script>
