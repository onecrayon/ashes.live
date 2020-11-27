<template>
  <div v-if="error">
    <h1 class="phg-discard">No card found</h1>

    <p class="text-lg">
      Sorry, this does not appear to be a valid card!
      <router-link v-if="showLegacy" :to="{name: 'CardDetails', params: { stub: stub }}">Try the Ashes Reborn version.</router-link>
      <router-link v-else :to="{name: 'CardDetailsLegacy', params: { stub: stub }}">Try the Legacy version.</router-link>
    </p>
  </div>
  <div v-else-if="!details">
    <h1 class="phg-side-action text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else>
    <h1 class="phg-side-action">{{ details.name }}</h1>

    <div class="md:flex md:flex-no-wrap">
      <div class="md:flex-none md:mr-8 mb-8">
        <img
          class="bg-gray-light"
          :class="[!showLegacy ? 'rounded-lg shadow-lg' : '']"
          :src="imageURL"
          alt=""
          width="300"
          height="420">
      </div>
      <div class="md:flex-grow">
        <h2 class="mt-6">Card text</h2>

        <h3 class="mb-0">
          {{ details.name }}
          <span v-if="details.phoenixborn" class="text-gray" :title="details.phoenixborn">
            ({{ details.phoenixborn.split(/,?[ ]/)[0] }})
          </span>
          <span v-if="details.release.is_phg === false" class="text-gray pl-1">†</span>
        </h3>

        <p class="mt-0 mb-2 text-sm">
          {{ details.type }}
          <span v-if="details.placement">
            <span class="divider"><span class="alt-text">-</span></span>
            {{ details.placement }}
          </span>
        </p>

        <card-costs class="mb-4" :costs="details.cost" is-horizontal></card-costs>

        <div v-if="isPhoenixborn" class="my-2">
          <strong
            v-if="details.battlefield !== undefined"
            class="inline-block border border-red-light px-1">Battlefield {{ details.battlefield }}</strong>
          <strong
            v-if="details.life !== undefined"
            class="inline-block border border-green-light px-1 mx-1">Life {{ details.life }}</strong>
          <strong
            v-if="details.spellboard !== undefined"
            class="inline-block border border-blue-dark px-1">Spellboard {{ details.spellboard }}</strong>
        </div>
        <div v-if="details.text">
          <hr v-if="!isPhoenixborn" class="my-4 border-gray-light">
          <div class="leading-snug text-sm">
            <card-codes
              :content="details.text"
              is-card-effect></card-codes>
          </div>
        </div>
        <div v-if="hasStats && !isPhoenixborn" class="my-2">
          <!-- Placeholders ensure that our stats are always in about the same locations -->
          <span
            v-if="details.copies !== undefined"
            class="inline-block border border-gray-dark px-1 mr-1">{{ details.copies }}</span>

          <strong
            v-if="details.attack !== undefined"
            class="inline-block border border-red-light px-1">Attack {{ details.attack }}</strong>
          <span v-else class="inline-block invisible">Attack --</span>

          <strong
            v-if="details.life !== undefined"
            class="inline-block border border-green-light px-1 mx-1">Life {{ details.life }}</strong>
          <span v-else class="inline-block invisible mx-1">Life --</span>

          <strong
            v-if="details.recover !== undefined"
            class="inline-block border border-blue-dark px-1">Recover {{ details.recover }}</strong>
          <span v-else class="inline-block invisible">Recover --</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '/src/utils.js'
import CardCodes from '../shared/CardCodes.vue'
import CardCosts from '../shared/CardCosts.vue'

export default {
  name: 'CardDetails',
  props: ['stub'],
  components: {
    CardCodes,
    CardCosts,
  },
  data () {
    return {
      details: null,
      error: false,
    }
  },
  beforeMount () {
    request(`/v2/cards/${this.stub}${this.showLegacy ? '?show_legacy=true' : ''}`).then(response => {
      this.details = response.data
      // And set the site title
      document.title = `${this.details.name} - Ashes.live`
    }).catch(error => {
      this.error = true
    })
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    },
    imageURL () {
      if (!this.details) return ''
      if (this.showLegacy) return `${import.meta.env.VITE_CDN_URL}/legacy/images/cards/${this.stub}.jpg`
      return `${import.meta.env.VITE_CDN_URL}/images/cards/${this.stub}.jpg`
    },
    isPhoenixborn () {
      return this.details.type === 'Phoenixborn'
    },
    hasStats () {
      // This covers Phoenixborn, too, because they always have a life value
      return (
        this.details.attack !== undefined
        || this.details.life !== undefined
        || this.details.recover !== undefined
        || this.details.copies !== undefined
      )
    },
  },
}
</script>
