/**
 * deck Vuex store
 *
 * This store manages the deckbuilder mode, which allows constructing a deck over the course of a
 * session. Note that all writes to the deck must be performed via actions, because the deck is
 * auto-saved.
 */
import { debounce, request } from '/src/utils/index.js'
import { deckToSections } from '/src/utils/decks.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'

// Debounced request so that we can ensure our save actions are spaced out
// Using callbacks is necessary because debounce doesn't return a promise
function requestWithCallbacks (url, options, { then: thenCallback, catch: catchCallback, finally: finallyCallback }) {
  request(url, options).then(thenCallback).catch(catchCallback).finally(finallyCallback)
}
const debouncedRequestWithCallbacks = debounce(requestWithCallbacks, 750)
// And grab our standard error handling so that save actions can throw their own errors
const { handleResponseError, toast } = useHandleResponseError()

// Initial state
const getBaseState = () => ({
  enabled: false,
  // This is used internally to track whether we have local changes that are pending save
  isDirty: false,
  // This is used to disable stuff that modifies the deck while it's actively being saved (so that
  // we don't lose edits)
  isSaving: false,
  // This is where we store the actual stuff we're pushing up to the server
  deck: {
    id: null,
    title: '',
    description: '',
    modified: null,
    phoenixborn: null,
    dice: [],
    cards: [],
    first_five: [],
    effect_costs: [],
    tutor_map: {},
    // These aren't necessary for saving the deck, but cacheing them improves display logic
    conjurations: [],
    direct_share_uuid: null,
  },
  // This is a local-only cache of stubs as keys and quantities as values (much simpler for per-card lookups)
  countMap: {},
})
const state = getBaseState

// Getters
const getters = {
  totalDice (state) {
    return state.deck.dice.reduce((value, dieObject) => value += dieObject.count, 0)
  },
  totalCards (state) {
    return state.deck.cards.reduce((value, card) => value + card.count, 0)
  },
  deckSections (state) {
    return deckToSections(state.deck)
  },
}

// Actions
const actions = {
  RESET ({ commit }) {
    commit('RESET_STATE')
  },
  PERSIST_DECK ({ commit }, deck) {
    // This persists a deck locally that has been loaded from the API
    return new Promise(resolve => {
      commit('setDeckID', deck.id)
      commit('setTitle', deck.title)
      commit('setDescription', deck.description)
      commit('setPhoenixborn', deck.phoenixborn)
      commit('setModified', deck.modified)
      for (const dieObject of deck.dice) {
        commit('setDieCount', dieObject)
      }
      if (deck.cards) {
        for (const card of deck.cards) {
          commit('setCardCount', {
            card: card,
            count: card.count,
          })
        }
      }
      if (deck.conjurations) {
        commit('setConjurations', deck.conjurations)
      }
      if (deck.direct_share_uuid) {
        commit('setDirectShareUUID', deck.direct_share_uuid)
      }
      // TODO: first_five
      // TODO: effect_costs
      // TODO: tutor_map
      resolve()
    })
  },
  SAVE_DECK ({ commit, dispatch, state }, forceSave = false) {
    // Saves the deck to the API. Note that the promise does not return direct results from the API!
    // This method debounces the save (unless forceSave is true) so it resolves its promise prior
    // to the save request completing.
    return new Promise((resolve, reject) => {
      // A Phoenixborn is required to save a deck at all, so check for that first
      if (!state.deck.phoenixborn) {
        toast.error('You must add a Phoenixborn before you can save your deck!')
        return reject()
      }
      if (state.isSaving) {
        toast.error('Please wait to save again until the deck is done saving.')
        return reject()
      }
      // Construct our data object
      const data = {
        title: state.deck.title,
        description: state.deck.description,
        phoenixborn: state.deck.phoenixborn.stub,
        dice: state.deck.dice,
        cards: state.deck.cards,
        first_five: state.deck.first_five,
        effect_costs: state.deck.effect_costs,
        tutor_map: state.deck.tutor_map,
      }
      if (state.deck.id) {
        data.id = state.deck.id
      }

      // Clear any debounced requests or set dirty state if debouncing
      const requestMethod = forceSave ? requestWithCallbacks : debouncedRequestWithCallbacks
      if (forceSave) {
        debouncedRequestWithCallbacks.cancel()
      } else {
        commit('setIsDirty', true)
      }
      requestMethod(
        '/v2/decks',
        {
          method: 'put',
          data: data,
        },
        {
          then: response => {
            // Persist our response data, just in case there was drift
            dispatch('PERSIST_DECK', response.data).then(() => {
              // And note that we're not dirty anymore
              commit('setIsDirty', false)
            })
          },
          catch: error => {
            // Ensure that our dirty flag is toggled
            commit('setIsDirty', true)
            handleResponseError(error)
          },
          finally: () => {
            commit('setIsSaving', false)
          },
        }
      )
      resolve()
    })
  },
  editDeck ({ commit, dispatch, state }, id) {
    return new Promise((resolve, reject) => {
      if (state.deck.id === id) return resolve()
      commit('setIsSaving', true)
      request(`/v2/decks/${id}`, {
        params: { show_saved: true },
      }).then(response => {
        // Load in our new deck!
        commit('RESET_STATE')
        commit('enable')
        dispatch('PERSIST_DECK', response.data.deck).then(resolve)
      }).catch(error => {
        reject(error)
      }).finally(() => {
        commit('setIsSaving', false)
      })
    })
  },
  deleteDeck ({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      request(`/v2/decks/${id}`, {
        method: 'delete',
      }).then(() => {
        // Clear out the deckbuilder if we were editing the deck that just got deleted
        if (state.deck.id === id) {
          commit('RESET_STATE')
        }
        resolve()
      }).catch(reject)
    })
  },
  reset ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!state.enabled) return resolve()
      if (state.isSaving) return reject('You cannot exit the deckbuilder while changes are being saved.')
      // Reset to the base state
      commit('RESET_STATE')
      resolve()
    })
  },
  setPhoenixborn ({ commit, dispatch, state }, card) {
    return new Promise((resolve, reject) => {
      if (!state.enabled) return reject('You cannot modify a deck when the deckbuilder is not active.')
      commit('setPhoenixborn', card)
      dispatch('SAVE_DECK').then(resolve).catch(reject)
    })
  },
  setCardCount ({ commit, dispatch, state }, { card, count }) {
    const stub = card.stub
    return new Promise((resolve, reject) => {
      // Removing something that isn't there? Well, that was easy
      if (!state.countMap[stub] && count === 0) return resolve()
      commit('setCardCount', { card, count })
      dispatch('SAVE_DECK').then(resolve).catch(reject)
    })
  },
  reduceDieCount ({ dispatch, state }, name) {
    const dieObject = state.deck.dice.find(element => element.name === name)
    if (!dieObject || dieObject.count === 0) return
    return dispatch('setDieCount', { name, count: dieObject.count - 1 })
  },
  setDieCount ({ commit, dispatch }, { name, count }) {
    return new Promise((resolve, reject) => {
      commit('setDieCount', { name, count })
      dispatch('SAVE_DECK').then(resolve).catch(reject)
    })
  },
}

