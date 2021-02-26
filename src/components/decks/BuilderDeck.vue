<template>
  <div class="flex mb-4">
    <h2 class="text-lg flex-grow m-0 font-bold">
      <i :class="typeClass('Phoenixborn')"></i>
      {{ phoenixborn.name }}
    </h2>
    <button class="flex-none text-xl" title="Toggle Phoenixborn details" @click="showPhoenixbornDetails = !showPhoenixbornDetails">
      <i class="fas" :class="{
        'fa-chevron-down': !showPhoenixbornDetails,
        'fa-chevron-up': showPhoenixbornDetails
      }"></i>
    </button>
  </div>
  <!-- TODO: add a nice height transition here when toggling open or closed -->
  <div v-if="showPhoenixbornDetails" class="mb-4 text-sm">
    <div v-if="phoenixbornCard" class="text-center -mb-2.5">
      <span
        class="inline-block border border-red-light px-1 bg-white">Battlefield <strong>{{ phoenixbornCard.battlefield }}</strong></span>
      <span
        class="inline-block border border-green-light px-1 mx-1 bg-white">Life <strong>{{ phoenixbornCard.life }}</strong></span>
      <span
        class="inline-block border border-blue-dark px-1 bg-white">Spellboard <strong>{{ phoenixbornCard.spellboard }}</strong></span>
    </div>
    <card-codes
      v-if="phoenixbornCard"
      class="border-gray border rounded px-2 py-1 pt-4 m-0"
      :content="phoenixbornCard.text"
      is-card-effect></card-codes>
  </div>
  <ul class="grid gap-2 mb-4" :class="$style.autoFitDiceGrid">
    <li v-for="(die, index) of diceList" :key="index"
        class="die w-8 h-8 text-xl text-center"
        :class="[die ? `${die} cursor-pointer` : 'basic', 'phg-' + (die ? die + '-power' : 'basic-magic')]"
        @click="reduceDieCount(die)">
        <span class="alt-text">{{ die ? `Remove ${die.name} die` : '(empty)' }}</span>
    </li>
  </ul>
  <div class="grid gap-2" :class="$style.autoFitControlsGrid">
    <die-counter v-for="dieName of allDiceTypes" :key="dieName" :name="dieName"></die-counter>
  </div>
  <!-- TODO: do I want to implement the "Clear dice" and "Set filters" buttons? Not sure anyone actually used them... -->
  <hr class="mt-6 mb-4">

  <h3>Cards <span class="text-gray">(<span :class="{'text-red': totalCards > 30}">{{ totalCards }} / 30</span>)</span></h3>

  <div v-for="section of deckSections" :key="section.title">
    <h4><i :class="typeClass(section.contents[0].type)"></i> {{ section.title }} <span class="text-gray">({{ section.count }})</span></h4>
    <ul class="mb-4">
      <li v-for="card of section.contents" :key="card.stub" class="mb-1">
        <div class="flex">
          <deck-qty-buttons class="flex-none mr-1" :card="card" standalone></deck-qty-buttons>
          <div class="flex-grow pt-0.5">
            <card-link :card="card"></card-link>
            <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
              ({{ card.phoenixborn.split(' ')[0] }})
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-if="conjurations">
    <hr class="mt-6 mb-4">
    <h4><i :class="typeClass('Conjuration')"></i> Conjurations <span class="text-gray">({{ totalConjurations }})</span></h4>
    <ul>
      <li v-for="card of conjurations" :key="card.stub" class="mb-1">
        {{ card.count }}&times; <card-link :card="card"></card-link>
        <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
          ({{ card.phoenixborn.split(' ')[0] }})
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { diceList, typeToFontAwesome } from '/src/constants.js'
import { capitalize } from '/src/utils.js'
import useHandleResponseError from '/src/composites/useHandleResponseError.js'
import CardCodes from '../shared/CardCodes.vue'
import DieCounter from './DieCounter.vue'
import DeckQtyButtons from '../shared/DeckQtyButtons.vue'

export default {
  name: 'BuilderDeck',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    phoenixbornCard: null,
  }),
  components: {
    CardCodes,
    DieCounter,
    DeckQtyButtons,
  },
  async mounted () {
    if (this.showPhoenixbornDetails) {
      await this.loadPhoenixbornCard()
    }
  },
  computed: {
    allDiceTypes () {
      return diceList
    },
    phoenixborn () {
      return this.$store.state.builder.deck.phoenixborn
    },
    showPhoenixbornDetails: {
      get () {
        return this.$store.state.options.showPhoenixbornDetails
      },
      async set (value) {
        if (!this.phoenixbornCard && value) {
          await this.loadPhoenixbornCard()
        }
        this.$store.commit('options/setShowPhoenixbornDetails', value)
      },
    },
    diceList () {
      let diceArray = new Array(10)
      let nextIndex = 0
      for (const dieObject of this.$store.state.builder.deck.dice) {
        const numDice = dieObject.count
        const maxIndex = nextIndex + numDice
        while (nextIndex < maxIndex && nextIndex < 10) {
          diceArray[nextIndex] = dieObject.name
          nextIndex++
        }
      }
      while (nextIndex < 10) {
        diceArray[nextIndex] = null
        nextIndex++
      }
      return diceArray
    },
    totalCards () {
      return this.$store.getters['builder/totalCards']
    },
    deckSections () {
      return this.$store.getters['builder/deckSections']
    },
    conjurations () {
      return this.$store.state.builder.deck.conjurations
    },
    totalConjurations () {
      return this.$store.state.builder.deck.conjurations.reduce((value, card) => value + card.count, 0)
    },
  },
  methods: {
    capitalize,
    async loadPhoenixbornCard () {
      if (this.phoenixborn) {
        this.phoenixbornCard = await this.$store.dispatch('cards/fetchCard', this.phoenixborn)
      }
    },
    reduceDieCount (dieName) {
      if (!dieName) return
      this.$store.dispatch('builder/reduceDieCount', dieName).catch(this.handleResponseError)
    },
    typeClass (type) {
      return typeToFontAwesome[type]
    },
  },
}
</script>

<style lang="postcss" module>
.autoFitDiceGrid {
  grid-template-columns: repeat( auto-fit, minmax(32px, 1fr) );
}

.autoFitControlsGrid {
  grid-template-columns: repeat( auto-fit, minmax(107px, 1fr) );
}
</style>
