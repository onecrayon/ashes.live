<template>
<div v-if="error">
    <h1 class="phg-discard">No deck found</h1>

    <p class="text-lg">
      Sorry, this does not appear to be a valid deck!
    </p>
  </div>
  <div v-else-if="!deck">
    <h1 class="phg-side-action text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else>
    <h1 class="phg-side-action">{{ deck.title }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        class="mb-4 deck-container col-span-2 flex flex-row">
        <img :src="phoenixbornImagePath" />
        <div class="text-xs">
          <div class="text-3xl">
            <card-link :card="deck.phoenixborn"></card-link>
          </div>
          <div class="m-0 font-bold text-xl flex flex-col sm:flex-row">
            <deck-dice :dice="deck.dice" />
          </div>
          <hr class="mb-4 mt-4" />
          <div class="mb-1">
            
            <span class="text-sm float-right font-bold" :class="[ cardsCount != 30 ? 'deck-not-full' : '']">
              {{ cardsCount }}/30
            </span>
          </div>
          <deck-cards-preview :cards="deck.cards" :conjurations="deck.conjurations" />
        </div>
      </div>
      <div class="flex flex-col">
          <span class="text-sm">
            <user-badge :user="deck.user" />
          </span>
          <span class="text-sm float-right text-gray-darker">
            Last updated: {{ lastUpdatedDateFormatted }} ago
          </span>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '/src/utils.js'
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import DeckCardsPreview from './DeckCardsPreview.vue'
import DeckDice from './DeckDice.vue'
import UserBadge from '../users/UserBadge.vue'

export default {
  name: 'DeckDetails',
  props: ['id'],
  components: {
    DeckCardsPreview,
    DeckDice,
    UserBadge,
  },
  data () {
    return {
      deck: null,
      releases: null,
      error: false,
    }
  },
  beforeMount () {
    request(`/v2/decks/${this.id}`).then(response => {
      this.deck = response.data.deck
      this.releases = response.data.releases
      // And set the site title
      document.title = `${this.deck.title} - Ashes.live`
    }).catch(error => {
      this.error = true
    })
  },
  computed: {
    phoenixbornImagePath () {
      return this.deck.is_legacy ? `https://cdn.ashes.live/legacy/images/cards/${this.deck.phoenixborn.stub}-slice.jpg` : `https://cdn.ashes.live/images/phoenixborn/${this.deck.phoenixborn.stub}.jpg`
    },
    lastUpdatedDateFormatted () {
      return formatDistanceToNowStrict(parseISO(this.deck.modified))
    },
    cardsCount () {
      return this.deck.cards.reduce((prev, card) => {
        return prev + card.count
      }, 0)
    },
  },
}
</script>
<style scoped>
.deck-container {
  background-repeat: no-repeat;
}
</style>