<template>
  <button class="mb-1" aria-label="Open Menu" @click="drawer">
    <svg
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      class="w-8 h-8"
    >
      <path d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  </button>
  <transition
    enter-class="opacity-0"
    enter-active-class="ease-out transition-medium"
    enter-to-class="opacity-100"
    leave-class="opacity-100"
    leave-active-class="ease-out transition-medium"
    leave-to-class="opacity-0"
  >
    <div
      @keydown.esc="isDescriptionOpen = false"
      v-show="isDescriptionOpen"
      class="z-10 fixed inset-0 transition-opacity"
    >
      <div
        @click="isDescriptionOpen = false"
        class="absolute inset-0 bg-black opacity-50"
        tabindex="0">
      </div>
    </div>
  </transition>
  <aside
    class="transform top-0 -right-96 w-96 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-700 z-30"
    :class="isDescriptionOpen ? '-translate-x-full' : 'translate-x-0'">
    <div class="pt-8 pl-4 pr-4">
      <!-- Insert the content here -->
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SideDrawer',
  data() {
    return {
      isDescriptionOpen: false
    }
  },
  methods: {
    drawer() {
      this.isDescriptionOpen = !this.isDescriptionOpen;
    }
  },
  watch: {
    isDescriptionOpen: {
      immediate: true,
      handler(isDescriptionOpen) {
        if (process.client) {
          if (isDescriptionOpen) {
            document.body.style.setProperty("overflow", "hidden");
          } else {
            document.body.style.removeProperty("overflow");
          }
        }
      }
    }
  }
}
</script>
