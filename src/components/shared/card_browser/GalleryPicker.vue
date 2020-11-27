<template>
  <div class="flex flex-wrap-none text-sm">
    <button
      class="btn btn-first py-1 px-2"
      :class="{active: galleryStyle === 'list'}"
      title="List view"
      :disabled="isDisabled"
      @click="galleryStyle = 'list'">
      <i class="fas fa-bars"></i>
    </button><button
      class="btn btn-last py-1 px-2"
      title="Binder view"
      :class="{active: galleryStyle === 'binder'}"
      :disabled="isDisabled"
      @click="galleryStyle = 'binder'">
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
  },
  computed: {
    galleryStyle: {
      get () {
        return this.$store.state.options.galleryStyle
      },
      set (value) {
        this.$store.commit('options/setGalleryStyle', value)
      }
    }
  },
}
</script>
