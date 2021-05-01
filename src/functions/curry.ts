import { FunctionTypes } from '../util/type-util'
import StandardFunction = FunctionTypes.StandardFunction

/**
 * Returns a curried version of the function.
 * The curried function can be called with some or all of the args
 * and will be evaluated when the last argument is provided.
 * Taken from rambda (not ramda)
 * @param fn The function to transform to a curried function
 * @param args Required for the currying recursion (don't use this)
 * @returns The curried function
 */
export function curry(fn: Function, ...args: any[]): StandardFunction {
  const len = fn.length

  return (...rest: any[]) => {
    if (args.length + rest.length >= len) {
      return fn(...args, ...rest)
    }
    return curry(fn, ...[...args, ...rest])
  }
}
