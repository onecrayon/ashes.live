<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-2">
    <deck-cards-type-list :cards="this.readySpells" typeLabel="Ready Spells" />
    <deck-cards-type-list :cards="this.allies" typeLabel="Allies" />
    <deck-cards-type-list :cards="this.actionSpells" typeLabel="Action Spells" />
    <deck-cards-type-list :cards="this.reactionSpells" typeLabel="Reaction Spells" />
    <deck-cards-type-list :cards="this.alterationSpells" typeLabel="Alteration Spells" />
    <deck-cards-type-list :cards="this.conjurations" typeLabel="Conjurations" />
  </div>
</template>

<script>
import DeckCardsTypeList from './DeckCardsTypeList.vue'

const filterCardsByType = (cards, type) => cards.filter(card => card.type === type)

export default {
  name: 'DeckCardsPreview',
  props: ['cards', 'conjurations'],
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
