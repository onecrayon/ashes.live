<template>
  <div class="flex">
    <!-- TODO: figure out if we can reasonably support marking dice types as missing, since I can't guarantee that all cards in the deck are in the store -->
    <!-- Explicitly writing out the classes is silly, but necessary to prevent them from being purged by PurgeCSS -->
    <input
      class="appearance-none border-2 bg-white rounded-l-md px-2 py-1 w-16 m-0 flex-none"
      :class="{
        'border-dice-ceremonial-bg': name === 'ceremonial',
        'border-dice-charm-bg': name === 'charm',
        'border-dice-illusion-bg': name === 'illusion',
        'border-dice-natural-bg': name === 'natural',
        'border-dice-divine-bg': name === 'divine',
        'border-dice-sympathy-bg': name === 'sympathy',
        'border-dice-time-bg': name === 'time',
      }"
      type="number"
      min="0"
      step="1"
      :max="maxCount"
      :aria-label="`Set ${name} dice`"
      :disabled="isDisabled && count === 0"
      v-model.number="count"
    ><button
      class="btn btn-last text-xl m-0 w-6 box-content flex-none"
      :class="{
        'text-dice-ceremonial': name === 'ceremonial',
        'border-dice-ceremonial-bg': name === 'ceremonial',
        'bg-dice-ceremonial-bg': name === 'ceremonial',
        'text-dice-charm': name === 'charm',
        'border-dice-charm-bg': name === 'charm',
        'bg-dice-charm-bg': name === 'charm',
        'text-dice-illusion': name === 'illusion',
        'border-dice-illusion-bg': name === 'illusion',
        'bg-dice-illusion-bg': name === 'illusion',
        'text-dice-natural': name === 'natural',
        'border-dice-natural-bg': name === 'natural',
        'bg-dice-natural-bg': name === 'natural',
        'text-dice-divine': name === 'divine',
        'border-dice-divine-bg': name === 'divine',
        'bg-dice-divine-bg': name === 'divine',
        'text-dice-sympathy': name === 'sympathy',
        'border-dice-sympathy-bg': name === 'sympathy',
        'bg-dice-sympathy-bg': name === 'sympathy',
        'text-dice-time': name === 'time',
        'border-dice-time-bg': name === 'time',
        'bg-dice-time-bg': name === 'time',
        // This isn't managed by TailwindCSS, so just toss it in there on its own
        [`phg-${name}-power`]: true,
      }"
      :disabled="isDisabled"
      @click.prevent="incrementDie">
      <span class="alt-text">Add {{ name }} die</span>
    </button>
  </div>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'

export default {
  name: 'DieCounter',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  computed: {
    count: {
      get () {
        const dieObject = this.$store.state.builder.deck.dice.find(element => element.name === this.name)
        if (!dieObject) return 0
        return dieObject.count
      },
      set (value) {
        this.$store.dispatch('builder/setDieCount', {
          name: this.name,
          count: value
        }).catch(this.handleResponseError)
      },
    },
    maxCount () {
      return 10 - this.$store.getters['builder/totalDice'] + this.count
    },
    isDisabled () {
      return this.count >= this.maxCount
    },
  },
  methods: {
    incrementDie () {
      const target = this.count + 1
      if (target > this.maxCount) return
      this.count = target
    },
  },
}
</script>
