<template>
  <div class="flex flex-wrap sm:flex-nowrap" role="group" aria-label="Filter by card type">
    <div class="flex-shrink-0 pr-2 mb-2">
      <button
        v-for="(curType, index) of cardTypes" :key="curType[1]"
        class="btn py-1 px-2 font-normal text-sm"
        :class="{
          'btn-first': index === 0,
          'btn-inner': index !== 0 && index < cardTypes.length - 1,
          'btn-last': index === cardTypes.length - 1,
          active: isTypeActive(curType[1]),
        }"
        :disabled="isDisabled"
        :title="curType[0]"
        @click="toggleType(curType[1])">
          <filter-text :type="curType[0]" />
        <span v-if="isTypeActive(curType[1])" class="alt-text absolute"> (active)</span>
      </button>
    </div>
    <div class="flex-shrink-0 pr-4 mb-4">
      <button
        :disabled="isDisabled"
        @click="setOnlySummoners(false)"
        :class="{ active: !onlySummoners }"
        class="btn py-1 px-2 font-normal text-sm btn-first">
        All
      </button
      ><button
        :disabled="isDisabled"
        @click="setOnlySummoners(true)"
        :class="{ active: onlySummoners }"
        class="btn py-1 px-2 font-normal text-sm btn-last">
        <filter-text type="Summon" text="Summons"/>
      </button>
    </div>
  </div>
</template>

<script>
import FilterText from './FilterText.vue';

export default {
  components: { FilterText },
  name: 'TypeFilter',
  props: {
    isDisabled: Boolean,
    filterList: {
      default: [],
      type: Array,
    },
  },
  emits: ['update:filterList'],
  computed: {
    cardTypes () {
      // Returns a list of lists like `['Official Type', 'filter_name']`
      const cardTypes = [
        ['Ally', 'ally'],
        ['Action Spell', 'action_spell'],
        ['Reaction Spell', 'reaction_spell'],
        ['Alteration Spell', 'alteration_spell'],
        ['Ready Spell', 'ready_spell'],
        ['Phoenixborn', 'phoenixborn'],
      ]
      // Only allow filtering by conjurations if we aren't in deckbuilder mode
      if (!this.$store.state.builder.enabled || !this.$store.state.options.deckbuilderMode) {
        cardTypes.push(['Conjuration', 'conjurations'])
      }
      return cardTypes
    },
    onlySummoners () {
      return this.isTypeActive('summon');
    }
  },
  methods: {
    typeIcon (targetType) {
      if (targetType === 'Summon') return 'fas fa-plus-square'
      const typeClass = typeToFontAwesome[targetType]
      return typeClass ? typeClass : 'fa-question-circle'
    },
    isTypeActive (targetType) {
      return this.filterList.indexOf(targetType) >= 0
    },
    toggleType (targetType) {
      const types = new Set(this.filterList)
      if (types.has(targetType)) {
        types.delete(targetType)
        this.$emit('update:filterList', Array.from(types))
      } else {
        types.add(targetType)
        this.$emit('update:filterList', Array.from(types))
      }
    },
    setOnlySummoners (value) {
      if (value === this.onlySummoners) return;
      return this.toggleType('summon');
    }
  },
}
</script>
