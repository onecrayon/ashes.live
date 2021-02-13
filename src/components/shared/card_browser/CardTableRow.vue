<template>
  <div v-if="isDeckbuilderActive">
    <div v-if="isPhoenixborn">
        <span v-if="deckPhoenixborn && deckPhoenixborn.stub == card.stub"
          class="w-full"
          :class="[$style.btn, $style.btnActive, $style.btnFirst, $style.btnLast]">
          <i class="fas fa-check-square"></i> In use
        </span>
        <button v-else
          class="w-full"
          :class="[$style.btn, $style.btnFirst, $style.btnLast]" @click="usePhoenixborn">
          <span v-if="!deckPhoenixborn">
            <i class="fas fa-plus"></i> Use
          </span>
          <span v-else>
            <i class="fas fa-exchange-alt"></i> Swap
          </span>
        </button>
      </div>
      <div v-else>
        <button
          v-for="count of Array(4).keys()" :key="count"
          :class="[$style.btn, deckCount === count ? $style.btnActive : '', count === 0 ? $style.btnFirst : '', count === 3 ? $style.btnLast : '']"
          @click="setCardCount(card, count)">
            {{ count }}
          </button>
      </div>
  </div>
  <div class="w-8 text-center p-1 sm:border-b border-gray-light" :title="card.type">
    <i :class="[typeIcon(card)]"></i>
  </div>
  <div class="p-1 sm:border-b border-gray-light">
    <card-link :card="card"></card-link>
    <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
      ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
    </span>
    <span v-if="card.release.is_phg === false" class="text-gray pl-1">†</span>
  </div>
  <div class="py-1 sm:border-b sm:border-r border-gray-light text-gray-light text-right">
    <div v-if="card.conjurations && card.conjurations.length" class="px-2 inline-block">
      <card-link v-for="conjuration of card.conjurations" :key="conjuration.stub" :card="legacyConjuration(conjuration)">
        <i class="fas fa-plus-square"></i>
      </card-link>
    </div>
    <div v-if="hasStats(card)" class="px-2 inline-block">
      <span v-if="card.attack !== undefined || card.battlefield !== undefined" class="text-red-light font-bold">
        {{ card.attack || card.battlefield || '0' }}
      </span>
      <span v-else>&ndash;</span> /
      <span v-if="card.life !== undefined" class="text-green-light font-bold">
        {{ card.life || '0' }}
      </span>
      <span v-else>&ndash;</span> /
      <span v-if="card.recover !== undefined || card.spellboard !== undefined" class="text-blue-dark font-bold">
        {{ card.recover || card.spellboard || '0' }}
      </span>
      <span v-else>&ndash;</span>
    </div>
  </div>
  <div
    class="pr-2 pl-8 sm:pl-2 -mt-2 sm:mt-0 border-b border-gray-light sm:text-right"
    :class="{
      'py-1': card.cost && card.cost.length,
      'col-start-1 col-span-4 sm:col-start-4 sm:col-span-1': !isDeckbuilderActive,
      'col-start-2 col-span-4 sm:col-start-5 sm:col-span-1': isDeckbuilderActive,
    }">
    <card-costs :costs="card.cost" is-horizontal class="ml-1 sm:ml-0"></card-costs>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'
import CardCosts from '../CardCosts.vue'

export default {
  name: 'CardTableRow',
  props: {
    card: {
      required: true,
    }
  },
  components: {
    CardCosts,
  },
  computed: {
    isDeckbuilderActive () {
      return this.$store.state.builder.enabled
    },
    isPhoenixborn () {
      return this.card.type === 'Phoenixborn'
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
    typeIcon (card) {
      const typeClass = typeToFontAwesome[card.type]
      return typeClass ? typeClass : 'fa-question-circle'
    },
    hasStats (card) {
      return (
        card.attack !== undefined
        || card.life !== undefined
        || card.recover !== undefined
        || card.copies !== undefined
      )
    },
    legacyConjuration (conjuration) {
      // Ensures that we have the `is_legacy` flag in the conjuration if the card is a legacy card
      if (!this.card.is_legacy) return conjuration
      return {
        is_legacy: true,
        ...conjuration
      }
    },
    usePhoenixborn () {
      this.$store.dispatch('builder/setPhoenixborn', this.card)
    },
    setCardCount (card, count) {
      this.$store.dispatch('builder/setCardCount', {
        card,
        count,
      })
    },
  }
}
</script>

<style lang="postcss" module>
.btn {
  @apply appearance-none inline-block border-gray-darker bg-gray-light leading-none px-2 py-1 text-gray-darker font-bold text-center border-2 border-r-0;
  min-width: 32px;
}

.btnFirst {
  @apply rounded-tl-md rounded-bl-md;
}

.btnLast {
  @apply rounded-tr-md rounded-br-md border-r-2;
}

.btnActive {
  @apply bg-gray-darker text-gray-light;
}
</style>
