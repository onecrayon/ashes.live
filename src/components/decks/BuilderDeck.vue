<template>
  <div>
    <h2 class="text-lg mb-2 font-bold">
      <i :class="typeClass('Phoenixborn')"></i>
      {{ phoenixborn.name }}
    </h2>
    <div class="mb-4 text-sm">
      <div v-if="phoenixbornCard" class="text-center -mb-2.5">
        <span
          class="inline-block border border-red-light px-1 bg-white">Battlefield <strong>{{ phoenixbornCard.battlefield }}</strong></span>
        <span
          class="inline-block border border-green-light px-1 mx-1 bg-white">Life <strong>{{ phoenixbornCard.life }}</strong></span>
        <span
          class="inline-block border border-blue-dark px-1 bg-white">Spellboard <strong>{{ phoenixbornCard.spellboard }}</strong></span>
      </div>
      <!-- Setting a key ensures that this updates when the Phoenixborn card updates (not reactive otherwise, thanks to our setup-based compilation) -->
      <card-codes
        v-if="phoenixbornCard"
        class="border-gray border rounded px-2 py-1 pt-4 m-0"
        :content="phoenixbornCard.text"
        :key="phoenixbornCard.stub"
        is-card-effect></card-codes>
    </div>
    <ul class="grid gap-2 mb-4" :class="$style.autoFitDiceGrid">
      <li v-for="(die, index) of diceList" :key="index"
          class="die w-8 h-8 text-xl text-center"
          :class="[die ? `${die} cursor-pointer` : 'basic', 'phg-' + (die ? die + '-power' : 'basic-magic')]"
          @click="reduceDieCount(die)">
          <span class="alt-text">{{ die ? `Remove ${die.name} die` : '(empty)' }}</span>
      </li>
    </ul>
    <div class="grid gap-2" :class="$style.autoFitControlsGrid">
      <die-counter v-for="dieName of allDiceTypes" :key="dieName" :name="dieName"></die-counter>
    </div>
    <!-- TODO: add card costs stats after I design them; probably located here -->
    <hr class="mt-6 mb-4">

    <div class="flex mb-4">
      <h3 class="flex-grow m-0">Cards <span class="text-gray">(<span :class="{'text-red': totalCards > 30}">{{ totalCards }} / 30</span>)</span></h3>
      <div class="text-md px-2">
        <button class="btn btn-first" :class="{active: activeTab === 'edit'}" @click="activeTab = 'edit'" title="Edit cards">
          <i class="fas fa-edit"></i>
          <span class="alt-text">Edit{{ activeTab === 'edit' ? 'ing' : '' }} cards</span>
        </button><button class="btn btn-last" :class="{active: activeTab === 'first-five'}" @click="activeTab = 'first-five'" title="Edit First Five">
          <i class="far fa-hand-sparkles"></i>
          <span class="alt-text">Edit{{ activeTab === 'first-five' ? 'ing' : '' }} first five</span>
        </button>
      </div>
    </div>

    <!-- TODO: started mocking up UI necessary for handling arbitrary numbers of First Fives; idea is that they will stack vertically and you can select them to edit which will expand them. In that case, do we even need the card list? Maybe instead we have everything handled via dropdown and that allows us space for our cost calculations. Though how to represent card costs in a dropdown? -->
    <div v-if="activeTab === 'first-five'" class="mb-4">
      <div class="flex mb-2">
        <input-button
          class="flex-grow"
          placeholder="First Five"
          :model-value="tempFirstFiveName"
          button-title="Delete"
          button-icon-class="far fa-trash-alt"
          aria-label="First Five name..."
        />
        <button class="text-lg text-black px-1 ml-1" title="Add First Five...">
          <i class="fas fa-plus"></i>
          <span class="alt-text">Add First Five...</span>
        </button>
      </div>
      <div class="slots pl-4 pr-8">
        <div class="flex">
          <text-input
            class="w-1/5"
            placeholder="#1"
            inline-with-text
          />:
          <div class="choices flex-grow pl-2 mb-2">
            <div class="card-slot flex mb-1">
              <div class="flex-none mr-1">
                <button class="btn btn-first active">
                  <i class="far fa-hand-paper"></i>
                </button><button class="btn btn-last" :disabled="!deckSections[0].contents[0].effectMagicCost">
                  <i class="far fa-plus-square"></i>
                </button>
              </div>
              <div class="flex-grow">
                <card-link :card="deckSections[0].contents[0]"></card-link>
                <span v-if="deckSections[0].contents[0].phoenixborn" class="text-gray" :title="deckSections[0].contents[0].phoenixborn">
                  ({{ deckSections[0].contents[0].phoenixborn.split(/,?[ ]/)[0] }})
                </span>
              </div>
              <div class="flex-none">
                <card-codes content="1 [[sympathy:class]] - 1 [[basic]]"></card-codes>
              </div>
            </div>
            <div class="add-slot">
              <em class="text-gray">Choose card...</em>
            </div>
          </div>
        </div>
        <!-- TEMP: duplication for mockup -->
        <div class="flex">
          <text-input
            class="w-1/5"
            placeholder="#2"
            inline-with-text
          />:
          <div class="choices flex-grow pl-2 mb-2">
            <div class="card-slot flex mb-1">
              <div class="flex-none mr-1">
                <button class="btn btn-first active">
                  <i class="far fa-hand-paper"></i>
                </button><button class="btn btn-last" :disabled="!deckSections[0].contents[1].effectMagicCost">
                  <i class="far fa-plus-square"></i>
                </button>
              </div>
              <div class="flex-grow">
                <card-link :card="deckSections[0].contents[1]"></card-link>
                <span v-if="deckSections[0].contents[1].phoenixborn" class="text-gray" :title="deckSections[0].contents[1].phoenixborn">
                  ({{ deckSections[0].contents[1].phoenixborn.split(/,?[ ]/)[0] }})
                </span>
              </div>
              <div class="flex-none">
                <card-codes content="1 [[time:class]]"></card-codes>
              </div>
            </div>
            <div class="add-slot">
              <em class="text-gray">Choose card...</em>
            </div>
          </div>
        </div>
        <div class="flex">
          <text-input
            class="w-1/5"
            placeholder="#3"
            inline-with-text
          />:
          <div class="choices flex-grow pl-2 mb-2">
            <div class="card-slot flex mb-1">
              <div class="flex-none mr-1">
                <button class="btn btn-first active">
                  <i class="far fa-hand-paper"></i>
                </button><button class="btn btn-last active" :disabled="!deckSections[0].contents[2].effectMagicCost">
                  <i class="far fa-plus-square"></i>
                </button>
              </div>
              <div class="flex-grow">
                <card-link :card="deckSections[0].contents[2]"></card-link>
                <span v-if="deckSections[0].contents[2].phoenixborn" class="text-gray" :title="deckSections[0].contents[2].phoenixborn">
                  ({{ deckSections[0].contents[2].phoenixborn.split(/,?[ ]/)[0] }})
                </span>
              </div>
              <div class="flex-none">
                <card-codes content="(1 [[charm:class]])"></card-codes>
              </div>
            </div>
            <div class="card-slot flex mb-1">
              <div class="flex-none mr-1">
                <button class="btn btn-first">
                  <i class="far fa-hand-paper"></i>
                </button><button class="btn btn-last" :disabled="true">
                  <i class="far fa-plus-square"></i>
                </button>
              </div>
              <div class="flex-grow">
                <card-link :card="deckSections[0].contents[3]"></card-link>
                <span v-if="deckSections[0].contents[3].phoenixborn" class="text-gray" :title="deckSections[0].contents[3].phoenixborn">
                  ({{ deckSections[0].contents[3].phoenixborn.split(/,?[ ]/)[0] }})
                </span>
              </div>
              <div class="flex-none text-gray">
                <card-codes content="(1 [[charm:class]])"></card-codes>
              </div>
            </div>
            <div class="add-slot">
              <em class="text-gray">Choose card...</em>
            </div>
          </div>
        </div>
        <div class="flex">
          <text-input
            class="w-1/5"
            placeholder="#4"
            inline-with-text
          />:
          <div class="choices flex-grow pl-2 mb-2">
            <div class="card-slot flex mb-1">
              <div class="flex-none mr-1">
                <button class="btn btn-first active">
                  <i class="far fa-hand-paper"></i>
                </button><button class="btn btn-last" :disabled="!deckSections[1].contents[0].effectMagicCost">
                  <i class="far fa-plus-square"></i>
                </button>
              </div>
              <div class="flex-grow">
                <card-link :card="deckSections[1].contents[0]"></card-link>
                <span v-if="deckSections[1].contents[0].phoenixborn" class="text-gray" :title="deckSections[1].contents[0].phoenixborn">
                  ({{ deckSections[1].contents[0].phoenixborn.split(/,?[ ]/)[0] }})
                </span>
              </div>
              <div class="flex-none">
                <card-codes content="1 [[sympathy:power]] - 1 [[charm:class]] - 1 [[basic]]"></card-codes>
              </div>
            </div>
            <div class="add-slot">
              <em class="text-gray">Choose card...</em>
            </div>
          </div>
        </div>
        <div class="flex">
          <text-input
            class="w-1/5"
            placeholder="#5"
            inline-with-text
          />:
          <div class="choices flex-grow pl-2 mb-2">
            <div class="card-slot flex mb-1">
              <div class="flex-none mr-1">
                <button class="btn btn-first active">
                  <i class="far fa-hand-paper"></i>
                </button><button class="btn btn-last" :disabled="!deckSections[3].contents[1].effectMagicCost">
                  <i class="far fa-plus-square"></i>
                </button>
              </div>
              <div class="flex-grow">
                <card-link :card="deckSections[3].contents[1]"></card-link>
                <span v-if="deckSections[3].contents[1].phoenixborn" class="text-gray" :title="deckSections[3].contents[1].phoenixborn">
                  ({{ deckSections[3].contents[1].phoenixborn.split(/,?[ ]/)[0] }})
                </span>
              </div>
              <div class="flex-none">
                <card-codes content="3 [[basic]]"></card-codes>
              </div>
            </div>
            <div class="add-slot">
              <em class="text-gray">Choose card...</em>
            </div>
          </div>
        </div>
        <!-- TEMP: end duplication -->
      </div>
    </div>

    <div v-for="section of deckSections" :key="section.title">
      <h4><i :class="typeClass(section.contents[0].type)"></i> {{ section.title }} <span class="text-gray">({{ section.count }})</span></h4>
      <ul class="mb-4">
        <li v-for="card of section.contents" :key="card.stub" class="mb-1">
          <div class="flex">
            <deck-qty-buttons v-if="activeTab === 'edit'" class="flex-none mr-1" :card="card" standalone zero-removes-card></deck-qty-buttons>
            <div v-else class="flex-none mr-1">
              <!-- TODO: hook these up to the deck's first five tracking -->
              <button class="btn btn-first" :disabled="card.chained">
                <i class="far fa-hand-paper"></i>
              </button><button class="btn btn-last" :disabled="card.chained || !card.effectMagicCost">
                <i class="far fa-plus-square"></i>
              </button>
              {{ cardCount(card) }}&times;
            </div>
            <div class="flex flex-grow pt-0.5">
              <div class="flex-grow">
                <card-link :card="card"></card-link>
                <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
                  ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
                </span>
              </div>
              <!-- TODO: add card magic costs...somehow. I'm not sure how to format these, honestly -->
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="conjurations && conjurations.length">
      <hr class="mt-6 mb-4">
      <h4><i :class="typeClass('Conjuration')"></i> Conjurations <span class="text-gray">({{ totalConjurations }})</span></h4>
      <ul>
        <li v-for="card of conjurations" :key="card.stub" class="mb-1">
          {{ card.count }}&times; <card-link :card="card"></card-link>
          <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
            ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { diceList, typeToFontAwesome } from '/src/constants.js'
