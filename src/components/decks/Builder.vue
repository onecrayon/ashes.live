<template>
  <section class="pb-4">
    <div class="flex mb-4">
      <h1 class="phg-ceremonial-class m-0 flex-grow">Build your deck</h1>
      <button
        class="text-3xl pl-2 leading-none"
        :class="{'text-blue': showActions}"
        title="Actions..."
        @click="showActions = !showActions"
        :disabled="noPhoenixborn">
        <i class="fas fa-ellipsis-h"></i><span class="alt-text">Actions... <span v-if="showActions">(open)</span></span>
      </button>
    </div>
    <!-- TODO: Animate vertical height animation when I have one coded; maybe use https://github.com/maoberlehner/transition-to-height-auto-with-vue -->
    <!-- Once I have an animation; test closing the actions after clicking one -->
  <div v-if="showActions" class="mb-4 text-right text-sm">
    <button class="btn btn-first" @click="previewDeck">
      <i class="fas fa-eye"></i>
      Preview
    </button>
    <button class="btn btn-last" @click="exportDeck">
      <i class="fas fa-share-square"></i>
      Export...
    </button>
  </div>
  <deck-export-modal v-model:open="showExportModal" :deck="$store.state.builder.deck"></deck-export-modal>
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
    <div v-if="noPhoenixborn" class="pt-4 text-center">
      <p class="text-lg">
        <router-link :to="{
          name: 'Cards',
          query: { types: ['phoenixborn'] },
        }">Choose your Phoenixborn</router-link> to get started!
      </p>
      <p class="text-gray">(Don't worry, you can always change your mind.)</p>
    </div>
    <div v-else>
      <div v-if="!editingDescription">
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
      </div>
      <div v-else class="flex">
        <text-editor
          class="flex-grow mb-4"
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
      <builder-deck></builder-deck>
    </div>
  </section>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import BuilderDeck from './BuilderDeck.vue'
import DeckExportModal from './DeckExportModal.vue'
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
    DeckExportModal,
    TextEditor,
    TextInput,
  },
  data: () => ({
    editingDescription: false,
    showActions: false,
    showExportModal: false,
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
      this.$store.dispatch('builder/SAVE_DECK', true)
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
    previewDeck () {
      this.$router.push({
        name: 'PrivateDeckDetails',
        params: { id: this.deck.id }
      })
    },
    exportDeck () {
      this.showExportModal = true
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
