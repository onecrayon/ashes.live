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
