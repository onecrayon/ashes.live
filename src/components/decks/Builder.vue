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
      <button class="flex-none text-3xl pl-2" @click="saveDeck" :disabled="noPhoenixborn" :title="saveAction">
        <i :class="{
          'far fa-circle text-gray': noPhoenixborn,
          'fas fa-circle-notch fa-spin text-gray': isSaving,
          'far fa-check-circle text-green': !noPhoenixborn && !isSaving && !isDirty,
          'far fa-exclamation-circle text-orange': !noPhoenixborn && !isSaving && isDirty,
        }"></i>
      </button>
    </div>
    <div v-if="noPhoenixborn" class="py-4 text-center">
      <p class="text-lg">
        <router-link :to="{
          name: 'Cards',
          query: { types: ['phoenixborn'] },
        }">Choose your Phoenixborn</router-link> to get started!
      </p>
      <p class="text-gray">(Don't worry, you can always change your mind.)</p>
    </div>
    <div v-else class="py-4">
      <builder-deck></builder-deck>
    </div>
  </section>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import BuilderDeck from './BuilderDeck.vue'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'Builder',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    BuilderDeck,
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
    isDirty () {
      return this.$store.state.builder.isDirty
    },
    saveAction () {
      if (this.isSaving) return 'Saving...'
      if (this.noPhoenixborn) return 'Phoenixborn required'
      if (this.isDirty) return 'Save your deck'
      return 'Deck is saved!'
    }
  },
  methods: {
    saveDeck () {
      if (this.noPhoenixborn || this.isSaving) return
      this.$store.dispatch('builder/SAVE_DECK').catch(this.handleResponseError)
    },
  },
}
</script>
