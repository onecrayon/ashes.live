<template>
  <div class="flex flex-wrap-none" role="group" aria-label="Filter by dice type">
    <button class="btn btn-first px-1 text-l w-16 sm:px-2"
      :class="{active: isDiceLogicAll}"
      :title="diceLogicTooltip"
      :disabled="isDisabled"
      @click="toggleFilterLogic">
      {{ diceLogicText }}<span class="alt-text"> dice type{{ isDiceLogiAll ? 's' : '' }}</span>:
    </button
    ><button class="phg-basic-magic btn btn-inner text-2xl px-1 sm:px-2"
      :class="{active: isDieActive('basic')}"
      :disabled="isDiceLogicAll || isDisabled"
      @click="toggleDie('basic')">
      <span class="alt-text">Basic Magic{{ isDieActive('basic') ? ' (active)' : '' }}</span>
    </button><button
      v-for="(dieType, index) of diceList" :key="dieType"
      class="appearance-none btn text-2xl px-1 sm:px-2"
      :class="[
        'phg-' + dieType + '-power',
        index === diceList.length - 1 ? 'btn-last' : 'btn-inner',
        isDieActive(dieType) ? 'active' : ''
      ]"
      :disabled="isDisabled"
      @click="toggleDie(dieType)">
        <span class="alt-text">{{ capitalize(dieType) }} Magic{{ isDieActive(dieType) ? ' (active)' : '' }}</span>
      </button>
  </div>
</template>

<script>
import { diceList } from '/src/constants.js'

export default {
  name: 'DiceFilter',
  props: {
    isDisabled: Boolean,
    filterLogic: {
      default: 'any',
      type: String,
    },
    filterList: {
      default: [],
      type: Array,
    },
  },
  emits: ['update:filterLogic', 'update:filterList'],
  computed: {
    diceList () {
      return diceList
    },
    isDiceLogicAll () {
      return this.filterLogic === 'all'
    },
    diceLogicText () {
        return this.isDiceLogicAll ? 'All' : 'Any'
    },
    diceLogicTooltip () {
      if (this.isDiceLogicAll) {
        return 'Showing cards that require ALL selected magic types'
      }
      return 'Showing cards that require ANY selected magic type'
    },
  },
  methods: {
    capitalize (value) {
      return `${value.substr(0, 1).toUpperCase()}${value.substr(1)}`
    },
    isDieActive (dieType) {
      return this.filterList.indexOf(dieType) >= 0
    },
    toggleDie (dieType) {
      const types = new Set(this.filterList)
      if (types.has(dieType)) {
        types.delete(dieType)
        this.$emit('update:filterList', Array.from(types))
      } else {
        types.add(dieType)
        this.$emit('update:filterList', Array.from(types))
      }
    },
    toggleFilterLogic () {
      const nextFilter = this.isDiceLogicAll ? 'any' : 'all'
      // Ensure that "basic" dice are only allowed when doing an "any" filter
      if (nextFilter === 'all' && this.isDieActive('basic')) {
        this.toggleDie('basic')
      }
      this.$emit('update:filterLogic', nextFilter)
    },
  },
}
</script>
