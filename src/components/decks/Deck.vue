<template>
  <div
    class="border border-gray bg-white mt-4 mb-4">
    <div class="p-2 text-xs">
      <div class="m-0 font-bold text-xl">
        <router-link :to="linkTarget" class="text-black">{{ deck.title }}</router-link>
        <span class="float-right">
          <deck-dice :dice="deck.dice" />
        </span>
      </div>
      <div class="clear-right">
        <span class="text-sm">
          {{ deck.user.username }}
        </span>
        <span class="text-sm float-right">
          Last updated: {{ lastUpdatedDateFormatted }} ago
        </span>
      </div>
      <hr />
      <div class="mt-1 mb-1">
        <span class="text-lg">
          <card-link :card="deck.phoenixborn"></card-link>
        </span>
        <span class="text-sm float-right">
          {{ cardsCount }}/30
        </span>
      </div>
      <deck-cards-preview :cards="deck.cards" :conjurations="deck.conjurations" />
    </div>
  </div>
</template>

<script>
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import { typeToFontAwesome } from '/src/constants.js'
import DeckCardsPreview from './DeckCardsPreview.vue'
import DeckDice from './DeckDice.vue'

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
    }
  },
  methods: {
  },
}
</script>