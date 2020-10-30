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
</template>

<script>
import {createPopper} from '/src/utils.js'

export default {
  name: 'CardLink',
  // `card` must be an object with at minimum `name` and `stub` properties
  props: ['card'],
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
      return `https://cdn.ashes.live/legacy/images/cards/${this.card.stub}.png`
    },
  },
  methods: {
    hoverOpen ({ clientX: x, clientY: y }) {
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