import { capitalize } from '/src/utils/text.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import CardCodes from '../shared/CardCodes.vue'
import DieCounter from './DieCounter.vue'
import DeckQtyButtons from '../shared/DeckQtyButtons.vue'
import InputButton from '../shared/InputButton.vue'
import TextInput from '../shared/TextInput.vue'

export default {
  name: 'BuilderDeck',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    CardCodes,
    DieCounter,
    DeckQtyButtons,
    InputButton,
    TextInput,
  },
  data: () => ({
    activeTab: 'edit',
    tempFirstFiveName: "",
  }),
  emits: ['closePane'],
  computed: {
    allDiceTypes () {
      return diceList
    },
    phoenixborn () {
      return this.$store.state.builder.deck.phoenixborn
    },
    phoenixbornCard () {
      if (!this.phoenixborn || !this.phoenixborn.stub) return null
      // This is a mild abuse of reactivity; basically, we return nothing while the API call executes, then this whole thing gets re-evaluated when it finishes
      // Unfortunately I haven't found any good way to make this function async/await (because then I'd have to await in templates), and it doesn't fire often, so ¯\_(ツ)_/¯
      if (!this.$store.state.cards.stubMap[this.phoenixborn.stub]) {
        this.$store.dispatch('cards/fetchCard', this.phoenixborn)
      }
      return this.$store.state.cards.stubMap[this.phoenixborn.stub]
    },
    diceList () {
      let diceArray = new Array(10)
      let nextIndex = 0
      for (const dieObject of this.$store.state.builder.deck.dice) {
        const numDice = dieObject.count
        const maxIndex = nextIndex + numDice
        while (nextIndex < maxIndex && nextIndex < 10) {
          diceArray[nextIndex] = dieObject.name
          nextIndex++
        }
      }
      while (nextIndex < 10) {
        diceArray[nextIndex] = null
        nextIndex++
      }
      return diceArray
    },
    totalCards () {
      return this.$store.getters['builder/totalCards']
    },
    deckSections () {
      return this.$store.getters['builder/deckSections']
    },
    conjurations () {
      return this.$store.state.builder.deck.conjurations
    },
    totalConjurations () {
      return this.$store.state.builder.deck.conjurations.reduce((value, card) => value + card.count, 0)
    },
  },
  methods: {
    capitalize,
    reduceDieCount (dieName) {
      if (!dieName) return
      this.$store.dispatch('builder/reduceDieCount', dieName)
    },
    typeClass (type) {
      return typeToFontAwesome[type]
    },
    addCards () {
      this.$emit('closePane')
      this.$router.push('/cards/')
    },
    cardCount (card) {
      return this.$store.state.builder.countMap[card.stub] || 0
    },
  },
}
</script>

<style lang="postcss" module>
.autoFitDiceGrid {
  grid-template-columns: repeat( auto-fit, minmax(32px, 1fr) );
}

.autoFitControlsGrid {
  grid-template-columns: repeat( auto-fit, minmax(107px, 1fr) );
}
</style>
