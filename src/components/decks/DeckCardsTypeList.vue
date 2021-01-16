<template>
  <div v-if="cards && cards.length" class="mt-1">
    <i :class="[typeIcon]"></i>
    <strong class="text-base font-medium pl-1">{{typeLabel}}</strong> ({{ count }})
    <ul class="mt-1">
      <li v-for="(card, index) of cards" :key="index">
        <span>{{ card.count }}x <card-link :card="card"></card-link></span>
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
