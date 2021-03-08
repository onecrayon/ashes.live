<template>
  <div class="h-full">
    <div v-if="label" class="font-bold text-sm text-gray-darker pl-2">{{ label }}</div>
    <input
      class="appearance-none border-2 bg-white rounded-md px-2 py-1 w-full"
      :class="isInvalid ? 'border-red' : 'border-black'"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="handleSpecialKeys"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      ref="textInput">
  </div>
</template>

<script>
/**
 * TextInput is a simple wrapper around `<input type="text">` that applies standardized styling.
 * Used for most simple text entries in forms across the site.
 */
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
    disabled: {
      type: Boolean,
      default: false,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['focus', 'blur', 'enter', 'escape', 'update:modelValue'],
  methods: {
    focus () {
      this.$refs.textInput.focus()
    },
    handleSpecialKeys (event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        this.$emit('escape')
      } else if (event.key === 'Enter') {
        this.$emit('enter')
      }
    },
  },
}
</script>
