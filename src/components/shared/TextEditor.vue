<template>
  <div>
    <div v-if="label" class="font-bold text-sm text-gray-darker pl-2">{{ label }}</div>
    <textarea
      class="appearance-none border-2 bg-white border-gray-darker rounded-md px-2 py-1 w-full h-60"
      ref="textArea"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"></textarea>
  </div>
</template>

<script>
/**
 * TextEditor is a full-sized text editing component that provides tools for helping with inserting
 * card codes (along with help information about using card codes).
 *
 * TODO: implement helpers and help modal for card codes and star formatting
 */
export default {
  name: 'TextEditor',
  props: {
    modelValue: String,
    label: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['focus', 'blur', 'update:modelValue'],
  methods: {
    focus () {
      this.$refs.textArea.focus()
    },
  },
}
</script>
