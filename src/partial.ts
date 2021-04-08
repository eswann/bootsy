import { FunctionTypes } from './util/type-util'
import StandardFunction = FunctionTypes.StandardFunction

/**
 * Returns a partial curried function with the provided arguments
 * Taken from rambda (not ramda)
 * @param fn The function to create a partial for
 * @param args The args to include in the function by default
 * @returns The partial curried function
 */
export function partial (fn: Function, ...args: any[]): StandardFunction {
  const len = fn.length

  return (...rest: any[]) => {
    if (args.length + rest.length >= len) {
      return fn(...args, ...rest)
    }
    return partial(fn, ...[...args, ...rest])
  }
}
