<template>
  <ul class="dice">
    <template v-for="(die, idx) of dice" :key="idx">
      <li v-for="index in die.count" :key="index" :class="['phg-' + die.name + '-power', die.name, 'die']" class="w-6 h-6 text-sm sm:w-8 sm:h-8 sm:text-xl">
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

<style>
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
.ceremonial {
  color: #ee3342;
  background: #111821;
  border-color: #ee3342;
}
.charm {
  color: #f7e442;
  background: #f34f98;
  border-color: #f7e442;
}
.illusion {
  color: #8bc7ea;
  background: #490d67;
  border-color: #8bc7ea;
}
.natural {
  color: #cedb00;
  background: #004a98;
  border-color: #cedb00;
}
.divine {
  color: #b58a2b;
  background: #f2f2f2;
  border-color: #b58a2b;
}
.sympathy {
  color: #e3c2af;
  background: #119981;
  border-color: #e3c2af;
}
.time {
  color: #dfdfdf;
  background: #9a2e36;
  border-color: #dfdfdf;
}
</style>