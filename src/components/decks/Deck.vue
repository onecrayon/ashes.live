<template>
  <div
    class="border border-gray bg-white mt-4 mb-4 deck-item pl-12"
    :style="`background-image: url(${phoenixbornImagePath})`">
    <div class="p-2 text-xs">
      <div class="m-0 font-bold text-xl flex flex-col sm:flex-row">
        <router-link :to="linkTarget" class="text-black flex-grow pt-0 sm:pt-2">{{ deck.title }}</router-link>
        <deck-dice :dice="deck.dice" />
      </div>
      <div class="flex flex-col sm:flex-row">
        <span class="flex-grow text-sm">
          <user-badge :user="deck.user" />
        </span>
        <span class="text-sm float-right text-gray-darker">
          Last updated: {{ lastUpdatedDateFormatted }} ago
        </span>
      </div>
      <hr class="mb-1 mt-1" />
      <div class="mb-1">
        <span class="text-lg">
          <card-link :card="deck.phoenixborn"></card-link>
        </span>
        <span class="text-sm float-right font-bold" :class="[ cardsCount != 30 ? 'deck-not-full' : '']">
          {{ cardsCount }}/30
        </span>
      </div>
      <deck-cards-preview :cards="deck.cards" :conjurations="deck.conjurations" />
    </div>
  </div>
</template>

<script>
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import DeckCardsPreview from './DeckCardsPreview.vue'
import DeckDice from './DeckDice.vue'
import UserBadge from '../users/UserBadge.vue'

export default {
  name: 'Deck',
  props: {
    deck: {
      required: true,
    },
  },
  components: {
    DeckCardsPreview,
    DeckDice,
    UserBadge,
  },
  computed: {
    linkTarget () {
      return {
        name: 'DeckDetails',
        params: { id: this.deck.id },
      }
    },
    lastUpdatedDateFormatted () {
      return formatDistanceToNowStrict(parseISO(this.deck.modified))
    },
    cardsCount () {
      return this.deck.cards.reduce((prev, card) => {
        return prev + card.count
      }, 0)
    },
    phoenixbornImagePath () {
      return this.deck.is_legacy ? `https://cdn.ashes.live/legacy/images/cards/${this.deck.phoenixborn.stub}-slice.jpg` : `https://cdn.ashes.live/images/phoenixborn-badges/${this.deck.phoenixborn.stub}.jpg`
    }
  },
}
</script>
<style scoped>
.deck-not-full {
  color: var(--color-red);
}

.deck-item {
  background-repeat: no-repeat;
}
</style>