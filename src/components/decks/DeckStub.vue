<template>
  <div
    class="border border-gray bg-white mt-4 mb-4 pl-12 bg-no-repeat relative"
    :style="`background-image: url(${phoenixbornImagePath})`">
    <div class="p-2 text-xs">
      <h3 class="m-0 mb-1 font-bold text-xl">
        <router-link :to="linkTarget" class="text-black" :class="{'italic font-normal': !deck.title}">{{ title }}</router-link>
      </h3>
      <div class="flex flex-col sm:flex-row sm:items-end mb-1">
        <span class="flex-grow text-sm">
          <player-badge :user="deck.user" />
        </span>
        <span class="text-sm float-right text-gray-darker">
          Last updated: {{ lastUpdatedDateFormatted }} ago
        </span>
      </div>
      <deck-dice :dice="deck.dice" :auto-fit="true" />
    </div>
  </div>
</template>

<script>
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import { getPhoenixbornImageUrl } from '/src/utils/index.js'
import { deckTitle } from '/src/utils/decks.js'
import DeckDice from './DeckDice.vue'
import PlayerBadge from '../shared/PlayerBadge.vue'

export default {
  name: 'DeckStub',
  props: {
    deck: {
      required: true,
    },
  },
  components: {
    DeckDice,
    PlayerBadge,
  },
  computed: {
    linkTarget () {
      return {
        name: 'DeckDetails',
        params: { id: this.deck.is_snapshot ? this.deck.source_id : this.deck.id },
      }
    },
    lastUpdatedDateFormatted () {
      return formatDistanceToNowStrict(parseISO(this.deck.modified))
    },
    title () {
      return deckTitle(this.deck)
    },
    phoenixbornImagePath () {
      return getPhoenixbornImageUrl(this.deck.phoenixborn.stub, false, this.deck.is_legacy)
    },
  },
}
</script>
