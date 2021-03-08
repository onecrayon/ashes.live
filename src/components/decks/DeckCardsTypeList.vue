<template>
  <div v-if="cards && cards.length" class="mt-1">
    <i :class="[typeIcon]"></i>
    <strong class="text-base font-normal pl-1">{{typeLabel}}</strong> <span class="text-gray-darker">({{ count }})</span>
    <ul class="mt-1">
      <li v-for="(card, index) of cards" :key="index" class="flex">
        <span class="flex-none">{{ card.count }}&times;&nbsp;</span>
        <span class="flex-grow">
          <card-link :card="card"></card-link><span v-if="card.phoenixborn" class="text-gray"> ({{ card.phoenixborn.split(/,?[ ]/)[0] }})</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'

const countCards = cards => cards.reduce((acc, card) => acc + card.count, 0)

export default {
  name: 'DeckCardsTypeList',
  props: ['typeLabel', 'cards'],
  computed: {
    count() {
      return countCards(this.cards)
    },
    typeIcon () {
      const typeClass = typeToFontAwesome[this.cards[0].type]
      return typeClass ? typeClass : 'fa-question-circle'
    },
  },
}
</script>
