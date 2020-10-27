<template>
  <div v-if="!isDisabled && (!cards || !cards.length)" class="text-center bg-inexhaustible border border-gray-light my-4 py-8">
    <h2>No cards found</h2>

    <p>
      <button @click="$emit('reset-filters')" class="btn btn-blue px-4 py-2">Clear filters</button>
    </p>
  </div>
  <div v-else-if="cards && cards.length">
    <ul>
      <li
        v-for="card of cards" :key="card.stub"
        class="flex flex-no-wrap">
        <div class="flex-grow-0 flex-shrink-0 w-8 p-1 text-center border-b border-gray-light" :title="card.type">
          <i class="fas" :class="[typeIcon(card)]"></i>
        </div>
        <div class="flex-grow p-1 border-b border-gray-light">
          <!-- TODO: switch this to a standard `card-link` component -->
          <strong>{{ card.name }}</strong>
          <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
            ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
          </span>
          <span v-if="card.release.is_phg === false" class="text-gray pl-1">†</span>
        </div>
      </li>
    </ul>
    <!-- TODO: add button to load more on demand, and hook up automatic loading on scroll -->
  </div>
</template>

<script>
import {typeToFontAwesome} from '/src/constants.js'

export default {
  name: 'CardTable',
  props: {
    isPhoenixbornPicker: Boolean,
    isDisabled: Boolean,
    cards: Array,
  },
  emits: ['reset-filters'],
  methods: {
    typeIcon (card) {
      const typeClass = typeToFontAwesome[card.type]
      return typeClass ? typeClass : 'fa-question-circle'
    }
  },
}
</script>
