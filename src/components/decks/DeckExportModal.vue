<template>
  <modal :open="open" @update:open="$emit('update:open', false)">
    <div class="sm:w-96 sm:mx-auto">
      <h2 class="phg-natural-power">Share and export</h2>

      <div v-if="deck.direct_share_uuid" class="mb-4">
        <p v-if="!deck.is_snapshot" class="border-2 border-orange rounded bg-inexhaustible px-4 py-2 mb-2">
          <strong>Warning:</strong> anyone with this link can see the most recent saved copy of your deck!
        </p>
        <p v-else class="mb-2">
          Use this link to <span v-if="!deck.is_public">privately share your deck or</span> import in Ashteki or Tabletop Simulator.
        </p>
        <input-button
          v-model="shareURL"
          button-title="Copy"
          button-icon-class="far fa-copy"
          readonly
          @focus="selectDirectShare"
          @click-button="copyDirectShare"
          ref="directShare"
        />
        <hr class="mt-4 mb-4" />
      </div>

      <textarea
        class="border-2 border-gray w-full h-40 rounded text-sm px-2 py-1 mb-4"
        ref="textarea"
        @click="selectAll"
        v-model="deckText"
        readonly></textarea>
      <div class="grid grid-cols-2 gap-1">
        <div>
          <toggle v-model="showCardCounts"><span class="ml-2 text-sm">Card counts</span></toggle>
        </div>
        <div>
          <toggle v-model="sortByType"><span class="ml-2 text-sm">Sort by type</span></toggle>
        </div>
        <div>
          <toggle v-model="showAttribution"><span class="ml-2 text-sm">Attribution</span></toggle>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import { useToast } from 'vue-toastification'
import { capitalize } from '/src/utils/text.js'
import { cardsByType, deckTitle } from '/src/utils/decks.js'
import InputButton from '../shared/InputButton.vue'
import Modal from '../shared/Modal.vue'
import Toggle from '../shared/Toggle.vue'

export default {
  name: 'DeckExportModal',
  props: {
    open: Boolean,
    deck: {
      required: true,
    },
  },
  emits: ['update:open'],
  components: {
    InputButton,
    Modal,
    Toggle,
  },
  setup () {
    // Expose toasts for use in other portions of this component
    return { toast: useToast() }
  },
  computed: {
    shareURL () {
      return `${location.protocol}//${location.host}/decks/share/${this.deck.direct_share_uuid}/`
    },
    showCardCounts: {
      get () {
        return this.$store.state.options.exportShowCardCounts
      },
      set (value) {
        this.$store.commit('options/setExportShowCardCounts', value)
      },
    },
    sortByType: {
      get () {
        return this.$store.state.options.exportSortByType
      },
      set (value) {
        this.$store.commit('options/setExportSortByType', value)
      },
    },
    showAttribution: {
      get () {
        return this.$store.state.options.exportShowAttribution
      },
      set (value) {
        this.$store.commit('options/setExportShowAttribution', value)
      },
    },
    deckText () {
      const text = [
        deckTitle(this.deck),
        '\n\nPhoenixborn: ',
        this.deck.phoenixborn.name,
        '\n\n'
      ]
      let haveDice = false
      for (const dieObject of this.deck.dice) {
        const count = dieObject.count
        if (count) {
          if (!haveDice) {
            text.push('Dice:\n')
            haveDice = true
          }
          text.push(count, 'x ', capitalize(dieObject.name), '\n')
        }
      }
      if (haveDice) {
        text.push('\n')
      }
      if (this.deck.cards && this.deck.cards.length) {
        if (!this.sortByType || this.showCardCounts) {
          text.push('Cards')
          if (this.showCardCounts) {
            text.push(' (', this.deck.cards.reduce((value, card) => card.count + value, 0), ' / 30)')
          }
          text.push(':\n')
          if (this.sortByType) {
            text.push('\n')
          }
        }
        let cardsOnly = []
        const conjurations = this.deck.conjurations
        const pushCards = (cards) => {
          for (const card of cards) {
            text.push(card.count, 'x ', card.name)
            if (card.phoenixborn) {
              text.push(' (', card.phoenixborn, ')')
            }
            text.push('\n')
          }
        }
        const deckSections = cardsByType(this.deck)
        for (const section of deckSections) {
          if (this.sortByType) {
            text.push(section.title)
            if (this.showCardCounts && section.count) {
              text.push(' (', section.count, ')')
            }
            text.push(':\n')
            pushCards(section.contents)
            text.push('\n')
          } else {
            cardsOnly = cardsOnly.concat(section.contents)
          }
        }
        if (!this.sortByType) {
          cardsOnly.sort((a, b) => {
            if (a.name == b.name) return 0
            return a.name < b.name ? -1 : 1
          })
          pushCards(cardsOnly)
          text.push('\n')
          if (conjurations && conjurations.length) {
            text.push('Conjuration Pile:\n')
            pushCards(conjurations)
            text.push('\n')
          }
        }
      }
      if (this.showAttribution) {
        text.push('Created with https://ashes.live')
      }
      return text.join('').trim()
    },
  },
  methods: {
    selectAll () {
      this.$refs.textarea.focus()
      this.$refs.textarea.select()
      this.$refs.textarea.scrollTop = 0
    },
    selectDirectShare () {
      this.$refs.directShare.focus()
      this.$refs.directShare.select()
    },
    copyDirectShare () {
      if (navigator && navigator.clipboard) {
        navigator.clipboard.writeText(this.shareURL)
      } else {
        this.selectDirectShare()
        document.execCommand('copy')
      }
      this.toast.success('Share URL copied!')
    },
  },
}
</script>
