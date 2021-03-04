<template>
  <modal :open="open" @update:open="$emit('update:open', false)">
    <div class="sm:w-96 sm:mx-auto">
      <h2 class="phg-natural-power">Export as text</h2>
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
import { capitalize } from '/src/utils.js'
import { deckToSections } from '/src/utils/decks.js'
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
  data: () => ({
    showCardCounts: true,
    sortByType: true,
    showAttribution: true,
  }),
  components: {
    Modal,
    Toggle,
  },
  computed: {
    deckText () {
      const text = [
        this.deck.title || `Untitled ${this.deck.phoenixborn.name}`,
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
        const deckSections = deckToSections(this.deck)
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
    }
  },
  methods: {
    selectAll () {
      this.$refs.textarea.focus()
      this.$refs.textarea.select()
      this.$refs.textarea.scrollTop = 0
    }
  },
}
</script>
