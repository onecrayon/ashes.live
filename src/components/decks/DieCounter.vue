<template>
  <div class="flex">
    <!-- TODO: figure out if we can reasonably support marking dice types as missing, since I can't guarantee that all cards in the deck are in the store -->
    <input
      class="appearance-none border-2 bg-white rounded-l-md px-2 py-1 w-16 m-0 flex-none"
      :class="[`border-dice-${name}-bg`]"
      type="number"
      min="0"
      step="1"
      :max="maxCount"
      :aria-label="`Set ${name} dice`"
      :disabled="isDisabled && count === 0"
      v-model.number="count"
    ><button
      class="btn btn-last text-xl m-0 w-6 box-content flex-none"
      :class="[`phg-${name}-power`, `text-dice-${name}`, `border-dice-${name}-bg`, `bg-dice-${name}-bg`]"
      :disabled="isDisabled"
      @click.prevent="incrementDie">
      <span class="alt-text">Add {{ name }} die</span>
    </button>
  </div>
</template>

<script>
import useHandleResponseError from '/src/composites/useHandleResponseError.js'

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
