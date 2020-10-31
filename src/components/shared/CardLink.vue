<template>
  <router-link
    class="font-bold text-black"
    ref="link"
    :to="cardTarget"
    @mouseover="hoverOpen"
    @mouseleave="hoverClose">{{ card.name }}</router-link>
  <div
    v-if="card.is_legacy"
    class="border-8 border-gray-light bg-gray-light text-gray rounded-lg absolute inset-0"
    ref="popup"
    :class="{hidden: !hovering}">
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
    v-else
    ref="popup"
    class="absolute inset-0"
    :class="{hidden: !hovering}"
    :is-visible="hovering"
    :data="card"></card>
</template>

<script>
import {createPopper} from '@popperjs/core'
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
      hovering: false,
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
      if (!this.hovering) return ''
      return `${import.meta.env.VITE_CDN_URL}/legacy/images/cards/${this.card.stub}.png`
    },
  },
  methods: {
    hoverOpen ({ clientX: x, clientY: y }) {
      const popupEl = this.$refs.popup.$el ? this.$refs.popup.$el : this.$refs.popup
      this.popper = createPopper(this.$refs.link.$el, popupEl, {
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
      this.hovering = true
      // If we don't run an update on the next tick, the popper treats its size as 0 width/height
      // No idea why; even setting an explicit size in the styling doesn't help
      this.$nextTick(() => {
        this.popper.forceUpdate()
      })
    },
    hoverClose () {
      this.hovering = false
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
