<template>
  <div :class="[$style.card]" role="complementary" :aria-label="card.name">
    <deck-qty-buttons class="text-xl" :card="card" :is-popup="isPopup"></deck-qty-buttons>
    <div
      class="border border-gray bg-white"
      :class="{
        [$style.offsetTop]: isDeckbuilderActive && (!isNotConjuration || (card.phoenixborn && deckPhoenixborn && card.phoenixborn !== deckPhoenixborn.name)),
        shadow: isPopup,
      }">
      <div class="bg-gray-light text-gray text-center relative border-b border-gray-light" :class="$style.imageHeight" aria-hidden="true">
        <i class="text-2xl" :class="[typeIcon, $style.centerIcon]"></i>
        <img
          class="relative"
          width="300"
          height="75"
          alt=" "
          :src="cardImageURL">
        <!-- min-width of 33 ensures that we match the standard size of the deck-building buttons for happy aesthetics, but can extend larger with larger font sizes -->
        <strong v-if="qty !== null" class="absolute top-0 left-0 text-black text-xl text-center bg-gray-light border-gray border-r border-b rounded-br-md" style="min-width: 33px;">
          {{ qty }}<span class="text-gray-darker">&times;</span>
        </strong>
      </div>
      <div class="flow-root">
        <card-costs class="p-2 float-right text-right" :costs="card.cost"></card-costs>
        <div class="px-2 py-px text-xs">
          <p class="m-0 font-bold text-lg">
            <router-link :to="linkTarget" class="text-black">{{ card.name }}</router-link>
            <span v-if="card.phoenixborn" class="text-gray font-normal" :title="card.phoenixborn">
              ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
            </span>
            <card-chain-flag v-if="card.chained" />
          </p>
          <p class="m-0 text-xs">
            {{ card.type }}
            <span v-if="card.placement">
              <span class="divider"><span class="alt-text">-</span></span>
              {{ card.placement }}
            </span>
          </p>
          <p v-if="showCardReleases" class="text-gray-dark text-xs m-0 mt-1">
            {{ card.release.name }}
          </p>
          <div v-if="isPhoenixborn" class="text-center my-2">
            <span
              v-if="card.battlefield !== undefined"
              class="inline-block border border-red-light px-1">Battlefield <strong>{{ card.battlefield }}</strong></span>
            <span
              v-if="card.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life <strong>{{ card.life }}</strong></span>
            <span
              v-if="card.spellboard !== undefined"
              class="inline-block border border-blue-dark px-1">Spellboard <strong>{{ card.spellboard }}</strong></span>
          </div>
          <div v-if="card.text">
            <hr v-if="!isPhoenixborn" class="my-2 border-gray-light">
            <div class="leading-snug" :class="$style.effectText">
              <card-codes
                :content="card.text"
                :is-legacy="card.is_legacy"
                is-card-effect></card-codes>
            </div>
          </div>
          <div v-if="hasStats && !isPhoenixborn" class="text-center my-2 clear-fix">
            <!-- Placeholders ensure that our stats are always in about the same locations -->
            <span
              v-if="card.copies !== undefined"
              class="border border-gray-dark float-left px-1">{{ card.copies }}</span>

            <span
              v-if="card.attack !== undefined"
              class="inline-block border border-red-light px-1">Attack <strong>{{ card.attack }}</strong></span>
            <span v-else class="inline-block invisible">Attack --</span>

            <span
              v-if="card.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life <strong>{{ card.life }}</strong></span>
            <span v-else class="inline-block invisible mx-1">Life --</span>

            <span
              v-if="card.recover !== undefined"
              class="inline-block border border-blue-dark px-1">Recover <strong>{{ card.recover }}</strong></span>
            <span v-else class="inline-block invisible">Recover --</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'
import { debounce } from '/src/utils/index.js'
import CardChainFlag from './CardChainFlag.vue'
import CardCodes from './CardCodes.vue'
import CardCosts from './CardCosts.vue'
import DeckQtyButtons from './DeckQtyButtons.vue'

// The number of pixels offscreen within which the image should be loaded
const LOAD_IMAGE_IF_WITHIN_PIXELS = 500

export default {
  name: 'Card',
  props: {
    card: {
      required: true,
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
    qty: {
      type: Number,
      default: null,
    },
  },
  components: {
    CardChainFlag,
    CardCodes,
    CardCosts,
    DeckQtyButtons,
  },
  data () {
    return {
      showImage: false,
    }
  },
  mounted () {
    this.scrollCheck()
    this.debouncedScrollListener = debounce(this.scrollCheck, 100)
    window.addEventListener('scroll', this.debouncedScrollListener)
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.debouncedScrollListener)
  },
  watch: {
    card () {
      this.scrollCheck()
    }
  },
  computed: {
    cardImageURL () {
      return this.showImage ? `${import.meta.env.VITE_CDN_URL}/images/slices/${this.card.stub}.jpg` : ''
    },
    typeIcon () {
      const typeClass = typeToFontAwesome[this.card.type]
      return typeClass ? typeClass : 'fa-question-circle'
    },
    isPhoenixborn () {
      return this.card.type === 'Phoenixborn'
    },
    isDeckbuilderActive () {
      return this.$store.state.builder.enabled
    },
    isNotConjuration () {
      return this.card.type !== 'Conjuration' && this.card.type !== 'Conjured Alteration Spell'
    },
    hasStats () {
      // This covers Phoenixborn, too, because they always have a life value
      return (
        this.card.attack !== undefined
        || this.card.life !== undefined
        || this.card.recover !== undefined
        || this.card.copies !== undefined
      )
    },
    linkTarget () {
      const routeName = !this.card.is_legacy ? 'CardDetails' : 'CardDetailsLegacy'
      return {
        name: routeName,
        params: { stub: this.card.stub },
      }
    },
    deckPhoenixborn () {
      return this.$store.state.builder.deck.phoenixborn
    },
    showCardReleases () {
      return this.$store.state.options.showCardReleases
    },
  },
  methods: {
    scrollCheck () {
      // Check if our scrolling element is visible or within our desired overlap
      const elementBounding = this.$el.getBoundingClientRect()
      if (elementBounding.top <= window.innerHeight + LOAD_IMAGE_IF_WITHIN_PIXELS && elementBounding.bottom >= -LOAD_IMAGE_IF_WITHIN_PIXELS) {
        this.showImage = true
      } else {
        this.showImage = false
      }
    },
  },
}
</script>

<style lang="postcss" module>
.card {
  width: 300px;
}

.imageHeight {
  height: 75px;
}

.centerIcon {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Darn thing is about 25px square, so adjust by hand; transform -50% isn't working for some reason */
  margin: -13px 0 0 -13px;
}

.effectText {
  & p {
    @apply my-2;
  }
}

.offsetTop {
  margin-top: 30px;
}
</style>
