<template>
  <section id="comments">
    <h2>Comments</h2>

    <div v-if="loading && (!comments || !comments.length)" class="text-gray text-2xl py-8 px-4">
      <i class="fas fa-circle-notch fa-spin"></i> Loading...
    </div>
    <div v-else-if="error" class="text-red bg-red-lightest border border-red my-4 p-2">
      Error loading comments; please notify Skaak on <a href="https://discord.gg/UU5bduq" class="text-red font-bold">Discord</a> or <a href="https://www.boardgamegeek.com/user/Skaak" class="text-red font-bold">BoardGameGeek</a>.
    </div>
    <div v-else-if="comments && !comments.length" class="text-gray mb-4">
      No comments yet!
    </div>
    <div v-else>
      <ol class="comments">
        <li v-for="comment of comments" class="border border-gray mb-4" :id="`comment-${comment.entity_id}`">
          <div v-if="comment.is_deleted" class="bg-gray text-gray-dark font-bold">
            <i class="fas fa-trash"></i>
            <span v-if="comment.is_moderated">Deleted by moderator.</span>
            <span v-else>Deleted by author.</span>
          </div>
          <div v-else>
            <div
              class="flex flex-wrap border-b-2 p-2 text-sm"
              :class="{
                'bg-reaction border-reaction-dark': !lastSeenEntityId || comment.entity_id <= lastSeenEntityId,
                'bg-inexhaustible border-inexhaustible-dark': lastSeenEntityId && comment.entity_id > lastSeenEntityId,
              }">
              <span class="grow">
                <player-badge :user="comment.user" class="font-bold"></player-badge> says:
              </span>
              <a :href="`#comment-${comment.entity_id}`" class="text-gray-dark">
                <time :datetime="comment.created">{{ this.formatCommentDate(comment.created) }} ago</time>&nbsp;<i class="fas fa-link"></i>
              </a>
            </div>
            <!-- The only reason we have a loading state is because otherwise the comment text doesn't update (it isn't possible to be properly reactive) -->
            <div v-if="loading" class="m-2 bg-gray-light opacity-40 h-24"></div>
            <card-codes
              v-else
              class="comment-body px-2 py-1 m-0"
              :content="comment.text"
              needs-paragraphs></card-codes>
          </div>
          <!-- TODO: add link to form for managing the comment -->
        </li>
      </ol>
      <div v-if="comments && comments.length">
        <div class="my-4 text-center">
          Page {{ page }} of {{ totalPages }}
        </div>
        <div v-show="previousUrl || nextUrl" class="my-4 text-center">
          <button v-show="previousUrl" class="btn btn-blue py-2 px-4 mr-4" :disabled="loading" @click="loadComments(previousUrl)">
            Previous
          </button>
          <button  v-show="nextUrl" class="btn btn-blue py-2 px-4" :disabled="loading" @click="loadComments(nextUrl)">
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-if="isAuthenticated && !loading && !error">
      <h3>Post a comment</h3>

      <div class="flex flex-nowrap mb-1">
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
        <link-alike class="ml-2 py-1" use-color use-underline @click="formattingHelpOpen = !formattingHelpOpen">
          <i class="fas fa-question-circle"></i>
          Formatting help
        </link-alike>
        <modal v-model:open="formattingHelpOpen">
          <div class="max-w-xl mx-auto">
            <h2>Comment formatting</h2>

            <card-code-example :text="'**Bold text**'"></card-code-example>
            <card-code-example :text="'*Italic text*'"></card-code-example>
            <card-code-example :text="'[[main]] - 1 [[charm:class]]'"></card-code-example>
            <card-code-example :text="'[[Hammer Knight]]'"></card-code-example>
            <card-code-example :text="'[[Link https://ashteki.com]]'"></card-code-example>
            <card-code-example :text="'[[*https://cdn.ashes.live/images/slices/channel-magic.jpg]]'"></card-code-example>
            <card-code-example :text="'* Unordered item 1\n* Unordered item 2'"></card-code-example>
            <card-code-example :text="'~ Ordered item 1\n~ Ordered item 2'"></card-code-example>
            <card-code-example :text="'> Quoted text'"></card-code-example>
          </div>
        </modal>
      </div>

      <!-- TODO: update this to use the standard editing form controls -->
      <form @submit.prevent="submitComment" class="flex flex-col">
        <text-editor
          placeholder="Enter comment here"
          v-model="commentText"
          v-show="commentWriteMode"
        ></text-editor>
        <div v-if="!commentWriteMode">
          <card-codes
            :content="commentText"
            class="px-2 py-1 m-0 border-2 rounded px-4 py-2 border-inexhaustible-dark bg-inexhaustible"
            needs-paragraphs></card-codes>
        </div>
        <div class="mt-2 md:flex">
          <p class="text-gray text-sm mb-4 mt-0 md:flex-1 md:order-2 md:pt-2 md:text-right">
            Please respect the <router-link to="/policies/">Ashes.live Content Policies</router-link>.
          </p>
          <button class="btn btn-blue py-1 mb-4 w-full md:flex-none md:px-4 md:w-auto" :disabled="!commentText">Publish</button>
        </div>
      </form>
    </div>
    <div v-else>
      <button class="btn btn-blue px-4 py-1 mb-4" @click="triggerLogin">Log in to comment</button>
    </div>
  </section>
