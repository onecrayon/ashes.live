<template>
  <div v-if="error">
    <h1 class="phg-discard">No card found</h1>

    <p class="text-lg">
      Sorry, this does not appear to be a valid card!
      <router-link v-if="showLegacy" :to="{name: 'CardDetails', params: { stub: stub }}">Try the Ashes Reborn version.</router-link>
      <router-link v-else :to="{name: 'CardDetailsLegacy', params: { stub: stub }}">Try the Legacy version.</router-link>
    </p>
  </div>
  <div v-else-if="!card">
    <h1 class="phg-side-action text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else>
    <h1 class="phg-side-action">{{ card.name }}</h1>

    <div class="lg:flex">
      <div class="md:flex md:flex-nowrap lg:w-2/3">
        <div class="md:flex-none md:mr-8 mb-8">
          <deck-qty-buttons :card="card" class="mb-4" standalone></deck-qty-buttons>
          <img
            class="bg-gray-light"
            :class="[!showLegacy ? 'rounded-lg shadow-lg' : '']"
            :src="imageURL"
            alt=""
            :width="showLegacy ? 332 : 300"
            :height="showLegacy ? 452 : 420">
        </div>
        <div class="md:flex-grow">
          <h2>Card text</h2>

          <h3 class="mb-0">
            {{ card.name }}
            <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
              ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
            </span>
            <span v-if="card.release.is_phg === false" class="text-gray pl-1">†</span>
          </h3>

          <p class="mt-0 mb-2 text-sm">
            {{ card.type }}
            <span v-if="card.placement">
              <span class="divider"><span class="alt-text">-</span></span>
              {{ card.placement }}
            </span>
          </p>

          <card-costs class="mb-4" :costs="card.cost" is-horizontal></card-costs>

          <div v-if="isPhoenixborn" class="my-2">
            <strong
              v-if="card.battlefield !== undefined"
              class="inline-block border border-red-light px-1">Battlefield {{ card.battlefield }}</strong>
            <strong
              v-if="card.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life {{ card.life }}</strong>
            <strong
              v-if="card.spellboard !== undefined"
              class="inline-block border border-blue-dark px-1">Spellboard {{ card.spellboard }}</strong>
          </div>
          <div v-if="card.text">
            <hr v-if="!isPhoenixborn" class="my-4 border-gray-light">
            <div class="leading-snug text-sm">
              <card-codes
                :content="card.text"
                :is-legacy="showLegacy"
                is-card-effect></card-codes>
            </div>
          </div>
          <div v-if="hasStats && !isPhoenixborn" class="my-2">
            <!-- Placeholders ensure that our stats are always in about the same locations -->
            <span
              v-if="card.copies !== undefined"
              class="inline-block border border-gray-dark px-1 mr-1">{{ card.copies }}</span>

            <strong
              v-if="card.attack !== undefined"
              class="inline-block border border-red-light px-1">Attack {{ card.attack }}</strong>
            <span v-else class="inline-block invisible">Attack --</span>

            <strong
              v-if="card.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life {{ card.life }}</strong>
            <span v-else class="inline-block invisible mx-1">Life --</span>

            <strong
              v-if="card.recover !== undefined"
              class="inline-block border border-blue-dark px-1">Recover {{ card.recover }}</strong>
            <span v-else class="inline-block invisible">Recover --</span>
          </div>
        </div>
      </div>
      <div class="lg:w-1/3 lg:pl-8">
        <hr class="my-4 border-gray-light lg:hidden">

        <h2>Card stats</h2>

        <table class="border-collapse table-auto mb-4" cellspacing="0" cellpadding="0">
          <tbody>
            <card-meta-row v-if="card.dice && card.dice.length && !(card.dice.length === 1 && card.dice[0] === 'basic')" aria-label="Dice"
              label="Needs:">
              <span v-for="(dieType, index) of card.dice" :key="dieType" :class="`phg-${dieType}-power`" :title="`${capitalize(dieType)} Magic`">
                <span class="alt-text">{{ capitalize(dieType) }} Magic</span>
                <span v-if="index < card.dice.length - 1" class="divider mr-1"><span class="alt-text">, </span></span>
              </span>
            </card-meta-row>
            <card-meta-row label="Usage:">
              <strong>{{ usage.users }} user<span v-if="usage.users != 1">s</span></strong> <span v-if="usage.users != 1">have</span><span v-else>has</span> this card in <strong>{{ usage.decks }} deck<span v-if="usage.decks != 1">s</span></strong>
            </card-meta-row>
            <card-meta-row label="Release:">
              <router-link v-if="preconstructedDeck && preconstructedDeck.title == card.release.name" :to="{'name': 'DeckDetails', params: { id: preconstructedDeck.id }}">{{ card.release.name }}</router-link>
              <span v-else>{{ card.release.name }}</span>
            </card-meta-row>
            <card-meta-row v-if="preconstructedDeck && preconstructedDeck.title != card.release.name"
              label="Deck:">
              <router-link :to="{'name': 'DeckDetails', params: { id: preconstructedDeck.id }}">{{ preconstructedDeck.title }}</router-link>
            </card-meta-row>
          </tbody>
        </table>
        <div v-if="phoenixborn || (relatedConjurations && relatedConjurations.length)">
          <h3>Related cards</h3>

          <ul class="list-disc pl-4">
            <card-related-cards v-if="relatedSummons" :card="card" :summons="relatedSummons" :conjurations="relatedConjurations" :show-legacy="showLegacy"></card-related-cards>
            <card-related-cards v-if="phoenixborn" :card="card" :summons="phoenixborn" :conjurations="phoenixbornConjurations" :show-legacy="showLegacy"></card-related-cards>
            <card-related-cards v-if="phoenixbornUnique" :card="card" :summons="phoenixbornUnique" :conjurations="phoenixbornUniqueConjurations" :show-legacy="showLegacy"></card-related-cards>
          </ul>
        </div>
        <card-usage :stub="stub"></card-usage>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '/src/utils/index.js'
