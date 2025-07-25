<template>
  <ol v-if="costs && costs.length" :class="['card-costs', isHorizontal ? $style.horizontal : '']">
    <li v-for="(cost, index) of costs" :class="$style.cost" :key="index">
      <span v-if="Array.isArray(cost)" :class="$style.parallelCosts">
        <!-- If we ever have a parallel cost with more than 2 costs this is going to break -->
        <span :class="$style.cost" v-html="parseFormattedText(cost[0])"></span>
        <span class="alt-text"> or </span>
        <span :class="$style.cost" v-html="parseFormattedText(cost[1])"></span>
      </span>
      <span v-else v-html="parseFormattedText(cost)"></span>
    </li>
  </ol>
</template>

<script>
import { parseFormattedText } from '/src/utils/text.js'

export default {
  name: 'CardCosts',
  props: {
    costs: {
      required: true,
    },
    isHorizontal: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    parseFormattedText,
  },
}
</script>

<style lang="postcss" module>
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

.parallelCosts {
  & .cost:first-of-type {
    display: block;
    padding: 0 0 8px;
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
}

.horizontal {
  & li {
    display: inline-block;
  }

  & .cost {
    padding: 0 11px 0 0;
    margin-right: 3px;
    background: url('/src/assets/icon-diamond-bullet.png') no-repeat right 60%;

    & [class^="phg-"], & [class*=" phg-"] {
      display: inline;
      min-width: auto;
    }

    & [class="phg-basic-magic"]::before {
      position: static;
      top: auto;
    }
  }

  & .cost:last-of-type {
    background: none;
    padding: 0;
    margin: 0;
  }

  & .parallelCosts {
    & .cost {
      display: inline-block;
      padding: 0 12px 0 0;
      background: none;

      &::after {
        height: 2px;
        width: 7px;
        border: none;
        border-top: 2px solid var(--color-gray);
        border-bottom: 2px solid var(--color-gray);
        right: 0px;
        top: 50%;
        margin-left: 0;
      }
    }

    & .cost:last-of-type {
      padding: 0;
      margin: 0;
    }
  }
}
</style>
