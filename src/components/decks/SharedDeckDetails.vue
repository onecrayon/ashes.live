<template>
  <div v-if="!deck">
    <h1 class="phg-natural-power text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else>
    <h1 class="phg-natural-power mb-6 pl-px" :class="{'italic font-normal': !deck.title}">{{ title }}</h1>
    <div class="lg:flex">
      <div class="mb-4 lg:pl-8 lg:w-1/3 lg:order-2">
        <p class="border-2 border-orange rounded bg-inexhaustible px-4 py-2 mb-8">
          <strong class="text-lg">This deck has been shared with you by <player-badge :user="deck.user"></player-badge>.</strong> <span v-if="!deck.is_public">Please do not post this link publicly.</span>
          You can use this link to import the deck into <a href="https://ashteki.com">Ashteki</a> or the <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2386753960">Ashes Reborn Tabletop Simulator mod</a>.
        </p>

        <button v-if="isAuthenticated" class="btn py-1 w-full" @click="copyAndEdit" :disabled="isTalkingToServer">
          <i class="far fa-copy"></i>
          Clone &amp; Edit
        </button>
      </div>
      <div class="lg:w-2/3 lg:order-1 flex">
        <div
          class="flex-none bg-no-repeat sm:pl-40"
          :class="$style.minHeight400"
          aria-hidden="true"
          :style="`background-image: url(${phoenixbornImagePath})`"></div>
        <div class="flex-grow pb-4">
          <h2 class="text-3xl">
            <card-link :card="deck.phoenixborn"></card-link>
          </h2>
          <ul class="mb-2 mt-2 text-xs">
            <strong
              v-if="deck.phoenixborn.battlefield !== undefined"
              class="inline-block border border-red-light px-1">Battlefield {{ deck.phoenixborn.battlefield }}</strong>
            <strong
              v-if="deck.phoenixborn.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life {{ deck.phoenixborn.life }}</strong>
            <strong
              v-if="deck.phoenixborn.spellboard !== undefined"
              class="inline-block border border-blue-dark px-1">Spellboard {{ deck.phoenixborn.spellboard }}</strong>
          </ul>
          <deck-dice class="my-2" :dice="deck.dice" />
          <hr class="mb-4 mt-4" />
          <h3 class="text-lg flex mb-1">
            <span class="flex-grow">Cards</span>
            <span class="flex-none text-sm font-bold" :class="[ cardsCount != 30 ? 'text-red' : 'text-gray-darker']">
              {{ cardsCount }}/30
            </span>
          </h3>
          <deck-cards-preview :deck="deck" :columnLayout="true"/>
        </div>
      </div>
    </div>
    <hr class="mb-4">
    <div v-if="deck.description">
      <h2>Description</h2>

      <card-codes :content="deck.description" :is-legacy="deck.is_legacy" needs-paragraphs></card-codes>
    </div>
  </div>
</template>

<script>
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import { request, getPhoenixbornImageUrl } from '/src/utils/index.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import CardCodes from '../shared/CardCodes.vue'
import DeckCardsPreview from './DeckCardsPreview.vue'
import DeckDice from './DeckDice.vue'
import PlayerBadge from '../shared/PlayerBadge.vue'

export default {
  name: 'SharedDeckDetails',
  props: ['uuid'],
  components: {
    CardCodes,
    DeckCardsPreview,
    DeckDice,
    PlayerBadge,
  },
  data () {
    return {
      deck: null,
      isTalkingToServer: false,
    }
  },
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  beforeMount () {
    this.loadDeck()
  },
  computed: {
    title () {
      return this.deck.title || `Untitled ${this.deck.phoenixborn.name}`
    },
    phoenixbornImagePath () {
      return getPhoenixbornImageUrl(this.deck.phoenixborn.stub, true, this.deck.is_legacy)
    },
    lastUpdatedDateFormatted () {
      return formatDistanceToNowStrict(parseISO(this.deck.modified))
    },
    cardsCount () {
      return this.deck.cards.reduce((prev, card) => {
        return prev + card.count
      }, 0)
    },
    isAuthenticated () {
      return this.$store.getters['player/isAuthenticated']
    },
  },
  methods: {
    loadDeck () {
      request(`/v2/decks/shared/${this.uuid}`).then(response => {
        this.deck = response.data
        // And set the site title
        document.title = `Shared: ${this.deck.title || 'Untitled ' + this.deck.phoenixborn.name} - Ashes.live`
      }).catch(error => {
        this.handleResponseError(error)
        this.$router.push('/')
      })
    },
    copyAndEdit () {
      this.isTalkingToServer = true
      this.$store.dispatch('builder/cloneDeck', {
        id: this.deck.id, directShareUuid: this.uuid
      }).catch(this.handleResponseError).finally(() => {
        this.isTalkingToServer = false
      })
    },
  },
}
</script>

<style lang="postcss" module>
.minHeight400 {
  min-height: 400px;
}
</style>