import { capitalize } from '/src/utils/text.js'
import CardCodes from '../shared/CardCodes.vue'
import CardCosts from '../shared/CardCosts.vue'
import DeckQtyButtons from '../shared/DeckQtyButtons.vue'
import CardMetaRow from './CardMetaRow.vue'
import CardRelatedCards from './CardRelatedCards.vue'
import CardUsage from './CardUsage.vue'

export default {
  name: 'CardDetails',
  props: ['stub'],
  components: {
    CardCodes,
    CardCosts,
    CardMetaRow,
    CardRelatedCards,
    DeckQtyButtons,
    CardUsage,
  },
  data: () => ({
    card: null,
    usage: null,
    preconstructedDeck: null,
    relatedSummons: null,
    relatedConjurations: null,
    phoenixborn: null,
    phoenixbornConjurations: null,
    phoenixbornUnique: null,
    phoenixbornUniqueConjurations: null,
    error: false,
  }),
  beforeMount () {
    request(`/v2/cards/${this.stub}/details${this.showLegacy ? '?show_legacy=true' : ''}`).then(response => {
      this.card = response.data.card
      this.usage = response.data.usage
      this.preconstructedDeck = response.data.preconstructed_deck
      if (response.data.related_cards.phoenixborn !== undefined) {
        this.phoenixborn = response.data.related_cards.phoenixborn
        this.phoenixbornConjurations = response.data.related_cards.phoenixborn_conjurations
        this.phoenixbornUnique = response.data.related_cards.phoenixborn_unique
        this.phoenixbornUniqueConjurations = response.data.related_cards.phoenixborn_unique_conjurations
      } else if (response.data.related_cards.summoning_cards !== undefined) {
        this.relatedSummons = response.data.related_cards.summoning_cards
        this.relatedConjurations = response.data.related_cards.conjurations
      }
      // And set the site title
      document.title = `${this.card.name} - Ashes.live`
    }).catch(error => {
      this.error = true
    })
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    },
    imageURL () {
      if (!this.card) return ''
      if (this.showLegacy) return `${import.meta.env.VITE_CDN_URL}/legacy/images/cards/${this.stub}.jpg`
      return `${import.meta.env.VITE_CDN_URL}/images/cards/${this.stub}.jpg`
    },
    isPhoenixborn () {
      return this.card.type === 'Phoenixborn'
    },
    hasStats () {
      // This covers Phoenixborn, too, because they always have a life value
      return (
        this.card.attack !== undefined
        || this.card.life !== undefined
        || this.card.recover !== undefined
        || this.card.copies !== undefined
      )
    },
  },
  methods: {
    capitalize,
  },
}
</script>
