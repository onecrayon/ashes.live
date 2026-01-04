<template>
  <div :class="[ columnLayout ? 'text-base': 'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2']">
    <deck-cards-type-list
      v-for="section of deckSections" :key="section.title"
      :cards="section.contents"
      class="mb-4"
      :typeLabel="section.title"
      :gallery-style="galleryStyle" />
    <deck-cards-type-list :cards="this.deck.conjurations" class="mb-4" typeLabel="Conjurations" :gallery-style="galleryStyle" />
  </div>
</template>

<script>
import { deckToSections } from '/src/utils/decks.js'
import DeckCardsTypeList from './DeckCardsTypeList.vue'

export default {
  name: 'DeckCardsPreview',
  props: {
    deck: null,
    columnLayout: false,
    galleryStyle: 'list',
  },
  components: {
    DeckCardsTypeList,
  },
  computed: {
    deckSections () {
      return deckToSections(this.deck)
    },
  },
}
</script>
