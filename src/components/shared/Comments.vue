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
    <div v-else>
      <ol>
        <li v-for="comment of comments" class="parsed-text">
          <div class="flex">
            <span class="flex-grow">
              <player-badge :user="comment.user" class="font-bold"></player-badge>
            </span>
            <span>{{ this.formatCommentDate(comment.modified) }}</span>
          </div>
          <card-codes
            class="px-2 py-1 m-0"
            :content="comment.text"
            :key="comment.id"
            needs-paragraphs
          >
          </card-codes>
        </li>
      </ol>
      <p>(pagination TBD)</p>
    </div>

    <div v-if="isAuthenticated && !loading && !error">
      <h3>Post a comment</h3>

      <div class="flex flex-nowrap mb-4">
        <button class="btn btn-first"
          :class="{active: commentWriteMode}"
          @click="commentWriteMode = true">
          Write
        </button
        ><button class="btn btn-last"
          :class="{active: !commentWriteMode}"
          :disabled="!commentText"
          @click="commentWriteMode = false">
          Preview
        </button>
        <link-alike class="ml-2 py-1" use-color use-underline>
          <i class="fas fa-question-circle"></i>
          Formatting help
        </link-alike>
      </div>

      <!-- TODO: update this to use the standard editing form controls; add old-style card code stuff? Inline help modal? -->
      <div v-if="commentWriteMode">
        <form @submit.prevent="submitComment" class="flex flex-col">
          <text-editor
            placeholder="Enter comment here"
            v-model="commentText"
          >
          </text-editor>
          <p class="text-gray text-sm mb-4 mt-1">Please respect the <router-link to="/policies/">Ashes.live Content Policies</router-link>.</p>
          <button class="btn btn-blue px-2 py-1 mb-4">Publish</button>
        </form>
      </div>
      <div v-else>
        <card-codes
          :content="commentText"
          class="px-2 py-1 m-0 border-2 rounded px-4 py-2 border-inexhaustible-dark bg-inexhaustible"
          needs-paragraphs></card-codes>
      </div>
    </div>
    <div v-else>
      <button class="btn btn-blue px-4 py-1 mb-4" @click="triggerLogin">Log in to comment</button>
    </div>
  </section>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import { getRelativeDateString } from '/src/utils/dates.js'
import { request } from '/src/utils/index.js'
import emitter from '/src/events.js'
import CardCodes from './CardCodes.vue'
import LinkAlike from './LinkAlike.vue'
import TextEditor from './TextEditor.vue'
import PlayerBadge from './PlayerBadge.vue'

export default {
  name: 'Comments',
  props: ['entityId'],
  data: () => ({
    loading: true,
    comments: null,
    commentText: '',
    error: false,
    commentWriteMode: true,
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
    LinkAlike,
    PlayerBadge,
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
  },
  methods: {
    triggerLogin () {
      emitter.emit("login:required")
    }
  }
}
</script>
