<template>
  <ul class="dice">
    <template v-for="(die, idx) of dice" :key="idx">
      <li v-for="index in die.count" :key="index" :class="['phg-' + die.name + '-power', die.name, 'die']">
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
  margin: 4px 0;
}
.die {
  font-size: 1em;
  line-height: 1.5em;
  flex: 0 0 auto;
  border-radius: 3px;
  margin: 0 0 0 2px;
  height: 32px;
  width: 32px;
  text-align: center;
  padding-left: 2px;
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