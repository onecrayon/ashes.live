<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 flex flex-col">
      <!-- TODO: figure out how to slide this element from the top instead of just fading everything -->
      <div class="flex-none shadow-md bg-white relative max-h-screen overflow-y-auto">
        <div class="absolute inset-0" @click="closeModal"></div>
        <div class="p-4 container mx-auto relative">
          <slot></slot>
        </div>
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
}
</script>
