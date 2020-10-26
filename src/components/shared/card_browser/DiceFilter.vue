<template>
  <div class="flex flex-wrap-none">
    <button class="btn btn-first px-1 text-l md:px-2"
      :title="diceLogicTooltip">{{ diceLogicText }}:</button
    ><button class="phg-basic-magic btn btn-inner text-2xl px-1 md:px-2" title="Basic Magic"></button
    ><button
      v-for="(dieType, index) of diceList" :key="dieType"
      class="appearance-none btn text-2xl px-1 md:px-2"
      :class="['phg-' + dieType + '-power', index === diceList.length - 1 ? 'btn-last' : 'btn-inner']"
      :title="capitalize(dieType) + ' Magic'"></button>
  </div>
</template>

<script>
import {diceList} from '/src/constants.js'

export default {
  name: 'DiceFilter',
  computed: {
    diceList () {
      return diceList
    },
    // TODO: update this once I figure out how to handle active filters (prop/event? Vuex?)
    isDiceLogicAll () {
      return false
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
  },
}
</script>
