<template>
  <transition
    name="height-auto"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave">
    <slot></slot>
  </transition>
</template>

<script>
// Lightly adapted from: https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
export default {
  name: 'TransitionHeight',
  methods: {
    enter(element) {
      const { width } = getComputedStyle(element)

      element.style.width = width
      element.style.position = 'absolute'
      element.style.visibility = 'hidden'
      element.style.height = 'auto'

      const { height } = getComputedStyle(element)

      element.style.width = null
      element.style.position = null
      element.style.visibility = null
      element.style.height = 0

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height

      requestAnimationFrame(() => {
        element.style.height = height
      })
    },
    afterEnter (element) {
      element.style.height = 'auto'
    },
    leave(element) {
      const { height } = getComputedStyle(element)

      element.style.height = height

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height

      requestAnimationFrame(() => {
        element.style.height = 0
      })
    },
  },
}
</script>
