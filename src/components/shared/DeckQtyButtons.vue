<template>
  <div v-if="isDeckbuilderActive && isNotConjuration">
    <div v-if="isPhoenixborn"
      :class="{
        shadow: isPopup,
        'inline-block': !standalone,
      }">
      <span
        v-if="deckPhoenixborn && deckPhoenixborn.stub == card.stub"
        :class="[$style.btn, $style.btnActive, $style.btnFirst, $style.btnLast, standalone ? `${$style.standalone} w-full` : '']">
        <i class="fas fa-check-square"></i> In use
      </span>
      <button v-else
        :class="[$style.btn, $style.btnFirst, $style.btnLast, standalone ? `${$style.standalone} w-full` : '']"
        @click="usePhoenixborn">
        <span v-if="!deckPhoenixborn">
          <i class="fas fa-plus"></i> Use
        </span>
        <span v-else>
          <i class="fas fa-exchange-alt"></i> Swap
        </span>
      </button>
    </div>
    <div v-else
      :class="{
        shadow: isPopup,
        'inline-block': !standalone,
      }">
      <button
        v-for="count of Array(4).keys()" :key="count"
        :class="{
          [$style.btn]: true,
          [$style.btnActive]: deckCount === count,
          [$style.btnFirst]: count === 0,
          [$style.btnLast]: count === 3,
          [$style.standalone]: standalone,
        }"
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

  &.standalone {
    @apply border-b-2;
  }
}

.btnFirst {
  @apply rounded-tl-md;

  &.standalone {
    @apply rounded-bl-md;
  }
}

.btnLast {
  @apply rounded-tr-md border-r-2;

  &.standalone {
    @apply rounded-br-md;
  }
}

.btnActive {
  @apply bg-gray-darker text-gray-light;
}
</style>
