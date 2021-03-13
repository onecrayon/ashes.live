<template>
  <input-button
    :placeholder="placeholder"
    :disabled="isDisabled"
    :model-value="search"
    button-title="Clear Search"
    button-icon-class="fas fa-times"
    :button-disabled="!search || isDisabled"
    @update:modelValue="$emit('update:search', $event)"
    @click-button="$emit('update:search', '')"
    role="search"
    aria-label="Search..."
  />
</template>

<script>
import InputButton from './InputButton.vue'

export default {
  name: 'ClearableSearch',
  props: {
    isDisabled: Boolean,
    search: {
      default: '',
      type: String,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  emits: ['update:search'],
  components: {
    InputButton,
  },
}
</script>
