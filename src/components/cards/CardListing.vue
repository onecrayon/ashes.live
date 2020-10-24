<template>
  <h1 class="phg-side-action">Browse cards</h1>

  <card-browser></card-browser>
</template>

<script>
import CardBrowser from '../shared/card_browser/CardBrowser.vue'

export default {
  name: 'CardListing',
  components: {
    CardBrowser,
  }
}
</script>
