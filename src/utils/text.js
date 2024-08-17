import { diceList } from '../constants.js'

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
 * capitalize(value)
 *
 * Returns a copy of the given string with the first character capitalized.
 */
export function capitalize (value) {
  if (!value) return value
  return `${value.substr(0, 1).toUpperCase()}${value.substr(1)}`
}

/**
 * Parses the given input and converts card codes and star formatting into HTML.
 *
 * @param {string} text
 */
export function parseFormattedText (text, ensureParagraphs=false, isLegacy=false, asCardEffect=false) {
  // First make sure that we don't have any HTML in our string; no XSS, thanks
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
      const parsedUrl = textUrl.replace(/^(https?:\/\/)?(.+)$/i, (fullUrl, prefix, url) => {
        if (/^ashes\.live(?:\/.*)?$/i.test(url)) {
          internalLink = true
          return 'https://' + url
        } else if (!prefix) {
          return 'https://' + url
        } else {
          return fullUrl
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
  text = text.replace(/\[\[(\*?)((?:[a-z ,-]|&#39;)+)(?::([a-z]+))?\]\]|( - )/ig, (input, isImage, primary, secondary, dash) => {
    if (dash) {
      return ' <i class="divider"><span class="alt-text">-</span></i> '
    }
    let lowerPrimary = primary.toLowerCase().replace(/&#39;|,/g, '')
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
      // We have to escape single quotes that are passed down to a linked component because otherwise Vue translates them back into single quotes and throws an error
      return `<card-link :card="{name: '${primary.replace('&#39;', '\\&#39;')}', stub: '${lowerPrimary.replace(/ +/g, '-')}', is_legacy: ${isLegacy}}"></card-link>`
    }
    return `<i class="phg-${lowerPrimary}-${secondary}" title="${primary}${secondary ? ' ' + secondary : ''}"><span class="alt-text">${input}</span></i>`
  })
  // Parse blockquotes
  text = text.replace(/(^> ?.+?)(?:(?=\n[^>\n])|$(?![^]))/gms, (match) => {
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
  // Insert accessible text, if this is a card effect
  if (asCardEffect){
    text = text.replace('<li>', '<li><span class="alt-text">(Inexhaustible effect) </span>')
  }
  // ~ ordered list item (not typically used for posts, but allows easy conversion between post
  //  syntax and card syntax)
  // Routes through fake element `<oli>` to ensure that we don't screw with unordered lists
  text = text.replace(/(^|\n|<blockquote>)~[ ]+(.+)/g, '$1<oli>$2</oli>')
    .replace('</blockquote></oli>', '</oli></blockquote>')
    .replace(/(^|\n|<blockquote>)((?:<oli>.+?<\/oli>\n?)+)(<\/blockquote>|\n|$)/g, '$1<ol>$2</ol>$3')
    .replace(/<\/oli>\n+<oli>/g, '</oli><oli>')
    .replace(/<\/oli>\n+<\/ol>/g, '</oli></ol>\n')
    .replace(/<\/oli><\/ol>\n+<oli>|<\/oli>\n+<ol><oli>/g, '</oli><oli>')
    .replace(/<\/oli>$/, '</oli></ol>')
  // Add accessible text, if this is a card effect
  if (asCardEffect) {
    text = text.replace('<oli>', '<oli><span class="alt-text">(Reaction effect) </span>')
  }
  // And convert back to normal <li> elements
  text = text.replace(/<(\/?)oli>/g, '<$1li>')
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
  text = parseFormattedText(text, true, isLegacy, true)
  // Convert lists to inexhaustible and blue blocks
  text = text.replace('<ul>', '<div class="inexhaustible-effects">')
    .replace('<ol>', '<div class="reaction-effects">')
    .replace(/<\/(?:ul|ol)>/g, '</div>')
    .replace(/<(\/?)li>/g, '<$1p>')
  // Bold ability names (&#39; is apostrophe)
  text = text.replace(/(?:<p>|^)(<span class="alt-text">.+?<\/span>)?((?:[a-z 0-9!]|&#39;)+:)(?= \w| <i class="phg-)/ig, '<p>$1<strong>$2</strong>')
  return text
}
