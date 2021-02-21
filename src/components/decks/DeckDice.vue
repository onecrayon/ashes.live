<template>
  <ul class="flex m-0">
    <template v-for="(die, idx) of dice" :key="idx">
      <li
        v-for="index in die.count" :key="index"
        class="w-6 h-6 text-sm sm:w-8 sm:h-8 sm:text-xl die"
        :class="['phg-' + die.name + '-power', die.name]">
        <span class="alt-text">{{ die ? `${capitalize(die.name)} Die` : '(empty)' }}</span>
      </li>
    </template>
  </ul>
</template>

<script>
import { capitalize } from '/src/utils.js'

export default {
  name: 'DeckDice',
  props: ['dice'],
  methods: {
    capitalize,
  },
}
</script>
