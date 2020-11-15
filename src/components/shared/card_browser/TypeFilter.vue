<template>
  <div class="flex flex-wrap-none">
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
      <i :class="typeIcon(curType[0])"></i> <span class="hidden lg:inline">{{ curType[0].split(' ')[0] }}</span>
    </button>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'

export default {
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
        ['Summon', 'summon'],
        ['Phoenixborn', 'phoenixborn'],
        ['Conjuration', 'conjurations'],
      ]
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
  },
}
</script>
