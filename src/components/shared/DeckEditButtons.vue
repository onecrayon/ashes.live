<template>
  <button
    class="btn px-2"
    :class="{
      'active': isCurrentlyEditing,
      'btn-first': !standaloneButtons,
      'py-1 w-full mb-2': standaloneButtons,
    }"
    :disabled="isCurrentlyEditing"
    @click="editThisDeck()">
    <i class="fas fa-edit mr-1"></i>
    <span v-if="isCurrentlyEditing">Editing</span>
    <span v-else>Edit</span>
  </button>
  <button
    class="btn transition-colors duration-300 ease-in-out"
    :class="{
      'btn-red': deleting,
      'btn-last': !standaloneButtons,
      'py-1 w-full mb-4': standaloneButtons,
    }"
    @click="deleteThisDeck()">
    <i class="far fa-trash-alt mr-1"></i>
    <transition name="slide-vertical">
      <span v-if="deleting">Confirm?</span>
      <span v-else>Delete</span>
    </transition>
  </button>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'

export default {
  name: 'DeckEditButtons',
  props: {
    id: {
      required: true,
      type: Number,
    },
    title: {
      required: true,
      type: String,
    },
    standaloneButtons: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['deleted'],
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    deleting: false,
    deleteTimeout: null,
  }),
  computed: {
    isCurrentlyEditing () {
      return this.$store.state.builder.deck.id === this.id
    },
  },
  methods: {
    editThisDeck () {
      this.$store.dispatch('builder/editDeck', this.id).catch(this.handleResponseError)
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
        this.$store.dispatch('builder/deleteDeck', this.id).then(() => {
          this.toast.success(`Your deck "${this.title}" has been deleted!`)
          this.$emit('deleted')
        }).catch(this.handleResponseError)
      }
    },
  },
}
</script>
