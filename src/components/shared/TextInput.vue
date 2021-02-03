<template>
  <div class="h-full">
    <div v-if="label" class="font-bold text-sm text-gray-darker pl-2">{{ label }}</div>
    <input
      class="appearance-none border-2 bg-white border-gray-darker rounded-md px-2 py-1 w-full"
      :type="type"
      :placeholder="placeholder"
      :disabled="isDisabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="handleSpecialKeys"
      ref="textInput">
  </div>
</template>

<script>


export default {
  name: 'TextInput',
  props: {
    modelValue: String,
    placeholder: String,
    label: String,
    type: {
      type: String,
      default: 'text',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['escape', 'update:modelValue'],
  methods: {
    focus () {
      this.$refs.textInput.focus()
    },
    handleSpecialKeys (event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        this.$emit('escape')
      }
    },
  },
}
</script>
