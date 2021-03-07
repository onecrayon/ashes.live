import axios from 'axios'
import Nanobar from 'nanobar'
import emitter from '../events.js'
import router from '../router.js'
import store from '../store/index.js'

const ASHES_CDN_BASE_URL = import.meta.env.VITE_CDN_URL

/**
 * request(options)
 *
 * A light wrapper around Axios.request() that ensures each request is accompanied by
 * a progress bar.
 *
 * See https://github.com/axios/axios#request-config for options
 *
 * TODO: move support for generic error handling into this method?
 */
export function request(endpoint, options = {}, isRetry = false) {
  // No need to prefix the endpoint if we have a full URL
  if (endpoint.startsWith('http')) {
    options.url = endpoint
  } else {
    if (endpoint.startsWith('/')) endpoint = endpoint.substr(1)
    options.url = `${import.meta.env.VITE_API_URL}/${endpoint}`
  }
  // Always authenticate, if we have a token available
  if (store.getters['player/isAuthenticated']) {
    const authHeader = {
      Authorization: `Bearer ${store.state.player.token}`
    }
    options.headers = {
      ...(options.headers || {}),
      ...authHeader,
    }
  }
  // This is a little gnarly, but I want to have expired tokens automatically handled at a low level
  // so here we are. What happens is that if the authentication fails and the user is authenticated,
  // then we use the global event bus `emitter` from `events.js` to trigger a `login:required`
  // event. This is listened to within the root-level `App.vue` component, which in turn will show
  // the log in modal *while this request Promise is still pending.* Once the login succeeds or
  // fails, then App.vue uses a callback to notify this request. If it succeeds, the request will
  // retry itself, and pass along the ultimate success or failure of the retry. If it fails, the
  // request will simply fail out with the original error.
  return new Promise((resolve, reject) => {
    const nano = new Nanobar({ autoRun: true })
    axios.request(options).then(resolve).catch((error) => {
      if (!isRetry && error.response && error.response.status === 401) {
        // If the player is currently authenticated, then that means that their credentials expired.
        // In that case, we'll retry the request
        if (store.getters['player/isAuthenticated']) {
          emitter.emit('login:required', {onSuccess: () => {
            // Sanitize our options and try again
            const endpoint = options.url
            delete options.url
            delete options.headers.Authorization
            request(endpoint, options, true).then(resolve).catch(reject)
          }, onFailure: () => {
            // Since their login failed, we need to clear their credentials
            store.dispatch('RESET_PLAYER')
            // And send them home, just in case the page they are on requires auth
            router.push({name: 'Home'})
            reject('You have been automatically logged out.')
          }})
        } else {
          // Otherwise, they somehow managed to attempt an authenticated request without auth,
          // so just redirect to the login screen
          reject(error)
          router.push({name: 'LogIn'})
        }
        return
      }
      reject(error)
    }).finally(() => {
      nano.go(100)
    })
  })
}

/**
 * debounce(callback, wait)
 *
 * Debounces the given callback such that it will only be called a single time after `wait`
 * seconds have elapsed (calling it repeatedly will continue offsetting when it will trigger).
 *
 * The returned function has an additional `cancel()` method that will prevent the
 * the debounced method from triggering. For instance:
 *
 *     const debounced = debounce(myFunction, 1000)
 *     debounced()
 *     debounced.cancel()
 *     // myFunction will never be called
 */
export function debounce(callback, wait) {
  let timeout
  const debounced = (...args) => {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(context, args), wait)
  }
  debounced.cancel = () => {
    clearTimeout(timeout)
  }
  return debounced
}

/**
 * areSetsEqual(setA, setB)
 *
 * Javascript doesn't have any way to compare set equality, because...Javascript.
 */
export function areSetsEqual(setA, setB) {
  return setA.size === setB.size && [...setA].every(value => setB.has(value))
}

/**
 * Returns phoenixborn image url from the CDN.
 *
 * @param {str} stub Phoenixborn card name
 * @param {str} isLarge If the image to be returned should be the large version
 * @param {bool} isLegacy If the card is from the Ashes 1.0 set as opposed to the Reborn set
 */
export function getPhoenixbornImageUrl(stub, isLarge = false, isLegacy = false) {
  return isLegacy ?
    `${ASHES_CDN_BASE_URL}/legacy/images/cards/${stub}-${isLarge ? 'large' : 'slice'}.jpg` :
    `${ASHES_CDN_BASE_URL}/images/phoenixborn${isLarge ? '' : '-badges'}/${stub}.jpg`
}
