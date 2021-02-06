<template>
  <h1 class="phg-illusion-class">
    <player-badge :user="user" no-link></player-badge> account settings
  </h1>

  <div class="sm:flex">
    <div class="sm:w-80 sm:order-2 sm:pl-8 mb-8">
      <div class="flex flex-col">
        <!-- TODO: implement the change password modal and logic -->
        <!--<button
          class="btn btn-green px-4 py-1 mb-4"
          @click="passwordModal = true">
          <i class="fas fa-lock-alt text-lg"></i>
          Change password
        </button>-->
        <router-link
          class="btn px-4 py-1 mb-4 hover:no-underline"
          :to="{name: 'PlayerPublicProfile', params: {badge: user.badge}}">
          <i class="fas fa-user-circle text-lg"></i>
          Public profile
        </router-link>
      </div>
    </div>
    <div class="sm:flex-grow sm:order-1">
      <form @submit.prevent="submitAccountSettings" class="flex flex-col">
        <text-input
          class="mb-4 sm:w-80"
          placeholder="Username"
          label="Username"
          v-model="username"
          :disabled="isSubmitting"></text-input>
        <text-editor
          class="mb-4"
          placeholder="Player profile..."
          label="Description"
          v-model="description"
          :disabled="isSubmitting"></text-editor>

        <h2>Notification Settings</h2>

        <div class="mb-4">
          <label><input type="checkbox" v-model="newsletterOptIn" :disabled="isSubmitting"> Notify me of new site features</label>
          <div class="text-sm text-gray-darker">
            Emails are rare, and only focused on major new features or improvements.
          </div>
        </div>
        <div class="mb-4">
          <label><input type="checkbox" v-model="emailSubscriptions" :disabled="isSubmitting"> Email me subscription notifications</label>
          <div class="text-sm text-gray-darker">
            Subscription notifications are emailed whenever a new comment is posted on your subscribed content.
          </div>
        </div>
        <div class="mb-4">
          <label><input type="checkbox" v-model="excludeSubscriptions" :disabled="isSubmitting"> Exclude subscribed comments from homepage</label>
          <div class="text-sm text-gray-darker">
            If you use the <i class="far fa-arrow-circle-right text-base" title="Next Unread Subscription"></i> button, excluding subscribed comments will make the homepage more useful.
          </div>
        </div>

        <h2>Site Settings</h2>

        <div class="mb-8">
          <label><input type="checkbox" v-model="colorizeIcons" :disabled="isSubmitting"> Use colored cost icons</label>
          <div class="text-sm text-gray-darker">
            Colored cost icons are easier to distinguish at a glance, but more visually intrusive.
          </div>
        </div>

        <button class="btn btn-blue px-4 py-1 mb-4 sm:w-80" :disabled="isSubmitting">Save settings</button>
      </form>
    </div>
  </div>
</template>

<script>
import useHandleResponseError from '/src/composites/useHandleResponseError.js'
import PlayerBadge from '../shared/PlayerBadge.vue'
import TextEditor from '../shared/TextEditor.vue'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'PlayerAccount',
  components: {
    PlayerBadge,
    TextEditor,
    TextInput,
  },
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    passwordModal: false,
    username: '',
    description: '',
    newsletterOptIn: false,
    emailSubscriptions: false,
    excludeSubscriptions: false,
    colorizeIcons: false,
    isSubmitting: false,
  }),
  async beforeMount () {
    await this.$store.dispatch('player/loadProfile').then(user => {
      this.username = user.username
      this.description = user.description
      this.newsletterOptIn = user.newsletter_opt_in
      this.emailSubscriptions = user.email_subscriptions
      this.excludeSubscriptions = user.exclude_subscriptions
      this.colorizeIcons = user.colorize_icons
    }).catch(() => {
      this.toast.error('Unable to load account settings; please report this!')
      this.$router.go(-1)
    })
  },
  computed: {
    user () {
      return this.$store.getters['player/user']
    },
  },
  methods: {
    submitAccountSettings () {
      this.isSubmitting = true
      this.$store.dispatch('player/saveProfile', {
        username: this.username,
        description: this.description,
        newsletter_opt_in: this.newsletterOptIn,
        email_subscriptions: this.emailSubscriptions,
        exclude_subscriptions: this.excludeSubscriptions,
        colorize_icons: this.colorizeIcons,
      }).then(() => {
        this.toast.success('Account settings saved!')
      }).catch(this.handleResponseError).finally(() => {
        this.isSubmitting = false
      })
    },
  },
}
</script>
