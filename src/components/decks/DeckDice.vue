<template>
  <ul :class="$style.dice">
    <template v-for="(die, idx) of dice" :key="idx">
      <li
        v-for="index in die.count" :key="index"
        class="w-6 h-6 text-sm sm:w-8 sm:h-8 sm:text-xl die"
        :class="['phg-' + die.name + '-power', die.name, $style.die]">
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'DeckDice',
  props: ['dice'],
}
</script>

<style module>
.dice {
  display: flex;
  margin: 0;
}
.die {
  line-height: 1.5em;
  flex: 0 0 auto;
  border-radius: 3px;
  margin: 0.1em;
  text-align: center;
}
.die:before {
  padding: 0;
}
</style>
