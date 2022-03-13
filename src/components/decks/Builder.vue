<template>
  <section
    class="
      transition-transform duration-300 ease-in-out
      fixed top-0 right-0 bottom-0 bg-white shadow-md p-8
      xl:static xl:inset-auto xl:p-0 xl:pb-4 xl:pl-8 xl:w-1/3 xl:shadow-none"
    :class="{
      'overflow-y-auto': paneOpen,
      'transform translate-x-full shadow-none overflow-visible xl:transform-none': !paneOpen,
    }">
    <div class="flex mb-4">
      <button
        class="xl:hidden text-xl py-2 w-10 bg-white"
        :class="{
          'absolute top-32 md:top-24 -left-10 shadow-md': !paneOpen,
        }"
        @click="paneOpen = !paneOpen"
        title="Toggle pane"
        ref="toggleButton">
        <i class="fas" :class="{'fa-chevron-double-right': paneOpen, 'fa-chevron-double-left': !paneOpen}"></i>
        <span class="alt-text">Toggle pane</span>
      </button>
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
    <!-- Once I have an animation; test closing the actions after clicking one -->
    <transition-height>
      <div v-if="showActions" class="text-right text-sm">
        <button class="btn btn-first" @click="previewDeck">
          <i class="fas fa-eye"></i>
          Preview
        </button>
        <button class="btn btn-inner" @click="exportDeck">
          <i class="fas fa-share-square"></i>
          Share...
        </button>
        <button class="btn btn-last mb-4 btn-green" @click="publishDeck" :disabled="invalidDeck">
          <i class="far fa-plus-square"></i>
          Publish...
        </button>
      </div>
    </transition-height>
    <deck-export-modal v-model:open="showExportModal" :deck="$store.state.builder.deck"></deck-export-modal>
    <deck-publish-modal v-model:open="showPublishModal" :deck="$store.state.builder.deck"></deck-publish-modal>
    <div class="flex mb-2">
      <text-input
        class="flex-grow"
        v-model="title"
        :placeholder="placeholderTitle"
        :disabled="noPhoenixborn"
        @blur="saveDeck()"
        @enter="saveDeck(true)"></text-input>
      <button class="flex-none text-3xl pl-2" @click="saveDeck(true)" :disabled="noPhoenixborn" :title="saveAction">
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
        <link-alike @click="choosePhoenixborn" use-underline use-color>Choose your Phoenixborn</link-alike> to get started!
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
          @blur="saveDeck()"
          ref="description"></text-editor>
        <div class="pl-2.5">
          <button class="text-3xl text-blue" title="Done editing description" @click="closeDescriptionEditor">
            <i class="far fa-check-square"></i>
            <span class="alt-text">Done editing description</span>
          </button>
        </div>
      </div>
      <builder-deck class="pb-16 xl:pb-0" @close-pane="paneOpen = false"></builder-deck>
    </div>
  </section>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import BuilderDeck from './BuilderDeck.vue'
import DeckExportModal from './DeckExportModal.vue'
import DeckPublishModal from './DeckPublishModal.vue'
import LinkAlike from '../shared/LinkAlike.vue'
import TextEditor from '../shared/TextEditor.vue'
import TextInput from '../shared/TextInput.vue'
import TransitionHeight from '../shared/TransitionHeight.vue'

export default {
  name: 'Builder',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    BuilderDeck,
    DeckExportModal,
    DeckPublishModal,
    LinkAlike,
    TextEditor,
    TextInput,
    TransitionHeight,
  },
  mounted () {
    this.toggleBodyScroll(true)
  },
  data: () => ({
    editingDescription: false,
    showActions: false,
    showExportModal: false,
    showPublishModal: false,
    // Tracks whether the deckbuilder pane is open on small screens
    paneOpen: true,
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
        this.$store.commit('builder/setIsDirty', true)
        this.$store.commit('builder/setTitle', value)
      },
    },
    description: {
      get () {
        return this.$store.state.builder.deck.description
      },
      set (value) {
        this.$store.commit('builder/setIsDirty', true)
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
    },
    invalidDeck () {
      return this.$store.getters['builder/totalDice'] !== 10 || this.$store.getters['builder/totalCards'] !== 30 || this.$store.state.builder.isDirty || this.$store.state.builder.isSaving
    },
  },
  methods: {
    choosePhoenixborn () {
      this.$router.push({
        name: 'Cards',
        query: { types: ['phoenixborn'] },
      })
      this.paneOpen = false
    },
    saveDeck (forceSave = false) {
      if (this.noPhoenixborn || this.isSaving) return
      this.$store.dispatch('builder/SAVE_DECK', { forceSave })
    },
    openDescriptionEditor () {
      this.editingDescription = true
      this.$nextTick(() => {
        this.$refs.description.focus()
      })
    },
    closeDescriptionEditor () {
      this.editingDescription = false
      this.saveDeck(true)
    },
    previewDeck () {
      this.$router.push({
        name: 'PrivateDeckDetails',
        params: { id: this.deck.id }
      })
      this.showActions = false
      this.paneOpen = false
    },
    exportDeck () {
      this.showExportModal = true
      this.showActions = false
    },
    toggleBodyScroll (paneOpen) {
      // We need to disable scrolling on the body when on mobile
      // Always restore scrolling when turning it off, just to be safe
      const styles = window.getComputedStyle(this.$refs.toggleButton)
      if (styles.display === 'none') return
      if (!paneOpen) {
        document.body.style.overflow = 'auto'
      } else {
        // The toggle button is only shown at screen sizes where the pan actually toggles
        document.body.style.overflow = 'hidden'
      }
    },
    publishDeck () {
      this.showPublishModal = true
      this.showActions = false
    },
  },
  watch: {
    paneOpen (value) {
      this.toggleBodyScroll(value)
    },
  }
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
