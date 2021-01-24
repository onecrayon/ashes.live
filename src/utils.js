import axios from 'axios'
import Nanobar from 'nanobar'
import { diceList } from './constants.js'
import store from './store/index.js'

const ASHES_CDN_BASE_URL = import.meta.env.VITE_CDN_URL

/**
 * request(options)
 *
 * A light wrapper around Axios.request() that ensures each request is accompanied by
 * a progress bar.
 *
 * See https://github.com/axios/axios#request-config for options
 *
 * TODO: add support for generic error handling
 */
export function request(endpoint, options = {}) {
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
      Authorization: `bearer ${store.state.player.token}`
    }
    options.headers = {
      ...(options.headers || {}),
      ...authHeader,
    }
  }
  const nano = new Nanobar({ autoRun: true })
  return axios.request(options).finally(() => {
    nano.go(100)
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
 * trimmed(stringOrFalsey)
 *
 * Ensures that a falsey value is an empty string, and a string has whitespace trimmed. Always
 * returns a string.
 */
export function trimmed(stringOrFalsey) {
  if (!stringOrFalsey) return ''
  return stringOrFalsey.trim()
}

/**
 * localStoreFactory(rootKey)
 *
 * Factory funcion for generating local store access functions keyed off rootKey (that is, the
 * local store will include a single rootKey that contains a JSON object with whatever is set
 * via the factory-derived methods).
 */
export function localStoreFactory(rootKey) {
  function storeGetAll () {
    const stored = window.localStorage.getItem(rootKey)
    return stored ? JSON.parse(stored) : {}
  }
  function storeGet (key) {
    const stored = storeGetAll()
    return stored[key]
  }
  function storeSet (key, value) {
    const stored = storeGetAll()
    stored[key] = value
    window.localStorage.setItem(rootKey, JSON.stringify(stored))
  }
  return {
    storeGetAll,
    storeGet,
    storeSet,
  }
}

/**
 * Parses the given input and converts card codes and star formatting into HTML.
 *
 * @param {string} text
 */
export function parseCardText (text, ensureParagraphs=false, isLegacy=false) {
  // First make sure that we don't have any HTML in our string; no XSS, thanks
  const unescapedHTML = /[&<"']/g
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '\\&#39;'
  }
  if (unescapedHTML.test(text)) {
    text = text.replace(unescapedHTML, (char) => {
      return escapeMap[char]
    })
  }
  // Parse links and images
  text = text.replace(
    /\[\[(\*?)([^\]]*?)((?:https?:\/\/|\b)[^\s/$.?#]+\.[^\s*]+?)\]\]|(https?:\/\/[^\s/$.?#]+\.[^\s*]+?(?=[.?)][^a-z]|!|\s|$))/ig,
    (_, isImage, text, url, standalone) => {
      let internalLink = false
      const textUrl = url || standalone
      const parsedUrl = textUrl.replace(/^(https?:\/\/)?(.+)$/i, (_, prefix, url) => {
        if (/^ashes\.live(?:\/.*)?$/i.test(url)) {
          internalLink = true
          return 'https://' + url
        } else if (!prefix) {
          return 'http://' + url
        } else {
          return url
        }
      })
      text = text ? text.trim() : null
      if (isImage) {
        return `<a href="${textUrl}"${!internalLink ? ' rel="nofollow external"' : ''} target="_blank"><img class="object-contain" src="${textUrl}" alt=""></a>`
      }
      return `<a href="${parsedUrl}"${!internalLink ? ' rel="nofollow"' : ''}>${text || textUrl}</a>`
    }
  )
  // Parse card codes
  text = text.replace(/\[\[(\*?)((?:[a-z -]|\\&#39;)+)(?::([a-z]+))?\]\]|( - )/ig, (input, isImage, primary, secondary, dash) => {
    if (dash) {
      return ' <i class="divider"><span class="alt-text">-</span></i> '
    }
    let lowerPrimary = primary.toLowerCase().replace('\\&#39;', '')
    secondary = secondary && secondary.toLowerCase()
    if (['discard', 'exhaust'].indexOf(lowerPrimary) > -1) {
      return `<i class="phg-${lowerPrimary}" title="${primary}"></i>`
    }

    // Alias "nature" => "natural" (common mistake)
    if (lowerPrimary === 'nature') {
      lowerPrimary = 'natural'
    }
    if (diceList.indexOf(lowerPrimary) > -1) {
      if (!secondary) {
        secondary = 'power'
      }
    } else if (lowerPrimary === 'basic') {
      secondary = 'magic'
    } else if (lowerPrimary === 'main') {
      secondary = 'action'
    } else if (lowerPrimary === 'side') {
      secondary = 'action'
    } else if (secondary) {
      return `<i>${lowerPrimary} ${secondary}</i>`
    } else {
      return `<card-link :card="{name: '${primary}', stub: '${lowerPrimary.replace(/ +/g, '-')}', is_legacy: ${isLegacy}}"></card-link>`
    }
    return `<i class="phg-${lowerPrimary}-${secondary}" title="${primary}${secondary ? ' ' + secondary : ''}"><span class="alt-text">${input}</span></i>`
  })
  // Parse blockquotes
  text = text.replace(/(^> ?.+?)(?=\n[^>\n])/gm, (match) => {
    return `<blockquote>${match.replace(/^>[ \t]*/gm, '')}</blockquote>`
  })
  text = text.replace('\n</blockquote>', '</blockquote>\n')
  // Parse star formatting
  // * list item
  text = text.replace(/(^|\n|<blockquote>)\*[ ]+(.+)/g, '$1<li>$2</li>')
    .replace('</blockquote></li>', '</li></blockquote>')
    .replace(/(^|\n|<blockquote>)((?:<li>.+?<\/li>\n?)+)(<\/blockquote>|\n|$)/g, '$1<ul>$2</ul>$3')
    .replace(/<\/li>\n+<li>/g, '</li><li>')
    .replace(/<\/li>\n+<\/ul>/g, '</li></ul>\n')
    .replace(/<\/li><\/ul>\n+<li>|<\/li>\n+<ul><li>/g, '</li><li>')
    .replace(/<\/li>$/, '</li></ul>')
  // ~ ordered list item (not typically used for posts, but allows easy conversion between post
  //  syntax and card syntax)
  // Routes through fake element `<oli>` to ensure that we don't screw with unordered lists
  text = text.replace(/(^|\n|<blockquote>)~[ ]+(.+)/g, '$1<oli>$2</oli>')
    .replace('</blockquote></oli>', '</oli></blockquote>')
    .replace(/(^|\n|<blockquote>)((?:<oli>.+?<\/oli>\n?)+)(<\/blockquote>|\n|$)/g, '$1<ol>$2</ol>$3')
    .replace(/<\/oli>\n+<oli>/g, '</oli><oli>')
    .replace(/<\/oli>\n+<\/ol>/g, '</oli></ol>\n')
    .replace(/<\/oli><\/ol>\n+<oli>|<\/oli>\n+<ol><oli>/g, '</oli><oli>')
    .replace(/<(\/?)oli>/g, '<$1li>')
    .replace(/<\/oli>$/, '</oli></ol>')
  // Fix single linebreaks after a block level element (these break the paragraph logic further down)
  text = text.replace(/(<\/(?:blockquote|ul|ol)>\n)(?=[^\n])/g, '$1\n')
  // lone star: *
  text = text.replace(/(^| )\*( |$)/g, '$1&#42;$2')
  // ***emstrong*** or ***em*strong**
  text = text.replace(/\*{3}(.+?)\*(.*?)\*{2}/g, '<b><i>$1</i>$2</b>')
  // ***strong**em*
  text = text.replace(/\*{3}(.+?)\*{2}(.*?)\*/g, '<i><b>$1</b>$2</i>')
  // **strong**
  text = text.replace(/\*{2}(.+?)\*{2}/g, '<b>$1</b>')
  // *emphasis*
  text = text.replace(/\*([^*\n\r]+)\*/g, '<i>$1</i>')
  // Check if we need to further process into paragraphs
  const paragraphs = text.trim().split(/(?:\r\n|\r|\n){2,}/)
  if (paragraphs.length === 1 && !/^<(?:ul|ol|blockquote)>/.test(paragraphs)) {
    return ensureParagraphs ? `<p>${text}</p>` : text
  }
  const composedParagraphs = []
  paragraphs.forEach(paragraph => {
    paragraph = paragraph.replace('\n', '<br>\n')
    composedParagraphs.push(`<p>${paragraph}</p>`)
  })
  text = composedParagraphs.join('\n\n')
  // Correct wrapped lists, blockquotes, and divs
  text = text.replace(/<p>((?:<blockquote>)?<(?:u|o)l>)/g, '$1')
    .replace(/(<\/(?:u|o)l>(?:<\/blockquote>)?)<\/p>/g, '$1')
    .replace('<p><blockquote>', '<blockquote><p>')
    .replace('</blockquote></p>', '</p></blockquote>')
  // Automatically center lone images
  text = text.replace(/<p>(<a class="inline-image".*?<\/a>(?=<\/p>|<br>))/g, '<p style="text-align:center;">$1')
  return text
}

/**
 * Parses card effects into standard HTML.
 *
 * This is in addition to standard card code parsing because card effects need:
 *
 * * Bold ability names
 * * Inexhaustible effect boxes
 * * Blue reaction ability boxes
 *
 * @param {str} text Card effect text to parse
 */
export function parseEffectText (text, isLegacy=false) {
  text = parseCardText(text, true, isLegacy)
  // Convert lists to inexhaustible and blue blocks
  text = text.replace('<ul>', '<div class="inexhaustible-effects">')
    .replace('<ol>', '<div class="reaction-effects">')
    .replace(/<\/(?:ul|ol)>/g, '</div>')
    .replace(/<(\/?)li>/g, '<$1p>')
  // Bold ability names (&#39; is apostrophe)
  text = text.replace(/(?:<p>|^)((?:[a-z 0-9]|&#39;)+:)(?= \w| <i class="phg-)/ig, '<p><strong>$1</strong>')
  return text
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
