<template>
  <div v-if="error">
    <h1 class="phg-discard">No player found</h1>

    <p class="text-lg">
      Sorry, this does not appear to be a valid player!
    </p>
  </div>
  <div v-else-if="!username">
    <h1 class="phg-illusion-power text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else>
    <h1 class="phg-illusion-power">{{ username }}<span class="text-gray">#{{ badge }}</span></h1>
    <card-codes :content="description" needs-paragraphs></card-codes>
    <deck-listing :showForUser="this.badge"></deck-listing>
  </div>
</template>

<script>
import { request } from '/src/utils.js'
import CardCodes from '../shared/CardCodes.vue'
import DeckListing from '../decks/DeckListing.vue'
import SideDrawer from '../shared/SideDrawer.vue'

export default {
  name: 'PlayerPublicProfile',
  props: ['badge'],
  components: {
    CardCodes,
    DeckListing,
    SideDrawer
  },
  data: () => ({
    username: null,
    description: null,
    error: false,
  }),
  beforeMount () {
    request(`/v2/players/${this.badge}`).then(response => {
      this.username = response.data.username
      this.description = response.data.description
      // And set the site title
      document.title = `${this.username}#${this.badge} - Ashes.live`
    }).catch(error => {
      this.error = true
    })
  },
}
</script>
