<template>
  <div :class="[ columnLayout ? 'text-base': 'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2']">
    <deck-cards-type-list :cards="this.readySpells" class="mb-4" typeLabel="Ready Spells" />
    <deck-cards-type-list :cards="this.allies" class="mb-4" typeLabel="Allies" />
    <deck-cards-type-list :cards="this.actionSpells" class="mb-4" typeLabel="Action Spells" />
    <deck-cards-type-list :cards="this.reactionSpells" class="mb-4" typeLabel="Reaction Spells" />
    <deck-cards-type-list :cards="this.alterationSpells" class="mb-4" typeLabel="Alteration Spells" />
    <deck-cards-type-list :cards="this.conjurations" class="mb-4" typeLabel="Conjurations" />
  </div>
</template>

<script>
import DeckCardsTypeList from './DeckCardsTypeList.vue'

const filterCardsByType = (cards, type) => cards.filter(card => card.type === type)

export default {
  name: 'DeckCardsPreview',
  props: {
    cards: null,
    conjurations: null,
    columnLayout: false
  },
  components: {
    DeckCardsTypeList,
  },
  computed: {
    readySpells() {
      return filterCardsByType(this.cards, 'Ready Spell')
    },
    allies() {
      return filterCardsByType(this.cards, 'Ally')
    },
    actionSpells() {
      return filterCardsByType(this.cards, 'Action Spell')
    },
    reactionSpells() {
      return filterCardsByType(this.cards, 'Reaction Spell')
    },
    alterationSpells() {
      return filterCardsByType(this.cards, 'Alteration Spell')
    },
  },
}
</script>
