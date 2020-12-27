<template>
  <div v-if="cards && cards.length">
    {{typeLabel}} ({{ count }})
    <ul>
      <li v-for="(card, index) of cards" :key="index">
        <span>{{ card.count }} x {{card.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
const countCards = cards => cards.reduce((acc, card) => acc + card.count, 0)

export default {
  name: 'DeckCardsTypeList',
  props: ['typeLabel', 'cards'],
  computed: {
    count() {
      return countCards(this.cards)
    },
  },
}
</script>
