<template>
  <div class="flex flex-wrap-none text-sm">
    <button
      class="btn btn-first py-1 px-2"
      :class="{active: galleryStyle === 'table'}"
      title="List view"
      :disabled="isDisabled"
      @click="$emit('update:galleryStyle', 'table')">
      <i class="fas fa-bars"></i>
    </button><button
      class="btn btn-last py-1 px-2"
      title="Card view"
      :class="{active: galleryStyle === 'cards'}"
      :disabled="isDisabled"
      @click="$emit('update:galleryStyle', 'cards')">
      <i class="fas fa-th"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'GalleryPicker',
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    galleryStyle: {
      type: String,
      default: 'table',
    },
  },
  emits: ['update:galleryStyle'],
}
</script>
