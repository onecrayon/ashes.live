<template>
  <div class="flex flex-nowrap">
    <input
      class="appearance-none border-2 bg-white border-black border-r rounded-l-md h-full px-2 flex-auto"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup="handleSpecialKeys"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      ref="input"
    ><button class="btn btn-last h-full px-4 text-l flex-none" :title="buttonTitle"
      :disabled="disabled || buttonDisabled"
      @click="$emit('clickButton', $event)">
      <i :class="buttonIconClass"></i>
      <span class="alt-text">{{ buttonTitle }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonInput',
  props: {
    modelValue: {
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    buttonIconClass: {
      type: String,
      required: true,
    },
    buttonTitle: {
      type: String,
      required: true,
    },
    buttonDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'clickButton', 'escape', 'enter', 'focus', 'blur'],
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    select () {
      this.$refs.input.select()
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
