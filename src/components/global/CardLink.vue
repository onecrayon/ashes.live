<template>
  <span>
    <router-link
      class="font-bold text-black"
      ref="link"
      :to="cardTarget"
      @mouseover="queueShowDetails"
      @mouseleave="closeDetails"
      @click="linkClick">
      <slot>{{ card.name }}</slot>
    </router-link>
    <div ref="popup" class="absolute z-50" @mouseleave="closeDetails">
      <div
        v-if="card.is_legacy && areDetailsShowing"
        class="border-8 border-gray-light bg-gray-light text-gray rounded-lg shadow relative"
        ref="popup">
        <i
          class="fas fa-circle-notch fa-spin text-2xl"
          :class="[$style.centerPosition]"></i>
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
        class="text-left text-black"
        :card="details"
        is-popup></card>
    </div>
  </span>
</template>

<script>
import { createPopper } from '@popperjs/core'
import Card from '../shared/Card.vue'

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
      loadingDetails: false,
      details: null,
      checkOpenTimeout: null,
      checkCloseTimeout: null,
    }
  },
  beforeUnmount () {
    // Ensure that we don't have any lingering listeners
    this.clearOpenTimeout()
    this.clearCloseTimeout()
    this.cleanupEventListeners()
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
    linkClick (event) {
      event.preventDefault()
      event.stopPropagation()
      if (this.areDetailsShowing) {
        // If we already have the details showing, then do the default behavior
        return this.$router.push(this.cardTarget)
      }
      // Looks like someone's impatient...
      if (this.loadingDetails) return
      this.showDetails()
      // iOS doesn't propogate click events for arbitrary elements to the document, so we have to also
      // watch for touchstart
      ['click', 'touchstart'].forEach(action => document.addEventListener(action, this.closeOnClick))
    },
    closeOnClick (event) {
      // TEMP: debugging code
      console.log(event)
      // If the click was outside our open element, then close the popper
      if (!this.$refs.link.$el.contains(event.target) && !this.$refs.popup.contains(event.target)) {
        event.stopPropagation()
        event.preventDefault()
        this.areDetailsShowing = false
        this.popper.destroy()
        this.cleanupEventListeners()
      }
      // Otherwise, just leave things well enough alone
    },
    cleanupEventListeners () {
      ['click', 'touchstart'].forEach(action => document.removeEventListener(action, this.closeOnClick))
    },
    queueShowDetails () {
      // Only queue up if we aren't already loading or viewing things
      if (this.loadingDetails || this.areDetailsShowing || this.checkOpenTimeout) return
      this.checkOpenTimeout = setTimeout(this.showDetails, 200)
    },
    clearOpenTimeout () {
      if (this.checkOpenTimeout) {
        clearTimeout(this.checkOpenTimeout)
        this.checkOpenTimeout = null
      }
    },
    clearCloseTimeout () {
      if (this.checkCloseTimeout) {
        clearTimeout(this.checkCloseTimeout)
        this.checkCloseTimeout = null
      }
    },
    async showDetails () {
      this.clearOpenTimeout()
      if (this.loadingDetails) return
      this.loadingDetails = true
      // If we have more than three keys, that means we have a full details object so we can just render it
      // (Looking for only two keys could fail for legacy cards)
      if (this.card.is_legacy || this.card.text) {
        this.details = this.card
      } else if (!this.details) {
        // Otherwise, we need to fetch the card details
        try {
          this.details = await this.$store.dispatch('cards/fetchCard', this.card)
        } catch {
          this.loadingDetails = false
          return
        }
      }
      this.loadingDetails = false
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
      this.clearOpenTimeout()
      if (!this.areDetailsShowing) return
      this.clearCloseTimeout()
      // Delay our close check to allow them time to move into the hovering element
      this.checkCloseTimeout = setTimeout(() => {
        // Don't close if we're still over either the link or the popup
        if (this.$refs.link.$el.matches(':hover') || this.$refs.popup.matches(':hover')) return
        this.areDetailsShowing = false
        this.popper.destroy()
      }, 100)
    },
  },
}
</script>

<style lang="postcss" module>
.centerPosition {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Darn thing is about 25px square, so adjust by hand; transform -50% isn't working for some reason */
  margin: -13px 0 0 -13px;
}
</style>
