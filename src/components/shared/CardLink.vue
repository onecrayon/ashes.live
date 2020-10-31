<template>
  <router-link
    class="font-bold text-black"
    ref="link"
    :to="cardTarget"
    @mouseover="showDetails"
    @mouseleave="closeDetails">{{ card.name }}</router-link>
  <div ref="popup" class="absolute">
    <div
      v-if="card.is_legacy && areDetailsShowing"
      class="border-8 border-gray-light bg-gray-light text-gray rounded-lg shadow relative"
      ref="popup">
      <i
        class="fas fa-circle-notch fa-spin text-2xl"
        :class="[$style['center-position']]"></i>
      <img
        width="299"
        height="418"
        class="relative"
        :src="legacyCardURL"
        :alt="card.name">
    </div>
    <card
      v-else-if="areDetailsShowing"
      ref="popup"
      class="shadow"
      :card="card"></card>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'
import { request } from '/src/utils.js'
import Card from './Card.vue'

export default {
  name: 'CardLink',
  // `card` must be an object with at minimum `name` and `stub` properties
  props: ['card'],
  components: {
    Card,
  },
  data () {
    return {
      areDetailsShowing: false,
    }
  },
  computed: {
    cardTarget () {
      const routeName = !this.card.is_legacy ? 'CardDetails' : 'CardDetailsLegacy'
      return {
        name: routeName,
        params: { stub: this.card.stub },
      }
    },
    legacyCardURL () {
      return `${import.meta.env.VITE_CDN_URL}/legacy/images/cards/${this.card.stub}.png`
    },
  },
  methods: {
    async showDetails ({ clientX: x, clientY: y }) {
      // TODO: figure out how to handle card links when we only have the title (might not even have the stub)
      this.popper = createPopper(this.$refs.link.$el, this.$refs.popup, {
        placement: 'right',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 10,
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: [
                'right-start',
                'right-end',
                'left',
                'left-start',
                'left-end',
                'top',
                'bottom'
              ],
            },
          },
        ],
      })
      this.areDetailsShowing = true
      // If we don't run an update on the next tick, the popper treats its size as 0 width/height
      // No idea why; even setting an explicit size in the styling doesn't help
      this.$nextTick(() => {
        this.popper.forceUpdate()
      })
    },
    closeDetails () {
      this.areDetailsShowing = false
      this.popper.destroy()
    },
  },
}
</script>

<style lang="postcss" module>
.center-position {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Darn thing is about 25px square, so adjust by hand; transform -50% isn't working for some reason */
  margin: -13px 0 0 -13px;
}
</style>
