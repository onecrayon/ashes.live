<template>
  <div class="flex flex-wrap md:flex-nowrap items-center">
    <div class="basis-0 grow mb-2 md:w-1/2 font-mono whitespace-pre-line break-words max-width-full border-2 rounded px-4 py-2 border-reaction-dark bg-reaction">
      {{ text }}
    </div>
    <div class="flex-none px-2 mb-2">
      <i class="fas fa-arrow-down md:hidden"></i>
      <i class="fas fa-arrow-right hidden md:block"></i>
    </div>
    <div class="parsed-text no-margins w-full mb-4 md:mb-2 md:w-1/2 md:shrink border-2 rounded px-4 py-2 border-inexhaustible-dark bg-inexhaustible">
      <card-codes :content="text"></card-codes>
    </div>
  </div>
</template>

<script>
import CardCodes from './CardCodes.vue'

export default {
  name: 'CardCodeExample',
  props: ['text'],
  components: {
    CardCodes,
  },
}
</script>
