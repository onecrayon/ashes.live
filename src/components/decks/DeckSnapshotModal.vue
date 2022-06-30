<template>
  <modal :open="open" @update:open="$emit('update:open', false)">
    <div class="sm:w-96 sm:mx-auto">
      <div v-if="isEditing">
        <h2 class="phg-natural-power">Edit your snapshot</h2>

        <p>You can edit your snapshot's title or description at any time; to change cards or dice, you will need to create a new snapshot.</p>
      </div>
      <div v-else-if="publishSnapshot">
        <h2 class="phg-natural-power">Publish your deck</h2>

        <p>After publishing your deck, you can continue to edit it privately; if you want to share your new edits, just publish it again!</p>
      </div>
      <div v-else>
        <h2 class="phg-natural-power">Save a snapshot</h2>

        <p>Snapshots are private versions of your deck that you can share or simply use to reference past versions of your deck as you continue to refine it.</p>
      </div>

      <form @submit.prevent="saveSnapshot">
        <text-input
          label="Title"
          :placeholder="defaultTitle"
          v-model="title"
          class="mb-4"></text-input>
        <text-editor
          label="Description"
          v-model="description"
          class="mb-4"></text-editor>
        <button class="btn btn-blue px-4 py-1 mb-4" :disabled="isSubmittingRequest" @click="saveSnapshot">
          <span v-if="isEditing">
            Update snapshot!
          </span>
          <span v-else-if="publishSnapshot">
            Publish deck!
          </span>
          <span v-else>
            Save snapshot!
          </span>
        </button>
      </form>
    </div>
  </modal>
</template>

<script>
import { request } from '/src/utils/index.js'
import { deckTitle } from '/src/utils/decks.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import Modal from '../shared/Modal.vue'
import TextEditor from '../shared/TextEditor.vue'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'DeckSnapshotModal',
  props: {
    open: Boolean,
    deck: {
      required: true,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    publishSnapshot: {
      type: Boolean,
      default: false,
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
  emits: ['update:open', 'refresh'],
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
      return deckTitle(this.deck)
    },
    description: {
      get () {
        return this._description !== null ? this._description : this.deck.description
      },
      set (value) {
        this._description = value
      },
    },
  },
  methods: {
    saveSnapshot () {
      if (this.isSubmittingRequest) return
      const data = {}
      if (!this.isEditing) {
        data.is_public = this.publishSnapshot
      }
      if (this._title) {
        data.title = this._title
      }
      if (this._description !== null) {
        data.description = this._description
      }
      this.isSubmittingRequest = true
      const url = this.isEditing ? `/v2/decks/snapshots/${this.deck.id}` : `/v2/decks/${this.deck.id}/snapshot`
      const method = this.isEditing ? 'patch' : 'post'
      request(url, {
        method,
        data,
      }).then((response) => {
        let message
        let destination = null
        if (this.isEditing) {
          message = 'Your snapshot has been updated!'
        } else if (this.publishSnapshot) {
          message = 'Your deck has been published!'
          destination = {
            name: 'DeckDetails',
            params: { id: this.deck.id }
          }
        } else {
          message = 'Your snapshot has been saved!'
          destination = {
            name: 'PrivateDeckDetails',
            params: { id: response.data.snapshot_id }
          }
        }
        this.toast.success(message)
        if (destination === null) this.$emit('refresh')
        this.$emit('update:open', false)
        if (destination !== null) {
          this.$router.push(destination)
        }
      }).catch(error => {
        console.log('failed?', error)
        this.handleResponseError(error)
      }).finally(() => {
        this.isSubmittingRequest = false
      })
    },
  },
  watch: {
    open (newValue) {
      if (!newValue) {
        this.$nextTick(() => {
          this._title = null
          this._description = null
        })
      }
    },
  },
}
</script>
