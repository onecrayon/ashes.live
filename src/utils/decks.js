// Utilities for working with card ordering in decks
const cardTypeOrder = [
  'Ready Spell', 'Ally', 'Alteration Spell', 'Action Spell', 'Reaction Spell'
]

function pluralCardType (cardType) {
  if (cardType === 'Ally') {
    return 'Allies'
  }
  return cardType + 's'
}

export function deckTitle (deck) {
  return deck.title || `Untitled ${deck.phoenixborn.name}`
}

/**
 * cardsByType(deck)
 *
 * Parses the given deck object, and returns a list of section objects like:
 *
 *     [
 *       {
 *         title: 'Card Type',
 *         count: 3,
 *         contents: [
 *           {
 *             count: 3,
 *             name: 'Card Name',
 *             phoenixborn: 'Phoenixborn Name',
 *             type: 'Card Type',
 *           }
 *         ]
 *       }
 *     ]
 */
export function cardsByType (deck, isAscending = true) {
  const sections = {}
  for (const card of deck.cards) {
    if (!sections[card.type]) {
      sections[card.type] = []
    }
    sections[card.type].push(card)
  }
  const sectionTitles = Object.keys(sections)
  sectionTitles.sort((a, b) => {
    if (isAscending) return cardTypeOrder.indexOf(a) < cardTypeOrder.indexOf(b) ? -1 : 1
    else return cardTypeOrder.indexOf(a) > cardTypeOrder.indexOf(b) ? -1 : 1
  })
  const sortedSections = []
  for (const section of sectionTitles) {
    const contents = sections[section]
    contents.sort((a, b) => {
      if (a.name === b.name) {
        return 0
      }
      if (isAscending) return a.name < b.name ? -1 : 1
      else return a.name > b.name ? -1 : 1
    })
    const totalCards = contents.reduce((total, card) => total + card.count, 0)
    sortedSections.push({
    'title': pluralCardType(section),
    'count': totalCards,
    'contents': contents
    })
  }
  return sortedSections
}

/**
 * cardsByRelease(deck)
 *
 * Parses the given deck object, and returns a list of section objects like:
 *
 *     [
 *       {
 *         title: 'Release Name',
 *         count: 3,
 *         contents: [
 *           {
 *             count: 3,
 *             name: 'Card Name',
 *             phoenixborn: 'Phoenixborn Name',
 *             type: 'Card Type',
 *           }
 *         ]
 *       }
 *     ]
 */
export function cardsByRelease (deck, isAscending = true, releaseSort = null) {
  const sections = {}
  for (const card of deck.cards) {
    if (!sections[card.release.name]) {
      sections[card.release.name] = []
    }
    sections[card.release.name].push(card)
  }
  const sectionTitles = Object.keys(sections)
  if (releaseSort) {
    sectionTitles.sort((a, b) => {
        if (isAscending) return releaseSort.indexOf(a) < releaseSort.indexOf(b) ? -1 : 1
        else return releaseSort.indexOf(a) > releaseSort.indexOf(b) ? -1 : 1
      })
  } else {
    sectionTitles.sort()
    if (!isAscending) {
      sectionTitles.reverse()
    }
  }
  const sortedSections = []
  for (const section of sectionTitles) {
    const contents = sections[section]
    contents.sort((a, b) => {
      if (a.name === b.name) {
        return 0
      }
      if (isAscending) return a.name < b.name ? -1 : 1
      else return a.name > b.name ? -1 : 1
    })
    const totalCards = contents.reduce((total, card) => total + card.count, 0)
    sortedSections.push({
      'title': section,
      'count': totalCards,
      'contents': contents
    })
  }
  return sortedSections
}
