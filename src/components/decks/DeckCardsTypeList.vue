<template>
  <div v-if="cards && cards.length" class="mt-1">
    <h3 class="text-base m-0 font-normal border-gray-light" :class="{'mb-4': isBinderView, 'border-b pb-1': !inlineDisplay}">
      <span v-if="!sortedByType && releases && typeLabel != 'Conjurations'">
        <router-link :to="{name: 'Cards', query: {r: releaseNameToStub[typeLabel]}}" class="text-black">
          {{typeLabel}}
        </router-link>
        <span class="text-gray-darker font-normal"> ({{ count }})</span>
      </span>
      <span v-else>
        <i v-if="sortedByType || typeLabel == 'Conjurations'" :class="[typeIcon]"></i>
        <span :class="{'pl-1': sortedByType || typeLabel == 'Conjurations'}">{{typeLabel}}</span> <span class="text-gray-darker font-normal">({{ count }})</span>
      </span>
    </h3>
    <ul class="mt-1" v-if="!isBinderView">
      <li v-for="(card, index) of cards" :key="index" class="flex">
        <span class="flex-none">{{ card.count }}&times;&nbsp;</span>
        <span class="flex-grow">
          <card-link :card="card"></card-link><span v-if="card.phoenixborn" class="text-gray"> ({{ card.phoenixborn.split(/,?[ ]/)[0] }})</span>
        </span>
      </li>
    </ul>
    <ul v-else class="mt-1 grid gap-4 grid-flow-row auto-cols-auto" :class="[$style.cardColumns]">
      <li v-for="card of cards" :key="card.stub">
        <card :card="card" :qty="card.count"></card>
      </li>
    </ul>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'
import Card from '../shared/Card.vue'

const countCards = cards => cards.reduce((acc, card) => acc + card.count, 0)

export default {
  name: 'DeckCardsTypeList',
  props: {
    typeLabel: {
      required: true
    },
    cards: {
      required: true
    },
    galleryStyle: {
      type: String,
      default: 'list',
    },
    inlineDisplay: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Card,
  },
  computed: {
    count() {
      return countCards(this.cards)
    },
    typeIcon () {
      const typeClass = typeToFontAwesome[this.cards[0].type]
      return typeClass ? typeClass : 'fa-question-circle'
    },
    isBinderView () {
      return this.galleryStyle == "binder"
    },
    sortedByType () {
      return this.inlineDisplay || this.$store.state.options.deckSort == 'type'
    },
    releases () {
      const releases = this.$store.state.cards.releases
      return releases ? releases : []
    },
    releaseNameToStub () {
      // The releases state is guaranteed to be populated because the DeckCardsPreview component further up the chain fetches them
      return Object.fromEntries(this.releases.map((release) => [release.name, release.stub]))
    },
  },
}
</script>

<style lang="postcss" module>
.cardColumns {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>
