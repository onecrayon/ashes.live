<template>
  <div :class="[$style.card]">
    <div v-if="isDeckbuilderActive && isNotConjuration" class="text-xl">
      <div v-if="isPhoenixborn">
        <span v-if="deckPhoenixborn && deckPhoenixborn.stub == card.stub" :class="[$style.btn, $style.btnActive, $style.btnFirst, $style.btnLast]" title="Currently selected"><i class="fas fa-check-square"></i></span>
        <button v-else :class="[$style.btn, $style.btnFirst, $style.btnLast]" :title="!deckPhoenixborn ? 'Use' : 'Use instead'" @click="usePhoenixborn">
          <i v-if="!deckPhoenixborn" class="fas fa-plus"></i>
          <i v-else class="fas fa-exchange-alt"></i>
        </button>
      </div>
      <div v-else>
        <button
          v-for="count of Array(4).keys()" :key="count"
          :class="[$style.btn, deckCount === count ? $style.btnActive : '', count === 0 ? $style.btnFirst : '', count === 3 ? $style.btnLast : '']"
          @click="setCardCount(card, count)">
            {{ count }}
          </button>
      </div>
    </div>
    <div class="border border-gray bg-white" :class="[isDeckbuilderActive && !isNotConjuration ? $style.offsetTop : '']">
      <div class="bg-gray-light text-gray text-center relative border-b border-gray-light">
        <i class="text-2xl" :class="[typeIcon, $style.centerIcon]"></i>
        <img
          class="relative"
          width="300"
          height="75"
          alt=" "
          :src="cardImageURL">
      </div>
      <div class="flow-root">
        <card-costs class="p-2 float-right text-right" :costs="card.cost"></card-costs>
        <div class="px-2 py-px text-xs">
          <p class="m-0 font-bold text-lg">
            <router-link :to="linkTarget" class="text-black">{{ card.name }}</router-link>
            <span v-if="card.phoenixborn" class="text-gray font-normal" :title="card.phoenixborn">
              ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
            </span>
          </p>
          <p class="m-0 text-xs">
            {{ card.type }}
            <span v-if="card.placement">
              <span class="divider"><span class="alt-text">-</span></span>
              {{ card.placement }}
            </span>
          </p>
          <div v-if="isPhoenixborn" class="text-center my-2">
            <strong
              v-if="card.battlefield !== undefined"
              class="inline-block border border-red-light px-1">Battlefield {{ card.battlefield }}</strong>
            <strong
              v-if="card.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life {{ card.life }}</strong>
            <strong
              v-if="card.spellboard !== undefined"
              class="inline-block border border-blue-dark px-1">Spellboard {{ card.spellboard }}</strong>
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

            <strong
              v-if="card.attack !== undefined"
              class="inline-block border border-red-light px-1">Attack {{ card.attack }}</strong>
            <span v-else class="inline-block invisible">Attack --</span>

            <strong
              v-if="card.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life {{ card.life }}</strong>
            <span v-else class="inline-block invisible mx-1">Life --</span>

            <strong
              v-if="card.recover !== undefined"
              class="inline-block border border-blue-dark px-1">Recover {{ card.recover }}</strong>
            <span v-else class="inline-block invisible">Recover --</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'
import { debounce } from '/src/utils.js'
import CardCodes from './CardCodes.vue'
import CardCosts from './CardCosts.vue'

// The number of pixels offscreen within which the image should be loaded
const LOAD_IMAGE_IF_WITHIN_PIXELS = 500

export default {
  name: 'Card',
  props: {
    card: {
      required: true,
    },
  },
  components: {
    CardCodes,
    CardCosts,
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
    isDeckbuilderActive () {
      return this.$store.state.builder.enabled
    },
    isNotConjuration () {
      return this.card.type !== 'Conjuration' && this.card.type !== 'Conjured Alteration Spell'
    },
    deckPhoenixborn () {
      return this.$store.state.builder.deck.phoenixborn
    },
    deckCount () {
      return this.$store.state.builder.countMap[this.card.stub] || 0
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
    usePhoenixborn () {
      this.$store.dispatch('builder/setPhoenixborn', this.card)
    },
    setCardCount (card, count) {
      this.$store.dispatch('builder/setCardCount', {
        card,
        count,
      })
    }
  },
}
</script>

<style lang="postcss" module>
.card {
  width: 300px;
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

.btn {
  @apply appearance-none inline-block border-gray-darker bg-gray-light leading-none px-2 py-1 text-gray-darker font-bold text-center border-t-2 border-l-2;
  min-width: 32px;
}

.btnFirst {
  @apply rounded-tl-md;
}

.btnLast {
  @apply rounded-tr-md border-r-2;
}

.btnActive {
  @apply bg-gray-darker text-gray-light;
}

.offsetTop {
  margin-top: 30px;
}
</style>
