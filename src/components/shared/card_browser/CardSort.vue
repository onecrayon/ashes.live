<template>
  <div class="flex flex-wrap-none text-sm">
    <button class="btn btn-first py-1 px-2 font-normal"
      :title="sortingLogicTooltip"
      :disabled="isDisabled"
      @click="toggleOrder">
      Sort
      <i v-if="order === 'asc'" class="fas fa-angle-up"></i>
      <i v-else class="fas fa-angle-down"></i>
    </button
    ><button
      class="btn btn-inner py-1 px-2 font-normal"
      :class="{active: sort === 'name'}"
      :disabled="isDisabled"
      @click="$emit('update:sort', 'name')">Name</button
    ><button
      class="btn btn-inner py-1 px-2 font-normal"
      :class="{active: sort === 'type'}"
      :disabled="isDisabled"
      @click="$emit('update:sort', 'type')">Type</button
    ><button
      class="btn btn-inner py-1 px-2 font-normal"
      :class="{active: sort === 'cost'}"
      :disabled="isDisabled"
      @click="$emit('update:sort', 'cost')">Cost</button
    ><button
      class="btn btn-last py-1 px-2 font-normal"
      :class="{active: sort === 'dice'}"
      :disabled="isDisabled"
      @click="$emit('update:sort', 'dice')">Dice</button
    >
  </div>
</template>

<script>
export default {
  name: 'CardSort',
  props: {
    isPhoenixbornPicker: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    sort: {
      type: String,
      default: 'name',
    },
    order: {
      type: String,
      default: 'asc',
    },
  },
  emits: ['update:sort', 'update:order'],
  computed: {
    sortingLogicTooltip () {
      return `Sorted in ${this.order === 'asc' ? 'ascending' : 'descending'} order`
    },
  },
  methods: {
    toggleOrder () {
      this.$emit('update:order', this.order === 'asc' ? 'desc' : 'asc')
    },
  },
}
</script>
