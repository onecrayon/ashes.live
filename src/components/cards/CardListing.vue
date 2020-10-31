<template>
  <h1 :class="{'phg-side-action': !showLegacy, 'phg-exhaust': showLegacy }">
    Browse {{ showLegacy ? 'legacy ' : '' }}cards
  </h1>

  <div class="lg:flex">
    <div class="mb-4 lg:ml-8 lg:order-2 lg:w-3/12">
      <p v-if="!showLegacy" class="text-l m-0">
        <!-- Using a named view because this is one of the more likely ones to move to a different route -->
        You are viewing <strong class="text-red">Ashes Reborn</strong> cards. <router-link :to="{name: 'LegacyCards'}">View Ashes Legacy cards instead</router-link>.
      </p>

      <div v-else>
        <p class="text-l border-2 border-orange rounded bg-inexhaustible px-4 py-2 m-0">
          You are viewing <strong class="text-gray-darker">Ashes Legacy</strong> cards. <router-link to="/cards">View Ashes Reborn cards instead</router-link>.
        </p>
        <p><span class="text-gray pr-1">†</span>Fan-made cards.</p>
      </div>
    </div>
    <div class="lg:order-1 lg:flex-grow">
      <card-browser :show-legacy="showLegacy"></card-browser>
    </div>
  </div>
</template>

<script>
import CardBrowser from '../shared/card_browser/CardBrowser.vue'

export default {
  name: 'CardListing',
  components: {
    CardBrowser,
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    }
  }
}
</script>
