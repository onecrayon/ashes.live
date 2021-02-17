<template>
  <section>
    <h1 class="phg-ceremonial-class">Build your deck</h1>

    <div class="flex">
      <text-input
        class="flex-grow"
        v-model="title"
        :placeholder="placeholderTitle"
        :disabled="noPhoenixborn"
        @blur="saveDeck"
        @enter="saveDeck"></text-input>
      <div class="flex-none text-3xl pl-2">
        <i :class="{
          'fas fa-circle-notch fa-spin text-gray': isSaving,
          'far fa-check-circle text-green': !isSaving
        }"></i>
      </div>
    </div>
  </section>
</template>

<script>
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'Builder',
  components: {
    TextInput,
  },
  computed: {
    deck () {
      return this.$store.state.builder.deck
    },
    title: {
      get () {
        return this.deck.title
      },
      set (value) {
        this.$store.commit('builder/setTitle', value)
      },
    },
    placeholderTitle () {
      if (this.deck.phoenixborn) return `Untitled ${this.deck.phoenixborn.name}`
      return `Untitled Deck`
    },
    noPhoenixborn () {
      return !this.deck.phoenixborn
    },
    isSaving () {
      return this.$store.state.builder.isSaving
    },
  },
  methods: {
    saveDeck () {
      this.$store.dispatch('builder/SAVE_DECK')
    },
  },
}
</script>