// Mutations
const mutations = {
  RESET_STATE (state) {
    Object.assign(state, getBaseState())
  },
  // One of the few mutations intended to be used publicly for this store; enables the deckbuilder
  enable (state) {
    if (!state.enabled) state.enabled = true
  },
  // These are all private; don't use them
  disable (state) {
    state.enabled = false
  },
  setIsDirty (state, value) {
    state.isDirty = value
  },
  setIsSaving (state, value) {
    state.isSaving = value
  },
  setDeckID (state, value) {
    state.deck.id = value
  },
  setModified (state, value) {
    state.deck.modified = value
  },
  setPhoenixborn (state, card) {
    if (state.deck.phoenixborn && state.deck.phoenixborn.stub === card.stub) return
    // Remove any Phoenixborn unique cards from the deck that don't match this Phoenixborn
    const badStubs = []
    const badIndices = []
    const numCards = state.deck.cards.length
    for (let i = 0; i < numCards; i++) {
      const curCard = state.deck.cards[i]
      if (curCard.phoenixborn && curCard.phoenixborn !== card.name) {
        badStubs.push(curCard.stub)
        badIndices.push(i)
      }
    }
    // Delete our indices backwards so that they don't shift as we mutate the array
    let index = badIndices.pop()
    while (index !== undefined) {
      state.deck.cards.splice(index, 1)
      index = badIndices.pop()
    }
    // And clear them from our countMap
    for (const stub of badStubs) {
      if (state.countMap[stub] !== undefined) {
        delete state.countMap[stub]
      }
    }

    // And finally set the Phoenixborn
    state.deck.phoenixborn = {
      name: card.name,
      stub: card.stub,
    }
  },
  setCardCount (state, { card, count }) {
    const stub = card.stub
    if (count === 0) {
      // No need to proceed if this isn't in our count map
      if (state.countMap[stub] === undefined) return
      delete state.countMap[stub]
      const index = state.deck.cards.findIndex(element => element.stub === stub)
      // This should never happen, but just in case...
      if (index === -1) return
      state.deck.cards.splice(index, 1)
    } else if (state.countMap[stub] === undefined) {
      // Adding the card for the first time
      const cardData = {
        count,
        name: card.name,
        stub: card.stub,
        type: card.type,
      }
      if (card.phoenixborn) {
        cardData.phoenixborn = card.phoenixborn
      }
      state.deck.cards.push(cardData)
      state.countMap[stub] = count
    } else {
      // Updating the count is only necessary if it actually updated
      if (state.countMap[stub] === count) return
      state.countMap[stub] = count
      const index = state.deck.cards.findIndex(element => element.stub === stub)
      if (index === -1) return
      state.deck.cards[index].count = count
    }
  },
  setTitle (state, title) {
    state.deck.title = title
  },
  setDescription (state, description) {
    state.deck.description = description
  },
  setDieCount (state, { name, count }) {
    const dieObjectIndex = state.deck.dice.findIndex(element => element.name === name)
    // Remove the die from our array, if necessary
    if (count === 0 && dieObjectIndex > -1) {
      state.deck.dice.splice(dieObjectIndex, 1)
      return
    }
    // Otherwise update it or add it
    if (dieObjectIndex > -1) {
      state.deck.dice[dieObjectIndex].count = count
    } else {
      state.deck.dice.push({ name, count })
    }
  },
  setConjurations (state, conjurations) {
    state.deck.conjurations = conjurations
  },
  setDirectShareUUID (state, directShareUUID) {
    state.deck.direct_share_uuid = directShareUUID
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
