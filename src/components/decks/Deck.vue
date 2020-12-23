<template>
  <div
    class="border border-gray bg-white"
    :class="[$style.deck]">
    <div class="clearfix">
      <div class="px-2 py-px text-xs">
        <p class="m-0 font-bold text-lg">
          <router-link :to="linkTarget" class="text-black">{{ deck.title }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'

export default {
  name: 'Deck',
  props: {
    deck: {
      required: true,
    },
  },
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  beforeUnmount () {
  },
  computed: {
    linkTarget () {
      return {
        name: 'DeckDetails',
        params: { id: this.deck.id },
      }
    },
  },
  methods: {
  },
}
</script>

<style lang="postcss" module>
.card {
  width: 300px;
}
</style>
