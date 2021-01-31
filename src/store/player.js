/**
 * player Vuex store
 *
 * This store saves player authentication, account details, and account options that are persisted
 * to the API.
 */
import { request, localStoreFactory, jwtPayload } from '/src/utils.js'

const { storeGet, storeSet } = localStoreFactory('player.auth')

// Check the validity of the token on load
let baseToken = storeGet('token') || null
// Check if the token is obviously expired
if (baseToken) {
  const payload = jwtPayload(baseToken)
  // Javascript returns milliseconds from Unix epoch, because why not?
  const nowTimestamp = Math.floor(Date.now() / 1000)
  if (payload.exp <= nowTimestamp) {
    baseToken = null
  }
}

// Initial state; populated based on whether we have a seemingly-valid token or not
const state = () => ({
  username: (baseToken && storeGet('username')) || null,
  badge: (baseToken && storeGet('badge')) || null,
  token: baseToken,
  isAdmin: (baseToken && storeGet('isAdmin')) || false,
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
  logIn ({ commit }, { email, password, rememberMe }) {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    if (rememberMe) {
      formData.append('scope', 'token:longterm')
    }

    return new Promise((resolve, reject) => {
      request('/v2/token', {
        method: 'post',
        data: formData,
      }).then(response => {
        const user = response.data.user
        commit('setToken', response.data.access_token)
        commit('setUsername', user.username)
        commit('setBadge', user.badge)
        commit('setIsAdmin', user.is_admin)
        commit('options/setColorizeIcons', user.colorize_icons, { root: true })
        resolve()
      }).catch((error) => {
        // TODO: make sure to catch situation where we don't have a response at all (or are missing detail key)
        reject(error.response.data.detail)
      })
    })
  },
  logOut ({ commit }) {
    return new Promise((resolve) => {
      request('/v2/token', {
        method: 'delete'
      }).finally(() => {
        commit('setToken', null)
        commit('setUsername', null)
        commit('setBadge', null)
        commit('setIsAdmin', false)
        resolve()
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
