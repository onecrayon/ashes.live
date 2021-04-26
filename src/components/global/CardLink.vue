<template>
  <span>
    <span @click.capture="linkClick">
      <router-link
        class="font-bold text-black"
        ref="link"
        :to="cardTarget"
        @pointerover="queueShowDetails"
        @pointerleave="closeDetails">
      <slot>{{ card.name }}</slot>
      </router-link>
    </span>
    <div ref="popup" class="absolute z-50" @mouseleave="closeDetails">
      <div
        v-if="card.is_legacy && isCurrentTarget"
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
        v-else-if="isCurrentTarget"
        ref="popup"
        class="text-left text-black"
        :card="details"
        is-popup></card>
    </div>
  </span>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { createPopper } from '@popperjs/core'
import Card from '../shared/Card.vue'

const { mapState, mapMutations } = createNamespacedHelpers('cardDetails')

export default {
  name: 'CardLink',
  // `card` must be an object with at minimum `name` and `stub` properties
  props: ['card'],
  components: {
    Card,
  },
  data () {
    return {
      loadingDetails: false,
      details: null,
      checkCloseTimeout: null,
      checkOpenTimeout: null,
      linkId: null,
      pointerType: 'mouse',
    }
  },
  beforeMount () {
     this.linkId = `${this.card.stub}-${Math.random()}`
  },
  beforeUnmount () {
    // Ensure that we don't have any lingering listeners
    this.clearOpenTimeout()
    this.clearCloseTimeout()
    this.cleanupEventListeners()
  },
  computed: {
    ...mapState(['displayedId']),
    isCurrentTarget() {
      return this.linkId === this.displayedId
    },
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
    useHoverLogic () {
      return this.pointerType === 'mouse'
    }
  },
  methods: {
    ...mapMutations(['setDisplayedId', 'unsetDisplayedId']),
    /*
    We have two different scenarios we are trying to target here:

    1. User is using a mouse. In this case, we want a hover to cause the details to open (on a
       slight delay to ensure mousing around the page doesn't trigger needless HTTP requests), but
       clicks should always immediately execute the native router link behavior.
    2. User is using a touch device (finger or stylus). In this case, we want the first touch to
       open the details popup, and the second to execute the default link behavior.

    To do this, we're currently using the following sequencing:

    * `pointerover`: this PointerEvent includes the type of device that is being used (e.g. "mouse"
      vs. "touch"). When this occurs, we store the pointer type and if it's a mouse proceed to queue
      up a potential detail open since they are hovering. This event fires first, even if it was
      triggered by a tap.
    * `click`: once they click the link, we can check what type of interaction we are doing (hover
      or otherwise), and behave accordingly.
    * `pointerleave`: for consistency we're watching for the mouse to exit on pointerleave, but this
      could equally well be mouseleave.
    */
    queueShowDetails (event) {
      // Save our pointer mode so that we can check if we need to open the details popup on click
      // (or just let the click event happen normally)
      this.pointerType = event.pointerType
      // Only queue up our details on a delay if we are using a device that hovers and aren't already loading or viewing things
      if (!this.useHoverLogic || this.loadingDetails || this.isCurrentTarget || this.checkOpenTimeout) return
      this.checkOpenTimeout = setTimeout(this.showDetails, 200)
    },
    linkClick (event) {
      // We only want to cancel the default link behavior if we are handling touch input (thus don't have hover logic) and do not already have the details open
      if (!this.useHoverLogic && !this.isCurrentTarget) {
        event.preventDefault()
        return this.showDetails()
      }
    },
    closeOnClick (event) {
      // If the click was outside our open element, then close the popper
      if (!this.$refs.link.$el.contains(event.target) && !this.$refs.popup.contains(event.target)) {
        event.preventDefault()
        this.unsetDisplayedId({ id: this.linkId })
        this.popper.destroy()
        this.cleanupEventListeners()
      }
      // Otherwise, just leave things well enough alone
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
      document.addEventListener('click', this.closeOnClick, true)
      // If we don't run an update on the next tick, the popper treats its size as 0 width/height
      // No idea why; even setting an explicit size in the styling doesn't help
      this.$nextTick(() => {
        this.popper.forceUpdate()
        this.setDisplayedId({ id: this.linkId })
      })
    },
    cleanupEventListeners () {
      document.removeEventListener('click', this.closeOnClick, true)
    },
    closeDetails () {
      this.clearOpenTimeout()
      if (!this.isCurrentTarget) return
      this.clearCloseTimeout()
      // Delay our close check to allow them time to move into the hovering element
      this.checkCloseTimeout = setTimeout(() => {
        // Don't close if we're still over either the link or the popup
        if (this.$refs.link.$el.matches(':hover') || this.$refs.popup.matches(':hover')) return
        this.popper.destroy()
        this.unsetDisplayedId({ id: this.linkId })
        this.cleanupEventListeners()
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
