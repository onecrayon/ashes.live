<template>
  <div class="w-8 text-center p-1 border-b border-gray-light" :title="card.type">
    <i class="fas" :class="[typeIcon(card)]"></i>
  </div>
  <div class="p-1 border-b border-gray-light">
    <card-link :card="card"></card-link>
    <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
      ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
    </span>
    <span v-if="card.release.is_phg === false" class="text-gray pl-1">†</span>
  </div>
  <div class="py-1 border-b border-r border-gray-light text-gray-light text-right">
    <div v-if="card.conjurations && card.conjurations.length" class="px-2">
      <card-link v-for="conjuration of card.conjurations" :key="conjuration.stub" :card="conjuration">
        <i class="fas fa-plus-square"></i>
      </card-link>
    </div>
    <div v-if="hasStats(card)" class="px-2">
      <span v-if="card.attack !== undefined || card.battlefield !== undefined" class="text-red-light">
        {{ card.attack || card.battlefield || '0' }}
      </span>
      <span v-else>&ndash;</span> /
      <span v-if="card.life !== undefined" class="text-green-light">
        {{ card.life || '0' }}
      </span>
      <span v-else>&ndash;</span> /
      <span v-if="card.recover !== undefined || card.spellboard !== undefined" class="text-blue-dark">
        {{ card.recover || card.spellboard || '0' }}
      </span>
      <span v-else>&ndash;</span>
    </div>
  </div>
  <div class="py-1 px-2 border-b border-gray-light text-right">
    <card-costs :costs="card.cost" is-horizontal></card-costs>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'
import CardCosts from '../CardCosts.vue'
import CardLink from '../CardLink.vue'

export default {
  name: 'CardTableRow',
  props: {
    card: {
      required: true,
    }
  },
  components: {
    CardCosts,
    CardLink,
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
  }
}
</script>
