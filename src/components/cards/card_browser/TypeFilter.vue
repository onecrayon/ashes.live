<template>
  <div class="flex flex-nowrap" role="group" aria-label="Filter by card type">
    <span class="pr-4">
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
    </span>
    <button
      :disabled="isDisabled"
      @click="setOnlySummoners(false)"
      :class="{ active: !onlySummoners }"
      class="btn py-1 px-2 font-normal text-sm btn-first">
      All
    </button>
    <button
      :disabled="isDisabled"
      @click="setOnlySummoners(true)"
      :class="{ active: onlySummoners }"
      class="btn py-1 px-2 font-normal text-sm btn-last">
      <filter-text type="Summon" text="Only Summoning Cards"/>
    </button>
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
      return [
        ['Ally', 'ally'],
        ['Action Spell', 'action_spell'],
        ['Reaction Spell', 'reaction_spell'],
        ['Alteration Spell', 'alteration_spell'],
        ['Ready Spell', 'ready_spell'],
        ['Phoenixborn', 'phoenixborn'],
        ['Conjuration', 'conjurations'],
      ]
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
