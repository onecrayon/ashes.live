/**
 * player Vuex store
 *
 * This store saves player authentication, account details, and account options that are persisted
 * to the API.
 */
import { request, localStoreFactory } from '/src/utils.js'

const { storeGet, storeSet } = localStoreFactory('player.auth')

// Initial state
const state = () => ({
  username: storeGet('username') || null,
  badge: storeGet('badge') || null,
  token: storeGet('token') || null,
  isAdmin: storeGet('isAdmin') || false,
})

// Getters
const getters = {
  isAuthenticated (state) {
    return !!state.token
  },
  isAdmin (state) {
    return state.token && state.isAdmin
  },
  user (state) {
    return {
      username: state.username,
      badge: state.badge,
    }
  }
}

// Actions
const actions = {
  logIn ({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      request('/v2/token', {
        method: 'post',
        data: {
          username: email,
          password: password,
        }
      }).then(response => {
        const user = response.data.user
        commit('setToken', response.data.access_token)
        commit('setUsername', user.username)
        commit('setBadge', user.badge)
        commit('setIsAdmin', user.is_admin)
        commit('options/setColorizeIcons', user.colorize_icons, { root: true })
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

// Mutations
const mutations = {
  setToken (state, token) {
    state.token = token
    storeSet('token', token)
  },
  setUsername (state, username) {
    state.username = username
    storeSet('username', username)
  },
  setBadge (state, badge) {
    state.badge = badge
    storeSet('badge', badge)
  },
  setIsAdmin (state, isAdmin) {
    state.isAdmin = isAdmin
    storeSet('isAdmin', isAdmin)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
