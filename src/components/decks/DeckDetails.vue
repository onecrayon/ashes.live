<template>
  <div v-if="error">
    <h1 class="phg-discard">No deck found</h1>

    <p class="text-lg">
      Sorry, this does not appear to be a valid deck!
    </p>
  </div>
  <div v-else-if="!deck">
    <h1 class="phg-main-action text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else>
    <h1 class="phg-main-action mb-6" :class="{'italic font-normal': !deck.title}">{{ title }}</h1>
    <p v-if="showMine" class="text-l border-2 border-orange rounded bg-inexhaustible px-4 py-2 mb-8">
      <i v-if="!!deck.is_snapshot" class="far fa-camera"></i>
      <i v-if="!deck.is_public" class="far fa-eye-slash pl-1"></i>
      <span v-if="!!deck.is_snapshot">
        You are viewing a <strong v-if="!deck.is_public">private</strong><strong v-else>public</strong> snapshot for this deck.
      </span>
      <span v-else>
        You are viewing your most recent private save for this deck.
      </span>
      <router-link v-if="hasPublishedSnapshot" :to="{name: 'DeckDetails', params: {id: deck.id}}">View latest published URL.</router-link>
    </p>
    <div class="lg:flex">
      <div class="mb-4 lg:pl-8 lg:w-1/3 lg:order-2">
        <div class="grid gap-x-2 mb-4" :class="$style.metaGrid">
          <span class="text-gray-darker">Author:</span>
          <player-badge :user="user" />

          <span class="text-gray-darker">Updated:</span>
          <span>{{ lastUpdatedDateFormatted }} ago</span>

          <span class="text-gray-darker">Requires:</span>
          <span>
            <span v-for="(release, index) of releases" :key="release.stub">
              <span v-if="index != 0">, </span>
              <router-link v-if="release.preconstructed_deck_id" :to="{name: 'DeckDetails', params: {id: release.preconstructed_deck_id}}">
                {{ release.name }}
              </router-link>
              <span v-else>
                {{ release.name }}
              </span>
            </span>
          </span>
        </div>

        <button class="btn py-1 w-full mb-8" @click="showTextExport = true">
          <i class="fas fa-share-square"></i>
          Share...
        </button>
        <deck-export-modal v-model:open="showTextExport" :deck="deck"></deck-export-modal>

        <!-- TODO: implement generic controls like Subscribe, etc. -->

        <!-- Owner's controls -->
        <div v-if="(showMine || user.badge === currentUserBadge) && !deck.is_legacy" class="mb-4">
          <deck-edit-buttons :deck="savedDeck" @deleted="$router.push('/decks/' + (showMine ? '/mine/' : ''))" @refresh="loadDeck()" standalone-buttons></deck-edit-buttons>
        </div>

        <button v-if="isAuthenticated" class="btn py-1 w-full" @click="copyAndEdit" :disabled="isTalkingToServer">
          <i class="far fa-copy"></i>
          Clone &amp; Edit
        </button>
      </div>
      <div
        class="lg:w-2/3 lg:order-1 flex">
        <div
          class="flex-none bg-no-repeat sm:pl-40"
          :class="$style.minHeight400"
          aria-hidden="true"
          :style="`background-image: url(${phoenixbornImagePath})`"></div>
        <div class="flex-grow pb-4">
          <h2 class="text-3xl">
            <card-link :card="deck.phoenixborn"></card-link>
          </h2>
          <ul class="mb-2 mt-2 text-xs">
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
          <deck-dice class="my-2" :dice="deck.dice" />
          <hr class="mb-4 mt-4" />
          <h3 class="text-lg flex mb-1">
            <span class="flex-grow">Cards</span>
            <span class="flex-none text-sm font-bold" :class="[ cardsCount != 30 ? 'text-red' : 'text-gray-darker']">
              {{ cardsCount }}/30
            </span>
          </h3>
          <deck-cards-preview :deck="deck" :columnLayout="true"/>
        </div>
      </div>
    </div>
    <hr class="mb-4">
    <div v-if="deck.description">
      <h2>Description</h2>

      <card-codes :content="deck.description" :is-legacy="deck.is_legacy" needs-paragraphs></card-codes>
    </div>
  </div>
</template>

<script>
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import { request, getPhoenixbornImageUrl } from '/src/utils/index.js'
import { deckTitle } from '/src/utils/decks.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import DeckCardsPreview from './DeckCardsPreview.vue'
import DeckDice from './DeckDice.vue'
import DeckExportModal from './DeckExportModal.vue'
import DeckEditButtons from '../shared/DeckEditButtons.vue'
import CardCodes from '../shared/CardCodes.vue'
import PlayerBadge from '../shared/PlayerBadge.vue'

export default {
  name: 'DeckDetails',
  props: ['id'],
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    CardCodes,
    DeckCardsPreview,
    DeckDice,
    DeckEditButtons,
    DeckExportModal,
    PlayerBadge,
  },
  data () {
    return {
      _deck: null,
      releases: null,
      hasPublishedSnapshot: false,
      error: false,
      showTextExport: false,
      isTalkingToServer: false,
    }
  },
  beforeMount () {
    this.loadDeck()
    // Watch the edited deck ID since we need to reload if we exit editing on this page
    this.unwatchBuilderId = this.$store.watch(state => state.builder.deck.id, (value, oldValue) => {
      if (oldValue === this._deck.id && value !== oldValue) {
        this.$nextTick(this.loadDeck)
      }
    })
  },
  beforeUnmount () {
    this.unwatchBuilderId()
  },
  computed: {
    showMine () {
      return this.$route.meta.showMine
    },
    currentUserBadge () {
      const loggedInUser = this.$store.getters['player/user']
      return (loggedInUser && loggedInUser.badge) || null
    },
    deck () {
      if (this._deck && this.$store.state.builder.deck.id === this._deck.id) return this.$store.state.builder.deck
      return this._deck
    },
    savedDeck () {
      // This is the latest save we have loaded; necessary for things like tracking the user and snapshot state
      return this._deck
    },
    user () {
      // This has to be to the saved version of the deck, because we don't persist it for the builder
      return this.savedDeck.user
    },
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
    },
    title () {
      return deckTitle(this.deck)
    },
    isAuthenticated () {
      return this.$store.getters['player/isAuthenticated']
    },
  },
  methods: {
    loadDeck () {
      const options = {}
      if (this.showMine) {
        options.params = { show_saved: true }
      }
      request(`/v2/decks/${this.id}`, options).then(response => {
        this._deck = response.data.deck
        this.releases = response.data.releases
        this.hasPublishedSnapshot = !!response.data.has_published_snapshot
        // And set the site title
        document.title = `${deckTitle(this._deck)} - Ashes.live`
      }).catch(error => {
        this.handleResponseError(error)
        this.error = true
      })
    },
    copyAndEdit () {
      this.isTalkingToServer = true
      this.$store.dispatch('builder/cloneDeck', { id: this.id }).catch(this.handleResponseError).finally(() => {
        this.isTalkingToServer = false
      })
    },
  },
}
</script>

<style lang="postcss" module>
.metaGrid {
  grid-template-columns: auto 1fr;
}

.minHeight400 {
  min-height: 400px;
}
</style>
