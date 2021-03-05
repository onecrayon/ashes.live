<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 flex flex-col">
      <div class="flex-none shadow-md bg-white relative max-h-screen overflow-y-auto">
        <div class="absolute inset-0" @click="closeModal"></div>
        <div class="p-4 container mx-auto relative">
          <slot></slot>
        </div>
        <button class="text-4xl text-gray-light absolute right-4 top-2" @click="closeModal">
          <i class="far fa-times-circle"></i>
          <span class="alt-text">Close</span>
        </button>
      </div>
      <div class="flex-1 bg-black opacity-25" @click="closeModal"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    open: Boolean,
  },
  emits: ['update:open'],
  methods: {
    closeModal () {
      this.$emit('update:open', false)
    },
  },
  watch: {
    open (value) {
      if (value) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    },
  },
}
</script>
