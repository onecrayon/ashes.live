<template>
  <div>
    <img
      width="300"
      height="75"
      :src="cardImageURL"
      :alt="card.name">
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: {
      required: true,
    },
    isVisible: Boolean,
  },
  computed: {
    cardImageURL () {
      if (!this.isVisible) return ''
      return `${import.meta.env.VITE_CDN_URL}/images/slices/${this.card.stub}.jpg`
    },
  },
}
</script>
