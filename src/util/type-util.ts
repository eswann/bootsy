const toString = Object.prototype.toString

/**
 * Determines if the passed function is async
 * @param fn The function to assess
 */
export function isAsync(fn: Function) {
  const asStr = fn?.toString ? fn.toString() : ''
  return asStr.startsWith('async') || asStr.includes('awaiter') || asStr === '[object Promise]'
}

/**
 * Determines if the provided object is a POJO
 * @param value The object to assess
 */
export function isPlainObject(value) {
  if (!isObjectLike(value) || getTag(value) != '[object Object]') {
    return false
  }
  if (Object.getPrototypeOf(value) === null) {
    return true
  }
  let proto = value
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(value) === proto
}

/**
 * Determines if the passed value is a string
 * @param value Value to evaluate for stringiness
 */
export function isString(value: any) {
  return typeof value === 'string' || value instanceof String
}

/**
 * Determines if the passed item is a function
 * @param input The item to assess
 */
export function isFunction(input: any) {
  return typeof input === 'function'
}

export namespace FunctionTypes {
  export type StandardFunction = (...args: any[]) => any
  export type ObjectFunction = (arg: Object) => Promise<any>
  export type AsyncFunction = (...args: any[]) => Promise<any>
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param value The value to query.
 * @returns Returns the `toStringTag`.
 */
function getTag(value: any): string {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 * @param value The value to check.
 * @returns Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value: any) {
  return typeof value === 'object' && value !== null
}
