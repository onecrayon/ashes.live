<template>
  <div
    class="border border-gray bg-white"
    :class="[$style.card]">
    <div class="bg-gray-light text-gray text-center relative border-b border-gray-light">
      <i class="fas text-2xl" :class="[typeIcon, $style['center-icon']]"></i>
      <img
        class="relative"
        width="300"
        height="75"
        alt=" "
        :src="cardImageURL">
    </div>
    <div class="clearfix">
      <ol class="p-2 float-right text-right">
        <li v-for="(cost, index) of card.cost" :class="$style.cost" :key="index">
          <span v-if="Array.isArray(cost)" :class="$style['parallel-costs']">
            <span v-for="(splitCost, splitIndex) of cost" :class="$style.cost" :key="splitIndex">
              <card-codes :content="splitCost"></card-codes>
            </span>
          </span>
          <card-codes v-else :content="cost"></card-codes>
        </li>
      </ol>
      <div class="p-2">
        <p class="m-0 font-bold text-lg">
          {{ card.name }}
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
        <div v-if="card.text">
          <hr class="my-2 border-gray-light">
          <div
            v-html="parsedEffects"
            class="text-xs leading-snug"
            :class="$style['effect-text']"></div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { typeToFontAwesome } from '/src/constants.js'
import { parseEffectText } from '/src/utils.js'
import CardCodes from './CardCodes.vue'

export default {
  name: 'Card',
  props: {
    card: {
      required: true,
    },
  },
  components: {
    CardCodes,
  },
  computed: {
    cardImageURL () {
      return `${import.meta.env.VITE_CDN_URL}/images/slices/${this.card.stub}.jpg`
    },
    typeIcon () {
      const typeClass = typeToFontAwesome[this.card.type]
      return typeClass ? typeClass : 'fa-question-circle'
    },
    parsedEffects () {
      return parseEffectText(this.card.text)
    }
  },
}
</script>

<style lang="postcss" module>
.card {
  width: 300px;
}

.center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Darn thing is about 25px square, so adjust by hand; transform -50% isn't working for some reason */
  margin: -13px 0 0 -13px;
}


.cost {
  & [class^="phg-"], & [class*=" phg-"] {
    display: inline-block;
    min-width: 20px;
    text-align: center;
  }

  & [class^="phg-"]::before, & [class*=" phg-"]::before {
    padding: 0;
  }

  /* If this is a normal class selector, it gets scoped to the module */
  & [class="phg-basic-magic"]::before {
    position: relative;
    top: -2px;
  }
}

.parallel-costs {
  & .cost {
    display: block;
    padding: 0 0 7px;
    position: relative;

    &::after {
      content: '';
      box-sizing: content-box;
      display: block;
      height: 7px;
      width: 2px;
      border: none;
      border-left: 2px solid var(--color-gray);
      border-right: 2px solid var(--color-gray);
      position: absolute;
      right: 7px;
      bottom: 0px;
      margin-left: -3px;
    }
  }

  & .cost:last-of-type {
    padding: 0;

    &::after {
      display: none;
    }
  }
}

.effect-text {
  & p {
    @apply my-2;
  }
}
</style>
