/**
 * Tells us about the current type passed in
 * Taken from rambda (not ramda)
 * @param input An input to be interrogated
 * @returns A string representation of the type of the input
 */
export function getType(input: any) {
  const typeOf = typeof input
  const asStr = input && input.toString ? input.toString() : ''

  if (input === null) {
    return 'Null'
  } else if (input === undefined) {
    return 'Undefined'
  } else if (typeOf === 'boolean') {
    return 'Boolean'
  } else if (typeOf === 'number') {
    return Number.isNaN(input) ? 'NaN' : 'Number'
  } else if (typeOf === 'string') {
    return 'String'
  } else if (Array.isArray(input)) {
    return 'Array'
  } else if (input instanceof RegExp) {
    return 'RegExp'
  }

  if (['true', 'false'].includes(asStr)) return 'Boolean'
  if (!Number.isNaN(Number(asStr))) return 'Number'
  if (asStr.startsWith('async') || asStr.includes('awaiter')) return 'Async'
  if (asStr === '[object Promise]') return 'Promise'
  if (typeOf === 'function') return 'Function'
  if (input instanceof String) return 'String'

  return 'Object'
}
