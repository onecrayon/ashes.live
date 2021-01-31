<template>
  <span class="cursor-pointer" :class="{'hover:underline': useUnderline, 'text-blue': useColor}">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'LinkAlike',
  props: {
    useColor: {
      type: Boolean,
      default: false,
    },
    useUnderline: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
