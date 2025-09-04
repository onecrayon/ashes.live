/**
 * player Vuex store
 *
 * This store saves player authentication, account details, and account options that are persisted
 * to the API.
 */
import axios from 'axios'
import Nanobar from 'nanobar'
import { request } from '/src/utils/index.js'
import { localStoreFactory } from '/src/utils/store.js'

/**
 * jwtPayload(token)
 *
 * Returns the parsed payload object from the given JWT payload (does not attempt to validate it!
 * Don't trust the data you get out!)
 *
 * Source: https://stackoverflow.com/a/38552302/38666
 */
export function jwtPayload(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}

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
  RESET ({ commit }) {
    commit('setToken', null)
    commit('setUsername', null)
    commit('setBadge', null)
    commit('setIsAdmin', false)
  },
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
    // We use native Axios here to ensure that a login request triggered by expired credentials
    // doesn't trigger a cascading never-ending loop of credential requests on username/password
    // failure
    return new Promise((resolve, reject) => {
      const nano = new Nanobar({ autoRun: true })
      axios.request({
        url: `${import.meta.env.VITE_API_URL}/v2/token`,
        method: 'post',
        data: formData,
      }).then(response => {
        dispatch('LOG_IN', response.data).then(resolve)
      }).catch(reject).finally(() => {
        nano.go(100)
      })
    })
  },
  logOut ({ state, dispatch }) {
    // Similar to logging in, we don't want to trigger a login request when they try to log out if
    // their credentials have already expired, so we have to use native Axios
    return new Promise((resolve) => {
      const nano = new Nanobar({ autoRun: true })
      axios.request({
        url: `${import.meta.env.VITE_API_URL}/v2/token`,
        method: 'delete',
        headers: {
          Authorization: `Bearer ${state.token}`
        },
      }).catch(() => {
        // No-op because we don't actually care if it fails
      }).finally(() => {
        dispatch('RESET')
        nano.go(100)
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
      request(`/v2/reset/${token}`, {
        method: 'post',
        data: data,
      }).then(response => {
        dispatch('LOG_IN', response.data).then(resolve)
      }).catch(reject)
    })
  },
  loadExportToken(_) {
    return new Promise((resolve, reject) => {
      request(`/v2/players/me/export`, {
        method: 'get',
      }).then(response => {
        resolve(response.data.export_token)
      }).catch(reject)
    })
  },
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
