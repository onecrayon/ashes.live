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
 * deckToSections(deck)
 *
 * Parses the given deck object, and returns a list of section objects like:
 *
 *     [
 *       {
 *         title: 'Section Title',
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
export function deckToSections (deck) {
  const sections = {}
  for (const card of deck.cards) {
    if (!sections[card.type]) {
      sections[card.type] = []
    }
    sections[card.type].push(card)
  }
  const sectionTitles = Object.keys(sections)
  sectionTitles.sort((a, b) => {
    return cardTypeOrder.indexOf(a) < cardTypeOrder.indexOf(b) ? -1 : 1
  })
  const sortedSections = []
  for (const section of sectionTitles) {
    const contents = sections[section]
    contents.sort((a, b) => {
      if (a.name === b.name) {
        return 0
      }
      return a.name < b.name ? -1 : 1
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
