<template>
  <div
    class="border border-gray bg-white mt-4 mb-4 pl-12 bg-no-repeat relative"
    :class="{
      'border-inexhaustible-dark': showBadges && !deck.is_public,
      'border-reaction-dark': showBadges && !deck.is_snapshot,
    }"
    :style="`background-image: url(${phoenixbornImagePath})`">
    <div
      v-if="showBadges"
      class="absolute inset-x-0 text-center text-sm -top-3">
      <span v-if="!deck.is_snapshot" class="inline-block rounded-full px-2 leading-tight text-white bg-reaction-dark">
        <i class="far fa-clock"></i>
        Latest
      </span>
      <span v-else-if="!deck.is_public" class="inline-block rounded-full px-2 leading-tight text-white bg-inexhaustible-dark">
        <i class="far fa-eye-slash pl-1"></i>
        Private
      </span>
      <span v-else class="inline-block rounded-full px-2 leading-tight text-white bg-gray">
        <i class="far fa-eye pl-1"></i>
        Public
      </span>
    </div>
    <div class="p-2 text-xs">
      <div class="m-0 sm:mb-1 font-bold text-xl flex flex-col sm:flex-row">
        <span class="flex-grow pt-0 sm:pt-2 mb-2 sm:mb-0">
          <router-link :to="linkTarget" class="text-black" :class="{'italic font-normal': !deckData.title}">{{ title }}</router-link>
        </span>
        <deck-dice :dice="deckData.dice" />
      </div>
      <div class="flex flex-col sm:flex-row sm:items-end">
        <span class="flex-grow text-sm">
          <player-badge v-if="!showMine || deckData.is_legacy" :user="deckData.user" />
          <span v-else>
            <deck-edit-buttons :deck="deck" @deleted="$emit('refresh')" @refresh="$emit('refresh')" :include-share-link="includeShareLink"></deck-edit-buttons>
          </span>
        </span>
        <span class="text-sm float-right text-gray-darker">
          Last updated: <time :datetime="deck.modified" :title="format(parsedDate, 'yyyy-MM-dd kk:mm OOO')">{{ formatDistanceToNowStrict(parsedDate) }} ago</time>
        </span>
      </div>

      <div v-if="showCards">
        <hr class="mb-1 mt-2" />
        <div class="mb-1">
          <span class="text-lg">
            <card-link :card="deckData.phoenixborn"></card-link>
          </span>
          <span class="text-sm float-right font-bold" :class="{'text-red': cardsCount !== 30, 'text-gray': cardsCount === 30}">
            {{ cardsCount }} / 30
          </span>
        </div>
        <deck-cards-preview :deck="deckData" inline-display />
      </div>
    </div>
  </div>
</template>

<script>
import { parseISO, format, formatDistanceToNowStrict } from 'date-fns'
import { getPhoenixbornImageUrl } from '/src/utils/index.js'
import { deckTitle } from '/src/utils/decks.js'
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
    showBadges: {
      type: Boolean,
      default: false,
    },
    useDirectLinks: {
      type: Boolean,
      default: false,
    },
    includeShareLink: {
      type: Boolean,
      default: false,
    },
    showCards: {
      type: Boolean,
      default: true,
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
      const viewName = this.showMine && !this.deck.is_public ? 'PrivateDeckDetails' : 'DeckDetails'
      return {
        name: viewName,
        params: { id: this.deckData.is_snapshot && !this.useDirectLinks ? this.deckData.source_id : this.deckData.id },
      }
    },
    parsedDate () {
      return parseISO(this.deckData.modified)
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
      return deckTitle(this.deckData)
    },
  },
  methods: {
    format,
    formatDistanceToNowStrict,
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
