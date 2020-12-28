<template>
  <div v-if="cards && cards.length" class="mt-1">
    <strong>{{typeLabel}}</strong> ({{ count }})
    <ul class="mt-1">
      <li v-for="(card, index) of cards" :key="index">
        <span>{{ card.count }}x <card-link :card="card"></card-link></span>
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
    }
  },
}
</script>
