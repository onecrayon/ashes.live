<template>
  <ul class="flex m-0">
    <li v-for="(die, index) of diceList" :key="index"
        class="w-6 h-6 text-sm sm:w-8 sm:h-8 sm:text-xl die"
        :class="[die ? die : 'basic', 'phg-' + (die ? die + '-power' : 'basic-magic')]"
        @click="reduceDieCount(die)">
        <span class="alt-text">{{ die ? `${capitalize(die.name)} Die` : '(empty)' }}</span>
    </li>
  </ul>
</template>

<script>
import { capitalize } from '/src/utils.js'

export default {
  name: 'DeckDice',
  props: ['dice'],
  computed: {
    diceList () {
      let diceArray = new Array(10)
      let nextIndex = 0
      for (const dieObject of this.dice) {
        const numDice = dieObject.count
        const maxIndex = nextIndex + numDice
        while (nextIndex < maxIndex && nextIndex < 10) {
          diceArray[nextIndex] = dieObject.name
          nextIndex++
        }
      }
      while (nextIndex < 10) {
        diceArray[nextIndex] = null
        nextIndex++
      }
      return diceArray
    },
  },
  methods: {
    capitalize,
  },
}
</script>
