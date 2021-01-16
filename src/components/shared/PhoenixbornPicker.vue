<template>
  <div class="flex flex-no-wrap">
    <select
      id="phoenixborn"
      name="Phoenixborn"
      v-bind:value="filter"
      class="border-2 bg-white border-gray-darker rounded h-full px-2 flex-auto"
      :placeholder="placeholder"
      @change="$emit('update:filter', $event.target.value)">
      <option value="" disabled selected>{{ placeholder }}</option>
      <option value="">All Phoenixborn</option>
      <option v-for="option in phoenixborns" :key="option.stub" :value="option.stub">{{option.name}}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'PhoenixbornPicker',
  props: {
    placeholder: '',
    isLegacy: false,
    filter: '',
	},
  data () {
    return {
      phoenixborns: null,
    }
  },
  emits: ['update:filter'],
  created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      this.phoenixborns = await this.$store.dispatch(this.isLegacy ? 'cards/fetchLegacyPhoenixborns' : 'cards/fetchPhoenixborns')
    }
  }
}
</script>
