// All player dice (used to construct filtration controls, etc.)
export const diceList = ["ceremonial", "charm", "illusion", "natural", "divine", "sympathy", "time", "artifice", "astral"]
// All dice icons (including those that shouldn't be part of filtration)
export const diceIcons = diceList + ["dragon"]

export const typeToFontAwesome = {
  'Ally': 'fas fa-users',
  'Action Spell': 'fas fa-sparkles',
  'Reaction Spell': 'fas fa-bolt',
  'Alteration Spell': 'far fa-clone',
  'Ready Spell': 'far fa-book-spells',
  'Conjuration': 'fas fa-recycle',
  'Conjured Alteration Spell': 'fas fa-recycle',
  'Phoenixborn': 'fas fa-shield-alt',
}
