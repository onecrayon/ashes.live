<template>
  <div :class="[ columnLayout ? 'text-base': 'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2']">
    <deck-cards-type-list
      v-for="section of deckSections" :key="section.title"
      :cards="section.contents"
      class="mb-4"
      :typeLabel="section.title"
      :gallery-style="deck.is_legacy ? 'list' : galleryStyle" />
    <deck-cards-type-list :cards="deck.conjurations" class="mb-4" typeLabel="Conjurations" :gallery-style="galleryStyle" />
  </div>
</template>

<script>
import { cardsByType, cardsByRelease } from '/src/utils/decks.js'
import DeckCardsTypeList from './DeckCardsTypeList.vue'

export default {
  name: 'DeckCardsPreview',
  props: {
    deck: null,
    columnLayout: false,
    galleryStyle: 'list',
  },
  data () {
    return {
      releases: null,
    }
  },
  components: {
    DeckCardsTypeList,
  },
  computed: {
    deckSections () {
      const isAsc = this.$store.state.options.deckOrder == 'asc'
      if (this.deck.is_legacy || this.$store.state.options.deckSort === 'type') {
        return cardsByType(this.deck, isAsc)
      } else {
        return cardsByRelease(this.deck, isAsc, this.releases ? this.releases.map((release) => release.name) : null)
      }
    },
  },
  created () {
    if (!this.deck.is_legacy) {
      this.loadData()
    }
  },
  methods: {
    async loadData () {
      this.releases = await this.$store.dispatch('cards/fetchReleases')
    },
  }
}
</script>
