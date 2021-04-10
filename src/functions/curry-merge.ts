import { FunctionTypes, getType } from '../util/type-util'
import ObjectFunction = FunctionTypes.ObjectFunction

/**
 * This works like partial, but instead of having arguments inline, it merges the arguments
 * This is used when we use parameter destructuring rather than a parameter list
 * Taken from rambda partialCurry (not ramda)
 * @param fn The function to call
 * @param args The partial arguments provided
 */
export function curryMerge(fn: Function, args: Object = {}): ObjectFunction {
  return (rest) => {
    if (getType(fn) === 'Async' || getType(fn) === 'Promise') {
      return new Promise((resolve, reject) => {
        fn({ ...rest, ...args })
          .then(resolve)
          .catch(reject)
      })
    }

    return fn({ ...rest, ...args })
  }
}
