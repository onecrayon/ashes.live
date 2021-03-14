<template>
  <modal :open="open" @update:open="$emit('update:open', false)">
    <div class="sm:w-96 sm:mx-auto">
      <h2 class="phg-natural-power">Publish your deck</h2>

      <p>After publishing your deck, you can continue to edit it privately; if you want to share your new edits, just publish it again!</p>

      <form @submit.prevent="publishDeck">
        <text-input
          label="Title"
          :placeholder="defaultTitle"
          v-model="title"
          class="mb-4"></text-input>
        <text-editor
          label="Description"
          :placeholder="defaultDescription"
          v-model="description"
          class="mb-4"
          @focus="description = ''"></text-editor>
        <button class="btn btn-blue px-4 py-1 mb-4" :disabled="isSubmittingRequest" @click="publishDeck">Publish deck!</button>
      </form>
    </div>
  </modal>
</template>

<script>
import { request } from '/src/utils/index.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import Modal from '../shared/Modal.vue'
import TextEditor from '../shared/TextEditor.vue'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'DeckPublishModal',
  props: {
    open: Boolean,
    deck: {
      required: true,
    },
  },
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    _title: null,
    _description: null,
    isSubmittingRequest: false,
  }),
  emits: ['update:open'],
  components: {
    Modal,
    TextEditor,
    TextInput,
  },
  computed: {
    title: {
      get () {
        return this._title || ''
      },
      set (value) {
        this._title = value
      },
    },
    defaultTitle () {
      return this.deck.title || `Untitled ${this.deck.phoenixborn.name}`
    },
    description: {
      get () {
        return this._description || ''
      },
      set (value) {
        this._description = value
      },
    },
    defaultDescription () {
      return this.deck.description
    },
  },
  methods: {
    publishDeck () {
      if (this.isSubmittingRequest) return
      const data = {
        is_public: true,
      }
      if (this._title) {
        data.title = this._title
      }
      if (this._description !== null) {
        data.description = this._description
      }
      this.isSubmittingRequest = true
      request(`/v2/decks/${this.deck.id}/snapshot`, {
        method: 'post',
        data: data,
      }).then(() => {
        this.toast.success('Your deck has been published!')
        this.$emit('update:open', false)
        this.$router.push({
          name: 'DeckDetails',
          params: { id: this.deck.id }
        })
      }).catch(error => {
        this.handleResponseError(error)
      }).finally(() => {
        this.isSubmittingRequest = false
      })
    },
  },
}
</script>
