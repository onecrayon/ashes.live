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
