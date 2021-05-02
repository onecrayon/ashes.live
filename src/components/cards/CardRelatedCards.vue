<template>
  <li>
    <span v-for="(summon, index) of summonList" :key="summon.stub">
      <em v-if="summon.stub == card.stub">{{ summon.name }}</em>
      <router-link v-else :to="{name: showLegacy ? 'CardDetailsLegacy': 'CardDetails', params: { stub: summon.stub }}">{{ summon.name }}</router-link>
      <span v-if="index < summonList.length - 1">, </span>
    </span>
    <ul v-if="conjurations && conjurations.length" class="list-circle pl-4">
      <li v-for="conjuration of conjurations" :key="conjuration.stub">
        <em v-if="conjuration.stub == card.stub">{{ conjuration.name }}</em>
        <router-link v-else :to="{name: showLegacy ? 'CardDetailsLegacy': 'CardDetails', params: { stub: conjuration.stub }}">{{ conjuration.name }}</router-link>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'CardRelatedCards',
  props: ['card', 'summons', 'conjurations', 'showLegacy'],
  computed: {
    summonList () {
      if (!Array.isArray(this.summons)) return [this.summons]
      return this.summons
    },
  }
}
</script>
