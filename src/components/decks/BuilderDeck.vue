<template>
  <div class="flex mb-4">
    <h2 class="text-lg flex-grow m-0 font-bold">
      {{ phoenixborn.name }}
    </h2>
    <button class="flex-none text-xl" title="Toggle Phoenixborn details" @click="showPhoenixbornDetails = !showPhoenixbornDetails">
      <i class="fas" :class="{
        'fa-chevron-down': !showPhoenixbornDetails,
        'fa-chevron-up': showPhoenixbornDetails
      }"></i>
    </button>
  </div>
  <!-- TODO: add a nice height transition here -->
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
  <ul class="flex flex-wrap justify-between">
    <li v-for="(die, index) of diceList" :key="index"
        class="die flex-none w-8 h-8 text-xl text-center"
        :class="[die ? `${die} cursor-pointer` : 'basic', 'phg-' + (die ? die + '-power' : 'basic-magic')]"
        @click="reduceDieCount(die)">
        <span class="alt-text">{{ die ? `Remove ${die.name} die` : '(empty)' }}</span>
    </li>
  </ul>
</template>

<script>
import { capitalize } from '/src/utils.js'
import useHandleResponseError from '/src/composites/useHandleResponseError.js'
import CardCodes from '../shared/CardCodes.vue'

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
  },
  async mounted () {
    if (this.showPhoenixbornDetails) {
      await this.loadPhoenixbornCard()
    }
  },
  computed: {
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
  },
}
</script>
