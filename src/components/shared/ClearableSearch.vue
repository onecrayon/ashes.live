<template>
  <div class="flex flex-nowrap" role="search" aria-label="Search...">
    <input
      class="appearance-none border-2 bg-white border-gray-darker border-r rounded-l-md h-full px-2 flex-auto"
      type="text"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :value="search"
      @input="$emit('update:search', $event.target.value)"
    ><button class="btn btn-last h-full px-4 text-l flex-none" title="Clear Search"
      :disabled="!search || isDisabled"
      @click="$emit('update:search', '')">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ClearableSearch',
  props: {
    isDisabled: Boolean,
    search: {
      default: '',
      type: String,
	},
	placeholder: {
		type: String,
		required: true,
	},
  },
  emits: ['update:search'],
}
</script>
