<template>
<div v-if="error">
    <h1 class="phg-discard">No deck found</h1>

    <p class="text-lg">
      Sorry, this does not appear to be a valid deck!
    </p>
  </div>
  <div v-else-if="!deck">
    <h1 class="phg-side-action text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else>
    <h1 class="phg-side-action">{{ deck.title }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        class="mb-4 col-span-2 flex flex-row"
        :class="$style.deckContainer">
        <img :src="phoenixbornImagePath" />
        <div class="flex-grow text-xs">
          <div class="text-3xl">
            <card-link :card="deck.phoenixborn"></card-link>
          </div>
          <ul class="mb-2 mt-2 text-base">
            <strong
            v-if="deck.phoenixborn.battlefield !== undefined"
            class="inline-block border border-red-light px-1">Battlefield {{ deck.phoenixborn.battlefield }}</strong>
            <strong
              v-if="deck.phoenixborn.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life {{ deck.phoenixborn.life }}</strong>
            <strong
              v-if="deck.phoenixborn.spellboard !== undefined"
              class="inline-block border border-blue-dark px-1">Spellboard {{ deck.phoenixborn.spellboard }}</strong>
          </ul>
          <div class="mb-2 mt-2 font-bold text-xl flex flex-col sm:flex-row">
            <deck-dice :dice="deck.dice" />
          </div>
          <hr class="mb-4 mt-4" />
          <div class="mb-1">
            <span class="text-lg font-bold">Cards</span>
            <span class="text-sm float-right font-bold" :class="[ cardsCount != 30 ? $style.deckNotFull : 'text-gray-darker']">
              {{ cardsCount }}/30
            </span>
          </div>
          <deck-cards-preview :cards="deck.cards" :conjurations="deck.conjurations" :columnLayout="true"/>
        </div>
      </div>
      <div>
        <div>
          <span class="text-gray-darker w-20 inline-block">Author:</span>
          <span>
            <user-badge :user="deck.user" />
          </span>
        </div>
        <div>
          <span class="text-gray-darker w-20 inline-block">Updated:</span>
          <span>{{ lastUpdatedDateFormatted }} ago</span>
        </div>
        <div>
          <span class="text-gray-darker w-20 inline-block">Requires:</span>
          <span>{{ formatReleases }}</span>
        </div>
      </div>
    </div>
    <hr />
    <h1>Description</h1>
    <DeckDescription :content="deck.description" :isLegacy="deck.is_legacy"/>
  </div>
</template>

<script>
import { compile } from 'vue'
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import { request, getPhoenixbornImageUrl } from '/src/utils.js'
import DeckCardsPreview from './DeckCardsPreview.vue'
import DeckDescription from './DeckDescription.vue'
import DeckDice from './DeckDice.vue'
import UserBadge from '../users/UserBadge.vue'

export default {
  name: 'DeckDetails',
  props: ['id'],
  components: {
    DeckCardsPreview,
    DeckDescription,
    DeckDice,
    UserBadge,
  },
  data () {
    return {
      deck: null,
      releases: null,
      error: false,
    }
  },
  beforeMount () {
    request(`/v2/decks/${this.id}`).then(response => {
      this.deck = response.data.deck
      this.releases = response.data.releases
      // And set the site title
      document.title = `${this.deck.title} - Ashes.live`
    }).catch(error => {
      this.error = true
    })
  },
  computed: {
    phoenixbornImagePath () {
      return getPhoenixbornImageUrl(this.deck.phoenixborn.stub, true, this.deck.is_legacy)
    },
    lastUpdatedDateFormatted () {
      return formatDistanceToNowStrict(parseISO(this.deck.modified))
    },
    cardsCount () {
      return this.deck.cards.reduce((prev, card) => {
        return prev + card.count
      }, 0)
    },
    formatReleases() {
      const releaseNames = this.releases.map(r => r.name)
      return releaseNames.join(', ')
    }
  },
}
</script>
<style lang="postcss" module>
.deckContainer {
  background-repeat: no-repeat;
}

.deckNotFull {
  color: var(--color-red);
}

</style>