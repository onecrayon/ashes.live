<template>
  <button
    v-if="!deck.is_public"
    class="btn px-2"
    :class="{
      'active': isCurrentlyEditing,
      'btn-first': !standaloneButtons,
      'py-1 w-full mb-2': standaloneButtons,
    }"
    :disabled="isCurrentlyEditing || isTalkingToServer"
    @click="editThisDeck()">
    <i class="fas fa-edit mr-1"></i>
    <span v-if="isCurrentlyEditing">Editing</span>
    <span v-else>Edit</span>
  </button>
  <button
    v-if="deck.is_snapshot && (standaloneButtons || deck.is_public)"
    class="btn px-2"
    :class="{
      'btn-first': !standaloneButtons,
      'py-1 w-full mb-2': standaloneButtons,
    }"
    @click="showSnapshotModal = true">
    <i class="far fa-pen-square mr-1"></i>
    Edit Snapshot...
  </button>
  <button
    v-if="deck.is_snapshot && standaloneButtons"
    class="btn px-2"
    :class="{
      'py-1 w-full mb-2': standaloneButtons,
    }" @click="$router.push(`/decks/mine/${deck.source_id}/`)">
    <i class="far fa-clock"></i>
    View Latest Save
  </button>
  <button
    class="btn transition-colors duration-300 ease-in-out"
    :class="{
      'btn-red': deleting,
      'btn-last': !standaloneButtons,
      'py-1 w-full mb-4': standaloneButtons,
    }"
    @click="deleteThisDeck()"
    :disabled="isTalkingToServer">
    <i class="far fa-trash-alt mr-1"></i>
    <transition name="slide-vertical">
      <span v-if="deleting">Confirm?</span>
      <span v-else>Delete</span>
    </transition>
  </button>
  <deck-snapshot-modal v-model:open="showSnapshotModal" :deck="this.deck" is-editing @refresh="$emit('refresh')"></deck-snapshot-modal>
</template>

<script>
import { deckTitle } from '/src/utils/decks.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import DeckSnapshotModal from '../decks/DeckSnapshotModal.vue'

export default {
  name: 'DeckEditButtons',
  props: {
    deck: {
      required: true,
    },
    standaloneButtons: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DeckSnapshotModal,
  },
  emits: ['deleted', 'refresh'],
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    deleting: false,
    deleteTimeout: null,
    isTalkingToServer: false,
    showSnapshotModal: false,
  }),
  computed: {
    isCurrentlyEditing () {
      const editingId = this.$store.state.builder.deck.id
      if (!editingId) return false
      return editingId === this.deck.id || (this.deck.is_snapshot && editingId === this.deck.source_id)
    },
    title () {
      return deckTitle(this.deck)
    },
  },
  methods: {
    editThisDeck () {
      this.isTalkingToServer = true
      this.$store.dispatch('builder/editDeck', this.deck.id).catch(this.handleResponseError).finally(() => {
        this.isTalkingToServer = false
      })
    },
    deleteThisDeck () {
      if (!this.deleting) {
        this.deleting = true
        this.deleteTimeout = setTimeout(() => {
          this.deleting = false
        }, 3000)
      } else {
        if (this.deleteTimeout) {
          clearTimeout(this.deleteTimeout)
        }
        this.isTalkingToServer = true
        this.$store.dispatch('builder/deleteDeck', this.deck.id).then(() => {
          this.toast.success(`Your ${!!this.deck.is_snapshot ? "snapshot" : "deck"} "${this.title}" has been deleted!`)
          this.$emit('deleted')
        }).catch(this.handleResponseError).finally(() => {
          this.isTalkingToServer = false
        })
      }
    },
  },
}
</script>
