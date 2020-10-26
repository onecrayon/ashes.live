<template>
  <div class="flex flex-no-wrap">
    <input class="appearance-none border-2 border-gray-darker border-r rounded-l-md h-full px-2 flex-auto"
      type="text" placeholder="Filter by name or text..."
      v-model="filter"
    ><button class="btn btn-last h-full px-4 text-l flex-none" title="Clear Search"
      @click="filter = null">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'TextFilter',
  emits: {
    'text-filter': null,
  },
  data: () => {
    return {
      filterText: '',
    }
  },
  computed: {
    filter: {
      get () {
        return this.filterText
      },
      set (value) {
        this.filterText = value || ''
        // Pass the filter value up to the parent component
        this.$emit('text-filter', event.target.value)
      },
    }
  },
}
</script>
