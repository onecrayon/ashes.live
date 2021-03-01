<template>
  <section class="pb-4">
    <h1 class="phg-ceremonial-class">Build your deck</h1>

    <div class="flex mb-2">
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
    <div class="relative">
      <transition name="fade-swap">
        <div v-if="noPhoenixborn" class="pt-4 text-center">
          <p class="text-lg">
            <router-link :to="{
              name: 'Cards',
              query: { types: ['phoenixborn'] },
            }">Choose your Phoenixborn</router-link> to get started!
          </p>
          <p class="text-gray">(Don't worry, you can always change your mind.)</p>
        </div>
        <div v-else-if="!editingDescription">
          <div class="mb-2 flex">
            <p class="m-0 text-sm pt-2.5 text-gray" :class="$style.truncatedFlex">
              <span v-if="description">{{ description }}</span>
              <em v-else>No description yet...</em>
            </p>
            <button class="text-3xl text-blue pl-2" title="Edit description..." @click="openDescriptionEditor">
              <i class="far fa-pen-square"></i>
              <span class="alt-text">Edit description...</span>
            </button>
          </div>
          <builder-deck></builder-deck>
        </div>
        <div v-else class="flex">
          <text-editor
            class="flex-grow"
            v-model="description"
            placeholder="Deck description..."
            @blur="saveDeck"
            ref="description"></text-editor>
          <div class="pl-2.5">
            <button class="text-3xl text-blue" title="Done editing description" @click="closeDescriptionEditor">
              <i class="far fa-check-square"></i>
              <span class="alt-text">Done editing description</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import BuilderDeck from './BuilderDeck.vue'
import TextEditor from '../shared/TextEditor.vue'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'Builder',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    BuilderDeck,
    TextEditor,
    TextInput,
  },
  data: () => ({
    editingDescription: false,
  }),
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
    description: {
      get () {
        return this.$store.state.builder.deck.description
      },
      set (value) {
        this.$store.commit('builder/setDescription', value)
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
    openDescriptionEditor () {
      this.editingDescription = true
      this.$nextTick(() => {
        this.$refs.description.focus()
      })
    },
    closeDescriptionEditor () {
      this.editingDescription = false
      this.saveDeck()
    },
  },
}
</script>

<style lang="postcss" module>
.truncatedFlex {
  /* Fun fact: flex-basis of 0% (which is what flex-1 provides in TailwindCSS) breaks single line
     text truncating because it's treated as not having a width. This fixes the issue */
  flex: 1 1 0px;
  @apply truncate;
}
</style>