</template>

<script>
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import { request } from '/src/utils/index.js'
import emitter from '/src/events.js'
import CardCodes from './CardCodes.vue'
import CardCodeExample from './CardCodeExample.vue'
import LinkAlike from './LinkAlike.vue'
import Modal from './Modal.vue'
import TextEditor from './TextEditor.vue'
import PlayerBadge from './PlayerBadge.vue'

const COMMENTS_PER_PAGE = 30

export default {
  name: 'Comments',
  props: ['entityId', 'lastSeenEntityId'],
  data: () => ({
    loading: true,
    comments: null,
    commentCount: 0,
    page: 1,
    previousUrl: null,
    nextUrl: null,
    commentText: '',
    error: false,
    commentWriteMode: true,
    formattingHelpOpen: false,
  }),
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return {
      ...useHandleResponseError()
    }
  },
  components: {
    CardCodes,
    CardCodeExample,
    LinkAlike,
    Modal,
    PlayerBadge,
    TextEditor,
  },
  created () {
    if (this.$route.query.page) {
      this.page = this.$route.query.page
    }
  },
  beforeMount () {
    this.loadComments()
  },
  watch: {
    '$route.query' (to, from) {
      // Make sure to update our page setting if we navigate here via browser back/forward
      if (to.page !== from.page) {
        this.page = to.page === undefined ? 1 : to.page
      }
    },
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters['player/isAuthenticated']
    },
    totalPages () {
      return Math.ceil(this.commentCount / COMMENTS_PER_PAGE)
    },
  },
  methods: {
    formatCommentDate (timestamp) {
      return formatDistanceToNowStrict(parseISO(timestamp))
    },
    loadComments (url) {
      this.loading = true
      if (!url) {
        const offset = (this.page - 1) * COMMENTS_PER_PAGE
        url = `/v2/comments/${this.entityId}?limit=${COMMENTS_PER_PAGE}&offset=${offset}`
      } else {
        const offset = url.replace(/^.+[?&]offset=(\d+).*$/i, '$1')
        if (offset !== url) {
          this.page = offset ? Math.floor(this.commentCount / offset) + 1 : 1
        } else {
          this.page = 1
        }
      }
      const query = {}
      if (this.page > 1) {
        query.page = this.page
      }
      request(url).then(response => {
        this.loading = false
        // This means they tried to advance to a page beyond what we have results for
        if (response.data.count && !response.data.results.length) {
          this.toast.error("Page number for comments too high!")
          return
        }
        this.comments = response.data.results
        this.commentCount = response.data.count
        this.previousUrl = response.data.previous
        this.nextUrl = response.data.next
        this.$router.push ({
          path: this.$route.path,
          query: query,
        })
      }).catch(error => {
        console.log(error)
        this.error = true
        this.loading = false
        this.comments = null
        this.commentCount = 0
        this.previousUrl = null
        this.nextUrl = null
      })
    },
    triggerLogin () {
      emitter.emit("login:required")
    },
    submitComment () {
      request(`/v2/comments/${this.entityId}`, {
        method: 'post',
        data: { text: this.commentText }
      }).then(() => {
        this.commentText = ""
        this.toast.success("Your comment has been posted!")
        this.loadComments()
      }).catch((error) => {
        this.handleResponseError(error)
      })
    },
  }
}
</script>
