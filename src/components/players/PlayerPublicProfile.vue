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

    <!-- TODO: move description into a sidebar and add deck-listing that only shows this user's decks -->

    <div>{{ description }}</div>
    <player-decks :badge="badge" :username="username" />
  </div>
</template>

<script>
import { request } from '/src/utils/index.js'
import CardCodes from '../shared/CardCodes.vue'
import PlayerDecks from './PlayerDecks.vue'

export default {
  name: 'PlayerPublicProfile',
  props: ['badge'],
  components: {
    CardCodes,
    PlayerDecks,
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
