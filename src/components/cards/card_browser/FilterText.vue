<template>
  <i :class="typeIcon(type)"></i> <span class="hidden xl:inline">{{ text || type.split(' ')[0] }}</span>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'

export default {
  name: 'FilterIcon',
  props: {
    type: String,
    text: String,
  },
  methods: {
    typeIcon (targetType) {
      if (targetType === 'Summon') return 'fas fa-plus-square'
      const typeClass = typeToFontAwesome[targetType]
      return typeClass ? typeClass : 'fa-question-circle'
    },
  }
}
</script>
