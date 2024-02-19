<template>
  <section id="comments">
    <h2>Comments</h2>

    <div v-if="loading" class="text-gray text-2xl py-8 px-4">
      <i class="fas fa-circle-notch fa-spin"></i> Loading...
    </div>
    <div v-else-if="error" class="text-red bg-red-lightest border border-red my-4 p-2">
      Error loading comments; please notify Skaak on <a href="https://discord.gg/UU5bduq" class="text-red font-bold">Discord</a> or <a href="https://www.boardgamegeek.com/user/Skaak" class="text-red font-bold">BoardGameGeek</a>.
    </div>
    <div v-else-if="comments && !comments.length" class="text-gray mb-4">
      No comments yet!
    </div>
    <ol v-else>
      <li v-for="comment of comments">
        <hr class="my-4 border-gray-light">
        <div class="flex">
          <span class="font-bold flex-grow">{{ comment.user.username }}</span>
          <span>{{ this.formatCommentDate(comment.modified) }}</span>
        </div>
        <card-codes
          class="px-2 py-1 m-0"
          :content="comment.text"
          :key="comment.id"
          needs-paragraphs
        >
        </card-codes>
        <hr class="my-4 border-gray-light">

      </li>
    </ol>

    <div v-if="isAuthenticated">
      <form @submit.prevent="submitComment" class="flex flex-col">
        <text-editor
          placeholder="Enter comment here"
          v-model="commentText"
        >
        </text-editor>
        <button class="btn btn-blue px-2 py-1 mb-4">Submit</button>
      </form>
    </div>
    <div v-else class="text-gray text-2xl py-4 px-4">
      Sign in to comment!
    </div>
  </section>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import { getRelativeDateString } from '/src/utils/dates.js'
import { request } from '/src/utils/index.js'
import CardCodes from './CardCodes.vue'
import TextEditor from './TextEditor.vue'

export default {
  name: 'Comments',
  props: ['entityId'],
  data: () => ({
    loading: true,
    comments: null,
    commentText: '',
    error: false,
  }),
  setup () {
    const formatCommentDate = (timestamp) => {
      return getRelativeDateString(timestamp)
    }
    // Standard composite containing { toast, handleResponseError }
    return {
      formatCommentDate,
      ...useHandleResponseError()
    }
  },
  components: {
    CardCodes,
    TextEditor,
  },
  beforeMount () {
    request(`/v2/comments/${this.entityId}`).then(response => {
      this.comments = response.data.results
      this.loading = false
    }).catch(error => {
      this.error = true
      this.loading = false
    })
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters['player/isAuthenticated']
    },
    submitComment () {
      request(`v2/comments/${this.entityId}`, {
        method: 'post',
        data: {text: this.commentText }
      }).then(() => {
        this.$router.go()  // Refresh current page
      }).catch((error) => {
        this.handleResponseError(error)
        this.error = true
      })
    },
  }
}
</script>
