<template>
  <span v-html="parsedContent"></span>
</template>

<script>
import { parseCardText } from '/src/utils.js'

export default {
  name: 'CardCodes',
  props: ['content'],
  computed: {
    parsedContent () {
      return parseCardText(this.content)
    }
  }
}
</script>
