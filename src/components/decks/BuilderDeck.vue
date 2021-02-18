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
</template>

<script>
import CardCodes from '../shared/CardCodes.vue'

export default {
  name: 'BuilderDeck',
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
  },
  methods: {
    async loadPhoenixbornCard () {
      if (this.phoenixborn) {
        this.phoenixbornCard = await this.$store.dispatch('cards/fetchCard', this.phoenixborn)
      }
    }
  }
}
</script>
