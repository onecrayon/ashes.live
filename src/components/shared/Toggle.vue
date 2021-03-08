<template>
  <label class="inline-flex items-center cursor-pointer">
    <span class="relative">
      <span class="block w-10 h-6 bg-gray-light rounded-full shadow-inner"></span>
      <span class="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 transition-transform duration-300 ease-in-out"
        :class="{'bg-white': !modelValue, 'bg-blue transform translate-x-full': modelValue}">
        <input type="checkbox" class="absolute opacity-0 w-0 h-0" v-model="value" />
      </span>
    </span>
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: 'Toggle',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (setValue) {
        this.$emit('update:modelValue', setValue)
      },
    },
  },
}
</script>
