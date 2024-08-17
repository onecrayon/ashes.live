<template>
  <ul
    class="m-0 mb-2 sm:mb-0"
    :class="{
      'flex': !autoFit,
      'grid gap-1': autoFit,
    }"
    :style="gridStyle"
    :aria-label="legibleDiceCount">
    <li v-for="(die, index) of diceList" :key="index"
        class="w-6 h-6 text-sm sm:w-8 sm:h-8 sm:text-xl die"
        :class="[die ? die : 'basic', 'phg-' + (die ? die + '-power' : 'basic-magic')]">
        <span class="alt-text">{{ die ? `${capitalize(die)} Die` : '(missing die)' }}</span>
    </li>
  </ul>
</template>

<script>
import { capitalize } from '/src/utils/text.js'

export default {
  name: 'DeckDice',
  props: {
    dice: {
      required: true,
    },
    autoFit: {
      default: false,
    },
  },
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
    legibleDiceCount () {
      const diceValues = []
      for (const dieObject of this.dice) {
        diceValues.push(`${dieObject.count} ${capitalize(dieObject.name)} dice`)
      }
      if (diceValues.length) {
        return diceValues.join('; ')
      } else {
        return "(No dice assigned)"
      }
    },
    gridStyle () {
      if (this.autoFit) {
        return {
          'grid-template-columns': 'repeat( auto-fit, minmax(32px, 1fr) )'
        }
      }
    },
  },
  methods: {
    capitalize,
  },
}
</script>
