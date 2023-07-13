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
        {{ comment.text }}
      </li>
    </ol>
  </section>
</template>

<script>
import { request } from '/src/utils/index.js'

export default {
  name: 'Comments',
  props: ['entityId'],
  data: () => ({
    loading: true,
    comments: null,
    error: false,
  }),
  beforeMount () {
    request(`/v2/comments/${this.entityId}`).then(response => {
      this.comments = response.data.results
      this.loading = false
    }).catch(error => {
      this.error = true
      this.loading = false
    })
  }
}
</script>
