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
  LOG_IN ({ commit }, authResponseData) {
    const user = authResponseData.user
    commit('setToken', authResponseData.access_token)
    commit('setUsername', user.username)
    commit('setBadge', user.badge)
    commit('setIsAdmin', user.is_admin)
    commit('options/setColorizeIcons', user.colorize_icons, { root: true })
  },
  logIn ({ dispatch }, { email, password, rememberMe }) {
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
        dispatch('LOG_IN', response.data).then(resolve)
      }).catch(reject)
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
  },
  invite (_, { email }) {
    return new Promise((resolve, reject) => {
      request('/v2/players/new', {
        method: 'post',
        data: { email: email }
      }).then(resolve).catch(reject)
    })
  },
  register ({ dispatch }, data) {
    const token = data.token
    delete data.token
    return new Promise((resolve, reject) => {
      request(`/v2/players/new/${token}`, {
        method: 'post',
        data: data,
      }).then(response => {
        dispatch('LOG_IN', response.data).then(resolve)
      }).catch(error => {
        if (error.response && error.response.status === 404) {
          reject('This invitation token has already been used or is otherwise invalid.')
        } else {
          reject(error)
        }
      })
    })
  },
  loadProfile ({ commit }) {
    return new Promise((resolve, reject) => {
      request('/v2/players/me').then(response => {
        const user = response.data
        commit('setUsername', user.username)
        commit('options/setColorizeIcons', user.colorize_icons, { root: true })
        resolve(user)
      }).catch(reject)
    })
  },
  saveProfile ({ commit }, data) {
    return new Promise((resolve, reject) => {
      request('/v2/players/me', {
        method: 'patch',
        data: data,
      }).then(response => {
        const user = response.data
        commit('setUsername', user.username)
        commit('options/setColorizeIcons', user.colorize_icons, { root: true })
        resolve(user)
      }).catch(reject)
    })
  },
  resetPassword ({ dispatch }, data) {
    const token = data.token
    delete data.token
    return new Promise((resolve, reject) => {
      request(`/v2/players/reset/${token}`, {
        method: 'post',
        data: data,
      }).then(response => {
        dispatch('LOG_IN', response.data).then(resolve)
      }).catch(reject)
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
