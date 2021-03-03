<template>
  <div
    class="border border-gray bg-white mt-4 mb-4 pl-12 bg-no-repeat"
    :style="`background-image: url(${phoenixbornImagePath})`">
    <div class="p-2 text-xs">
      <div class="m-0 font-bold text-xl flex flex-col sm:flex-row">
        <span class="flex-grow pt-0 sm:pt-2">
          <router-link :to="linkTarget" class="text-black" :class="{'italic font-normal': !deckData.title}">{{ title }}</router-link>
        </span>
        <deck-dice :dice="deckData.dice" />
      </div>
      <div class="flex flex-col sm:flex-row sm:items-end">
        <span class="flex-grow text-sm">
          <player-badge v-if="!showMine || deckData.is_legacy" :user="deckData.user" />
          <span v-else>
            <deck-edit-buttons :id="deck.id" :title="title" @deleted="$emit('refresh')"></deck-edit-buttons>
          </span>
        </span>
        <span class="text-sm float-right text-gray-darker">
          Last updated: {{ lastUpdatedDateFormatted }} ago
        </span>
      </div>
      <hr class="mb-1 mt-1" />
      <div class="mb-1">
        <span class="text-lg">
          <card-link :card="deckData.phoenixborn"></card-link>
        </span>
        <span class="text-sm float-right font-bold" :class="{'text-red': cardsCount !== 30, 'text-gray': cardsCount === 30}">
          {{ cardsCount }} / 30
        </span>
      </div>
      <deck-cards-preview :cards="deckData.cards" :conjurations="deckData.conjurations" />
    </div>
  </div>
</template>

<script>
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import { getPhoenixbornImageUrl } from '/src/utils.js'
import DeckCardsPreview from './DeckCardsPreview.vue'
import DeckDice from './DeckDice.vue'
import DeckEditButtons from '../shared/DeckEditButtons.vue'
import PlayerBadge from '../shared/PlayerBadge.vue'

export default {
  name: 'Deck',
  props: {
    deck: {
      required: true,
    },
    showMine: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['refresh'],
  components: {
    DeckCardsPreview,
    DeckEditButtons,
    DeckDice,
    PlayerBadge,
  },
  computed: {
    isCurrentlyEditing () {
      return this.$store.state.builder.deck.id === this.deck.id
    },
    deckData () {
      // If we are looking at a private saved copy deck listing and this deck is being actively
      // edited, grab our data from the store instead of the listing info to ensure it's up-to-date
      if (this.showMine && this.isCurrentlyEditing) return this.$store.state.builder.deck
      return this.deck
    },
    linkTarget () {
      const viewName = this.showMine ? 'PrivateDeckDetails' : 'DeckDetails'
      return {
        name: viewName,
        params: { id: this.deckData.id },
      }
    },
    lastUpdatedDateFormatted () {
      return formatDistanceToNowStrict(parseISO(this.deckData.modified))
    },
    cardsCount () {
      return this.deckData.cards.reduce((prev, card) => {
        return prev + card.count
      }, 0)
    },
    phoenixbornImagePath () {
      return getPhoenixbornImageUrl(this.deckData.phoenixborn.stub, false, this.deckData.is_legacy)
    },
    title () {
      return this.deckData.title || `Untitled ${this.deckData.phoenixborn.name}`
    },
  },
  watch: {
    isCurrentlyEditing (value, oldValue) {
      if (oldValue && !value) {
        // We're exiting an editing session for this deck, so refresh the listing
        this.$emit('refresh')
      }
    },
  }
}
</script>
