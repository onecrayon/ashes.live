<template>
  <div class="flex flex-nowrap text-sm" role="group" aria-label="Sorting logic">
    <button class="btn btn-first py-1 px-2 font-normal"
      :title="sortingLogicTooltip"
      :disabled="isDisabled"
      @click="toggleOrder">
      Sort<span class="alt-text"> {{ order === 'asc' ? 'ascending' : 'descending' }} by:</span>
      <i v-if="order === 'asc'" class="fas fa-angle-up ml-1"></i>
      <i v-else class="fas fa-angle-down ml-1"></i>
    </button
    ><button
      class="btn btn-inner py-1 px-2 font-normal"
      :class="{active: sort === 'name'}"
      :disabled="isDisabled"
      @click="$emit('update:sort', 'name')">Name<span v-if="sort === 'name'" class="alt-text"> (active)</span></button
    ><button
      class="btn btn-inner py-1 px-2 font-normal"
      :class="{active: sort === 'type'}"
      :disabled="isDisabled"
      @click="$emit('update:sort', 'type')">Type<span v-if="sort === 'type'" class="alt-text"> (active)</span></button
    ><button
      class="btn btn-inner py-1 px-2 font-normal"
      :class="{active: sort === 'cost'}"
      :disabled="isDisabled"
      @click="$emit('update:sort', 'cost')">Cost<span v-if="sort === 'cost'" class="alt-text"> (active)</span></button
    ><button
      class="btn btn-last py-1 px-2 font-normal"
      :class="{active: sort === 'dice'}"
      :disabled="isDisabled"
      @click="$emit('update:sort', 'dice')">Dice<span v-if="sort === 'dice'" class="alt-text"> (active)</span></button
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
