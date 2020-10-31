import axios from 'axios'
import Nanobar from 'nanobar'
import { diceList } from './constants.js'

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
 * Parses the given input and converts card codes and star formatting into HTML.
 *
 * @param {string} text
 */
export function parseCardText (text) {
  // First make sure that we don't have any HTML in our string
  const unescapedHTML = /[&<"']/g
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#39;'
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
        return [
          '<a href="', textUrl, '"', !internalLink ? ' rel="nofollow external"' : '',
          ' target="_blank">', '<img class="object-contain" src="', textUrl, '" alt=""></a>'
        ].join('')
      }
      return [
        '<a href="', parsedUrl, '"', !internalLink ? ' rel="nofollow"' : '', '>',
        text || textUrl, '</a>'
      ].join('')
    }
  )
  // Parse card codes
  text = text.replace(/\[\[(\*?)((?:[a-z -]|&#39;)+)(?::([a-z]+))?\]\]|( - )/ig, (input, isImage, primary, secondary, dash) => {
    if (dash) {
      return ' <span class="divider"><span class="alt-text">-</span></span> '
    }
    let lowerPrimary = primary.toLowerCase().replace('&#39;', '')
    secondary = secondary && secondary.toLowerCase()
    if (['discard', 'exhaust'].indexOf(lowerPrimary) > -1) {
      return ['<span class="phg-', lowerPrimary, '" title="', primary, '"></span>'].join('')
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
      return ['<i>', lowerPrimary, ' ', secondary, '</i>'].join('')
    } else {
      return [
        '<strong data-stub="', lowerPrimary.replace(/ +/g, '-'), '">',
        primary,
        '</strong>'
      ].join('')
    }
    return [
      '<span class="phg-', lowerPrimary, '-', secondary, '" title="',
      primary, (secondary ? ' ' + secondary : ''), '"><span class="alt-text">', input,
      '</span></span>'
    ].join('')
  })
  // Parse blockquotes
  text = text.replace(/(^> ?.+?)(?=\n[^>\n])/gm, (match) => {
    return `<blockquote>${match.replace(/^>[ \t]*/gm, '')}</blockquote>`
  })
  text = text.replace('\n</blockquote>', '</blockquote>\n')
  // Parse star formatting
  // * list item
  // TODO: LEFT OFF HERE
  // lone star: *
  text = text.replace(/(^| )\*( |$)/g, (_, leading, trailing) => {
    return [leading, '&#42;', trailing].join('')
  })
  // ***emstrong*** or ***em*strong**
  text = text.replace(/\*{3}(.+?)\*(.*?)\*{2}/g, (_, first, second) => {
    return ['<b><i>', first, '</i>', second, '</b>'].join('')
  })
  // ***strong**em*
  text = text.replace(/\*{3}(.+?)\*{2}(.*?)\*/g, (_, first, second) => {
    return ['<i><b>', first, '</b>', second, '</i>'].join('')
  })
  // **strong**
  text = text.replace(/\*{2}(.+?)\*{2}/g, (_, text) => {
    return ['<b>', text, '</b>'].join('')
  })
  // *emphasis*
  text = text.replace(/\*([^*\n\r]+)\*/g, (_, text) => {
    return ['<i>', text, '</i>'].join('')
  })
  // Check if we need to further process into paragraphs
  const paragraphs = text.trim().split(/(?:\r\n|\r|\n){2,}/)
  if (paragraphs.length === 1) return text
  const composedParagraphs = []
  paragraphs.forEach(paragraph => {
    paragraph = paragraph.replace('\n', '<br>\n')
    composedParagraphs.push(`<p>${paragraph}</p>`)
  })
  text = composedParagraphs.join('\n\n')
  // Correct wrapped lists and blockquotes
  text = text.replace(/<p>((?:<blockquote>)?<ul>)/g, '$1')
               .replace(/(<\/ul>(?:<\/blockquote>)?)<\/p>/g, '$1')
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
export function parseEffectText (text) {
  text = parseCardText(text)
  // Bold ability names
  text = text.replace(/(?:<p>|^)([a-z 0-9]+:)/ig, '<p><strong>$1</strong>')
  return text
}
