<template>
  <div>
    <img
      width="300"
      height="75"
      :src="cardImageURL"
      :alt="data.name">
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    // Data should be either a full card object, or an object with name and stub set
    data: {
      required: true,
    },
    isVisible: Boolean,
  },
  computed: {
    cardImageURL () {
      if (!this.isVisible) return ''
      return `${import.meta.env.VITE_CDN_URL}/images/slices/${this.data.stub}.jpg`
    },
  },
}
</script>
