<template>
  <div v-if="isDeckbuilderActive && isNotConjuration">
    <div v-if="isPhoenixborn" class="inline-block" :class="{shadow: isPopup}">
      <span v-if="deckPhoenixborn && deckPhoenixborn.stub == card.stub" :class="[$style.btn, $style.btnActive, $style.btnFirst, $style.btnLast]" title="In use"><i class="fas fa-check-square"></i></span>
      <button v-else :class="[$style.btn, $style.btnFirst, $style.btnLast]" :title="!deckPhoenixborn ? 'Use' : 'Swap'" @click="usePhoenixborn">
        <i v-if="!deckPhoenixborn" class="fas fa-plus"></i>
        <i v-else class="fas fa-exchange-alt"></i>
      </button>
    </div>
    <div v-else class="inline-block" :class="{shadow: isPopup}">
      <button
        v-for="count of Array(4).keys()" :key="count"
        :class="[$style.btn, deckCount === count ? $style.btnActive : '', count === 0 ? $style.btnFirst : '', count === 3 ? $style.btnLast : '']"
        @click="setCardCount(card, count)">
          {{ count }}
        </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeckQuantityButtons',
  props: {
    card: {
      required: true,
    },
    standalone: {
      type: Boolean,
      default: false,
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isPhoenixborn () {
      return this.card.type === 'Phoenixborn'
    },
    isDeckbuilderActive () {
      return this.$store.state.builder.enabled
    },
    isNotConjuration () {
      return this.card.type !== 'Conjuration' && this.card.type !== 'Conjured Alteration Spell'
    },
    deckPhoenixborn () {
      return this.$store.state.builder.deck.phoenixborn
    },
    deckCount () {
      return this.$store.state.builder.countMap[this.card.stub] || 0
    },
  },
  methods: {
    usePhoenixborn () {
      this.$store.dispatch('builder/setPhoenixborn', this.card)
    },
    setCardCount (card, count) {
      this.$store.dispatch('builder/setCardCount', {
        card,
        count,
      })
    },
  },
}
</script>

<style lang="postcss" module>
.btn {
  @apply appearance-none inline-block border-gray-darker bg-gray-light leading-none px-2 py-1 text-gray-darker font-bold text-center border-t-2 border-l-2;
  min-width: 32px;
}

.btnFirst {
  @apply rounded-tl-md;
}

.btnLast {
  @apply rounded-tr-md border-r-2;
}

.btnActive {
  @apply bg-gray-darker text-gray-light;
}
</style>
