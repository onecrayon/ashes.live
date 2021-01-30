<template>
  <input
    class="appearance-none border-2 bg-white border-gray-darker rounded-md h-full px-2"
    :type="type"
    :placeholder="placeholder"
    :disabled="isDisabled"
    @input="$emit('update:modelValue', $event.target.value)"
    ref="textInput">
</template>

<script>


export default {
  name: 'TextInput',
  props: {
    modelValue: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    focus () {
      this.$refs.textInput.focus()
    },
  },
}
</script>
